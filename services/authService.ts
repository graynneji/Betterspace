import { AuthAdapter } from "@/adapter/authAdapter";
import { getErrorMessage } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

export class AuthService {
  constructor(private authAdapter: AuthAdapter) {}

  async register<T>(email: string, password: string, others: Partial<T>) {
    const { data, error } = await this.authAdapter.signUp(
      email,
      password,
      others
    );
    if (error) {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: error.message,
      });
      return;
    }
    if (data?.session)
      Toast.show({
        type: "info",
        text1: "Check your email",
        text2: "Please verify your email to continue.",
      });
    return { data, error };
  }
  async login(email: string, password: string) {
    const { data, error } = await this.authAdapter.signIn(email, password);
    if (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message,
      });
      return;
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
      return;
    }
    return { error };
  }

  async checkUser(): Promise<any> {
    const { data, error } = await this.authAdapter.getUser();
    console.log("user check", error);
    //work on this come back later and put an alert
    if (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message,
      });
      throw new Error(error.message);
    }
    // if (error) {
    //   throw new Error("You are not authenticated");
    // }
    return { data, error };
  }

  // async refreshSession(): Promise<any> {
  //   try {
  //     const { data, error } = await this.authAdapter.refreshOrClearSession();
  //     if (error) {
  //       await AsyncStorage.removeItem("supabase.auth.token");
  //       throw new Error(error.message);
  //     }
  //   } catch (err: unknown) {
  //     return new Promise((resolve, reject) => {
  //       Alert.alert("Something went wrong", getErrorMessage(err), [
  //         { text: "Cancel", style: "cancel", onPress: () => reject(err) },
  //       ]);
  //     });
  //   }

  //   // check later the error
  //   // console.log("eeeeeeeeeeeee", error);
  //   // if (error || !data.session) {
  //   //   // session invalid or expired, remove local storage
  //   //   // throw new Error("Session expired, please log in again.");
  //   // }
  // }

  async refreshSession(): Promise<{ success: boolean }> {
    try {
      const { data, error } = await this.authAdapter.refreshOrClearSession();
      if (error) {
        await AsyncStorage.removeItem("supabase.auth.token");
        return { success: false };
      }
      return { success: true };
    } catch (err: unknown) {
      return new Promise((resolve) => {
        Alert.alert(
          "Session expired, please login again",
          getErrorMessage(err),
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => resolve({ success: false }),
            },
          ]
        );
      });
    }
  }

  onAuthChange(callback: (session: Session | null) => void) {
    return this.authAdapter.onAuthStateChange(callback);
  }
}
