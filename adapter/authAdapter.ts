import { Client } from "@/utils/client";
import { Session } from "@supabase/supabase-js";
import { AppState } from "react-native";

export class AuthAdapter {
  appStateSub: any;
  constructor(private client: Client) {
    this.init();
  }

  private init() {
    this.appStateSub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        this.client.supabase.auth.startAutoRefresh();
      } else {
        this.client.supabase.auth.stopAutoRefresh();
      }
    });
  }
  destroy() {
    this.appStateSub?.remove();
    this.appStateSub = null;
  }
  async signIn(email: string, password: string) {
    const { data, error } = await this.client.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }
  async signUp(email: string, password: string) {
    const { data, error } = await this.client.supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }
  async getUser() {
    const { data, error } = await this.client.supabase.auth.getSession();
    return { data, error };
  }
  async signOut() {
    const { error } = await this.client.supabase.auth.signOut();
    return { error };
  }
  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (session: Session | null) => void) {
    const {
      data: { subscription },
    } = this.client.supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
    return subscription; // caller can unsubscribe
  }
  async refreshOrClearSession() {
    const { data, error } = await this.client.supabase.auth.refreshSession();
    console.log(data, error, "data, error");
    return { data, error };
  }
}
