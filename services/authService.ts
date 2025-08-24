import { AuthAdapter } from "@/adapter/authAdapter";
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
    if (!data) {
      throw new Error("You are not authenticated");
    }
    return { data, error };
  }
}
