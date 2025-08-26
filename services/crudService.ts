import { CrudAdapter } from "@/adapter/crudAdapter";
import Toast from "react-native-toast-message";

export class CrudService {
  constructor(private crudAdapter: CrudAdapter) {}

  // Example: user-related CRUD
  async createUser(values: { email: string; name: string }) {
    return this.crudAdapter.create("users", values);
  }

  async getUserById(
    table: string,
    filters: Record<string, any> = {},
    options?: { orderBy?: string; ascending?: boolean },
    column: string = "*"
  ) {
    const { result, error } = await this.crudAdapter.read(
      table,
      filters,
      options,
      column
    );

    if (error) {
      Toast.show({
        type: "error",
        text1: "Failed to get user",
        text2: error.message,
      });
      throw new Error(error.message);
    }
    return { result, error };
  }
  async updateUser(id: string, values: { name?: string }) {
    return this.crudAdapter.update("users", id, values);
  }

  async deleteUser(id: string) {
    return this.crudAdapter.delete("users", id);
  }

  // Example: posts
  async createPost(values: {
    title: string;
    content: string;
    user_id: string;
  }) {
    return this.crudAdapter.create("posts", values);
  }
}
