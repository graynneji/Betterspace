import { AuthAdapter } from "@/adapter/authAdapter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export class AuthService {
  constructor(private authAdapter: AuthAdapter) {}

  async register(email: string, password: string) {
    const { data, error } = await this.authAdapter.signUp(email, password);
    if (error) {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: error.message,
      });
      throw new Error(error.message);
    }
    if (!data?.session)
      Toast.show({
        type: "info",
        text1: "Check your email",
        text2: "Please verify your email to continue.",
      });
  }
  async login(email: string, password: string) {
    const { data, error } = await this.authAdapter.signIn(email, password);
    if (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message,
      });
      throw new Error(error.message);
    }
    return { data };
  }
  async logout() {
    const { error } = await this.authAdapter.signOut();
    if (error) {
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: error.message,
      });
      throw new Error(error.message);
    }
    return { error };
  }

  async checkUser(): Promise<any> {
    const { data, error } = await this.authAdapter.getUser();
    if (error) {
      throw new Error("You are not authenticated");
    }
    return { data, error };
  }

  async refreshSession(): Promise<any> {
    const { data, error } = await this.authAdapter.refreshOrClearSession();
    if (error || !data.session) {
      // session invalid or expired, remove local storage
      await AsyncStorage.removeItem("supabase.auth.token");
      throw new Error("Session expired, please log in again.");
    }
  }
}
