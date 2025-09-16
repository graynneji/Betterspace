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
    filters: Record<any, any> = {},
    column: string
  ) {
    try {
      const { data, error } = await this.crudAdapter.readById(
        table,
        filters,
        column
      );
      if (error) throw new Error(error.message);
      return { result: data ?? [] };
    } catch (err: string | unknown) {
      console.error(err);
      return { result: [] };
    }
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
