import { Client } from "@/utils/client";

export class CrudAdapter {
  constructor(private client: Client) {}

  async create<T>(table: string, payload: Partial<T>) {
    const { data, error } = await this.client.supabase
      .from(table)
      .insert(payload)
      .select();
    if (error) throw error;
    return data;
  }

  async read<T>(
    table: string,
    filters: Record<string, any> = {},
    options?: { orderBy?: string; ascending?: boolean },
    column: string = "*"
  ) {
    let query = this.client.supabase.from(table).select(column);

    // Apply filters dynamically
    for (const key in filters) {
      query = query.eq(key, filters[key]);
    }

    // Apply ordering if specified
    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.ascending ?? true,
      });
    }

    const { data, error } = await query;

    const result = data as T[];
    return { result, error };
  }

  async readById<T>(table: string, id: string | number) {
    const { data, error } = await this.client.supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .single(); // ✅ Ensures only one row is returned
    if (error) throw error;
    return data as T;
  }

  async update<T>(table: string, id: string | number, payload: Partial<T>) {
    const { data, error } = await this.client.supabase
      .from(table)
      .update(payload)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data;
  }

  async delete(table: string, id: string | number) {
    const { error } = await this.client.supabase
      .from(table)
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }
}
