import { CrudAdapter } from "@/adapter/crudAdapter";
import { CrudService } from "@/services/crudService";
import { Client } from "@/utils/client";
import { queryClient } from "@/utils/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";

const client = new Client();
const crudAdapter = new CrudAdapter(client);
const crudService = new CrudService(crudAdapter);

export function useCrudCreate<T>(table: string, invalidateKey?: any[]) {
  return useMutation({
    mutationFn: (payload: Partial<T>) => crudService.create(table, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: invalidateKey ?? [table] }),
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
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [table, JSON.stringify(filters), column],
    queryFn: async ({ queryKey }) => {
      const [table, filter, column] = queryKey as [string, string, string];
      console.log(table, filter, column);
      return await crudService.getUserById<T>(
        table,
        JSON.parse(filter),
        column
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
