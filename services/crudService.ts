import { CrudAdapter, ReadOptions } from "@/adapter/crudAdapter";
import { getErrorMessage } from "@/utils";
import { Alert } from "react-native";

export class CrudService {
  constructor(private crudAdapter: CrudAdapter) {}

  // CRUD
  async create<T>(table: string, payload: Partial<T>) {
    return await this.crudAdapter.create(table, payload);
  }

  async read(
    table: string,
    options?: { orderBy?: string; ascending?: boolean },
    column: string = "*"
  ): Promise<{ result: any[]; error: unknown | null }> {
    try {
      const { data, error } = await this.crudAdapter.read(
        table,
        options,
        column
      );
      if (error) throw new Error(error.message);
      return { result: data, error };
    } catch (err) {
      return new Promise((resolve, reject) => {
        Alert.alert("Something went wrong", getErrorMessage(err), [
          { text: "Cancel", style: "cancel", onPress: () => reject(err) },
        ]);
      });
    }
  }

  async getUserById<T>(
    table: string,
    filters: Partial<T> = {},
    column: string,
    options?: ReadOptions
  ): Promise<{ result: any[]; count: number }> {
    try {
      const { data, error, count } = await this.crudAdapter.readById(
        table,
        filters,
        column,
        options
      );
      if (error) throw new Error(error.message);
      console.log(error);
      return { result: data, count: count ?? 0 };
    } catch (err: unknown) {
      return new Promise((resolve, reject) => {
        Alert.alert("Something went wrong", getErrorMessage(err), [
          { text: "Cancel", style: "cancel", onPress: () => reject(err) },
        ]);
      });
      // throw err instanceof Error ? err : new Error(String(err));
    }
  }
  async updateUser<T>(table: string, id: string, payload: Partial<T>) {
    return await this.crudAdapter.update(table, id, payload);
  }

  async deleteUser(id: string) {
    return await this.crudAdapter.delete("users", id);
  }

  // Example: posts
  async createPost(values: {
    title: string;
    content: string;
    user_id: string;
  }) {
    return await this.crudAdapter.create("posts", values);
  }

  async rpcCall<T>(fn: string, params: Partial<T>) {
    return await this.crudAdapter.rpc(fn, params);
  }
}
