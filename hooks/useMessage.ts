import { CrudAdapter, ReadOptions } from "@/adapter/crudAdapter";
import { CrudService } from "@/services/crudService";
import { Client } from "@/utils/client";
import { useEffect, useState } from "react";

interface UseRealTimeProps {
  table: string;
  filters: Record<any, any>;
  column: string;
  options?: ReadOptions;
  pageSize?: number;
  senderId: string;
  receiverId: string;
}

const client = new Client();
const crudAdapter = new CrudAdapter(client);
const crudService = new CrudService(crudAdapter);

export function useMessage({
  table,
  filters,
  column,
  options,
  pageSize = 30,
  senderId,
  receiverId,
}: UseRealTimeProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    if (!senderId || !receiverId) return;
    const fetchInitial = async () => {
      // Step 1: get total count
      const { count } = await crudService.getUserById(table, filters, column, {
        ...options,
        count: "exact",
      });
      // Step 2: calculate range
      const from = Math.max((count ?? 0) - pageSize, 0);
      const to = (count ?? 0) - 1;

      // Step 3: fetch latest N messages
      const { result } = await crudService.getUserById(table, filters, column, {
        ...options,
        order: { column: "created_at", ascending: true },
        range: { from, to },
      });

      setMessages(result);
      if ((count ?? 0) <= pageSize) setHasMore(false);
    };

    fetchInitial();

    // Realtime subscription
    const channel = client.supabase
      .channel(`chat-${filters?.sender_id}-${filters?.receiver_id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table },
        (payload: { new: any }) => {
          const newMessage = payload.new;
          const isBetweenCurrentUsers =
            (newMessage?.sender_id === senderId &&
              newMessage?.reciever_id === receiverId) ||
            (newMessage?.sender_id === receiverId &&
              newMessage?.reciever_id === senderId);

          if (isBetweenCurrentUsers) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      client.supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderId, receiverId]);

  // Fetch older messages before the oldest
  const fetchOlder = async () => {
    if (!messages.length) return;

    const oldest = messages[0]?.created_at;

    const { result } = await crudService.getUserById(table, filters, column, {
      ...options,
      order: { column: "created_at", ascending: false },
      lt: { column: "created_at", value: oldest }, // requires adapter support
      range: { from: 0, to: pageSize - 1 },
    });

    if (result.length === 0) {
      setHasMore(false);
      return;
    }

    // Prepend older messages
    setMessages((prev) => [...result.reverse(), ...prev]);
  };

  return { messages, fetchOlder, hasMore };
}
