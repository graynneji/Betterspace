import { CrudAdapter, ReadOptions } from "@/adapter/crudAdapter";
import { CrudService } from "@/services/crudService";
import { Client } from "@/utils/client";
import { queryClient } from "@/utils/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";

const client = new Client();
const crudAdapter = new CrudAdapter(client);
const crudService = new CrudService(crudAdapter);

export function useCrudCreate<T>(
  table: string,
  invalidateKeys?: any[] | any[][]
) {
  return useMutation({
    mutationFn: (payload: Partial<T>) => crudService.create(table, payload),
    onSuccess: () => {
      if (Array.isArray(invalidateKeys?.[0])) {
        // case: multiple keys
        (invalidateKeys as any[][]).forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      } else {
        // case: single key
        queryClient.invalidateQueries({
          queryKey: (invalidateKeys as any[]) ?? [table],
        });
      }
    },
  });
}

export function useGetAll(
  table: string,
  options?: { orderBy?: string; ascending?: boolean },
  column: string = "*"
) {
  return useQuery({
    queryKey: [table, JSON.stringify(options), column],
    queryFn: async ({ queryKey }) => {
      const [table, options, column] = queryKey as [string, string, string];
      return await crudService.read(table, JSON.parse(options), column);
    },
    retry: false,
  });
}

export function useGetById<T>(
  table: string,
  filters: Partial<T>,
  column: string,
  enabled: boolean = true,
  options?: ReadOptions // ✅ Add this
) {
  return useQuery({
    queryKey: [table, JSON.stringify(filters), column, JSON.stringify(options)],
    queryFn: async ({ queryKey }) => {
      const [table, filter, column, options] = queryKey as [
        string,
        string,
        string,
        string,
      ];
      return await crudService.getUserById<T>(
        table,
        JSON.parse(filter),
        column,
        JSON.parse(options)
      );
    },
    enabled,
    retry: false,
  });
}

export function useUpdate<T>(table: string, id: string, invalidateKey?: any[]) {
  return useMutation({
    mutationFn: (payload: Partial<T>) =>
      crudService.updateUser(table, id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: invalidateKey ?? [table] }),
  });
}

// function deleteUser() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) => crudService.deleteUser(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     },
//   });
// }

// 🔹 Example for posts
// function createPost() {
//   const queryClient = useQueryClient();

//   const {data, error, loading} = useMutation({
//     mutationFn: (values: { title: string; content: string; user_id: string }) =>
//       crudService.createPost(values),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//     },
//   });

//   return { useGetById, create };
// }

export function useRpc<T>(fn: string, invalidateKey?: any[]) {
  return useMutation({
    mutationFn: (params: Partial<T>) => crudService.rpcCall(fn, params),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: invalidateKey ?? [] }),
  });
}
export async function useSpecialLikes(
  table: string,
  filters: any,
  column: string,
  options?: ReadOptions
): Promise<{ result: any[]; count: number }> {
  return await crudService.getUserById(table, filters, column, {
    ...options,
    // count: "exact",
  });
}
