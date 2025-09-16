import { CrudAdapter } from "@/adapter/crudAdapter";
import { CrudService } from "@/services/crudService";
import { Client } from "@/utils/client";

const client = new Client();
const crudAdapter = new CrudAdapter(client);
const crudService = new CrudService(crudAdapter);

export function useCrud() {
  //   const queryClient = useQueryClient();

  //   return useMutation({
  //     mutationFn: (values: { email: string; name: string }) =>
  //       crudService.createUser(values),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["users"] });
  //     },
  //   });
  // }

  async function getUserById(
    table: string,
    filters: Record<any, any> = {},
    column: string
  ) {
    return await crudService.getUserById(table, filters, column);
  }

  // function updateUser() {
  //   // const queryClient = useQueryClient();
  //   crudService.updateUser(id, values),

  //   return useMutation({
  //     mutationFn: ({ id, values }: { id: string; values: { name?: string } }) =>
  //     onSuccess: (_, variables) => {
  //       queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
  //     },
  //   });
  // }

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

  return { getUserById };
}
