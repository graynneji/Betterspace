// app.config.js
export default ({ config }: { config: any }) => ({
  ...config,
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  },
  name: "Betterspace",
  slug: "Betterspace",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splashIcon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff", // light
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/logo.png",
      backgroundColor: "#4e7560",
    },
  },
  ios: {
    splash: {
      image: "./assets/images/splashIcon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
  },
});
