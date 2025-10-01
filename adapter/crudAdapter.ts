import { Client } from "@/utils/client";

export interface ReadOptions {
  or?: string;
  order?: { column: string; ascending: boolean };
  range?: { from: number; to: number };
  count?: "exact" | "planned" | "estimated";
  lt?: { column: string; value: any };
}
export class CrudAdapter {
  constructor(private client: Client) {}

  create<T>(table: string, payload: Partial<T>) {
    return this.client.supabase.from(table).insert(payload);
  }

  read(
    table: string,
    options?: { orderBy?: string; ascending?: boolean },
    column: string = "*"
  ) {
    let query = this.client.supabase.from(table).select(column);

    // Apply ordering if specified
    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.ascending ?? true,
      });
    }

    // const { data, error } = await query;

    // const result = data as T[];
    return query;
  }

  async readById<T>(
    table: string,
    filters: Partial<T> = {},
    column: string = "*",
    options: ReadOptions = {}
  ) {
    let query = this.client.supabase
      .from(table)
      .select(column, { count: "exact" });

    for (const key in filters) {
      query = query.eq(key, filters[key] as any);
    }
    if (options.or) query = query.or(options.or);
    if (options.order)
      query = query.order(options.order.column, {
        ascending: options.order.ascending,
      });
    if (options.range)
      query = query.range(options.range.from, options.range.to);
    if (options.lt) query = query.lt(options.lt.column, options.lt.value);
    return await query;
  }

  update<T>(table: string, id: string | number, payload: Partial<T>) {
    return this.client.supabase
      .from(table)
      .update(payload)
      .eq("id", id)
      .select();
  }

  delete(table: string, id: string | number) {
    return this.client.supabase.from(table).delete().eq("id", id);
  }

  rpc<T>(fn: string, params?: Partial<T>) {
    return this.client.supabase.rpc(fn, params);
  }
}
