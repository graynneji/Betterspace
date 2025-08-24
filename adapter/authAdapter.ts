import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, Session, SupabaseClient } from "@supabase/supabase-js";
import { AppState } from "react-native";

export class AuthAdapter {
  private supabase: SupabaseClient;
  appStateSub: any;
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "SUPABASE_URL and SUPABASE_ANON_KEY must be defined in environment variables."
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    this.init();
  }

  private init() {
    AppState.addEventListener("change", (state) => {
      if (state === "active") {
        this.supabase.auth.startAutoRefresh();
      } else {
        this.supabase.auth.stopAutoRefresh();
      }
    });
  }
  destroy() {
    this.appStateSub?.remove();
    this.appStateSub = null;
  }
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }
  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
    return { data, error };
  }
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }
  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (session: Session | null) => void) {
    const { data: subscription } = this.supabase.auth.onAuthStateChange(
      (_event, session) => {
        callback(session);
      }
    );
    return subscription; // caller can unsubscribe
  }
}
