/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// const tintColorLight = '#0a7ea4';
// const tintColorDark = '#fff';

// export const Colors = {
//   light: {
//     text: '#11181C',
//     background: '#fff',
//     tint: tintColorLight,
//     icon: '#687076',
//     tabIconDefault: '#687076',
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
//     text: '#ECEDEE',
//     background: '#151718',
//     tint: tintColorDark,
//     icon: '#9BA1A6',
//     tabIconDefault: '#9BA1A6',
//     tabIconSelected: tintColorDark,
//   },
// };

/**
 * Colors configuration for light and dark themes
 */

// export const Colors = {
//   light: {
//     // Background colors
//     background: '#f8f9fa',
//     surface: '#ffffff',
//     headerBackground: '#f9fafb',

//     // Text colors
//     text: '#333333',
//     textSecondary: '#666666',
//     textTertiary: '#999999',
//     placeholder: '#9ca3af',

//     // Message colors
//     senderBubble: '#4CAF50',
//     senderText: '#ffffff',
//     receiverBubble: '#ffffff',
//     receiverText: '#333333',
//     timestamp: 'rgba(255, 255, 255, 0.7)',
//     timestampReceiver: '#999999',

//     // Input colors
//     inputBackground: '#ffffff',
//     inputBorder: '#e0e0e0',
//     inputText: '#333333',

//     // Button colors
//     primary: '#4CAF50',
//     primaryText: '#ffffff',
//     callButton: '#f5f5f5',
//     danger: '#f44336',

//     // Status colors
//     online: '#4CAF50',
//     offline: '#999999',
//     sending: '#ffa726',
//     failed: '#f44336',

//     // Border colors
//     border: '#e0e0e0',
//     divider: '#f0f0f0',

//     // Icon colors
//     icon: '#333333',
//     iconSecondary: '#666666',
//   },

//   dark: {
//     // Background colors
//     background: '#0f0f0f',
//     surface: '#1a1a1a',
//     headerBackground: '#1a1a1a',

//     // Text colors
//     text: '#e5e5e5',
//     textSecondary: '#a0a0a0',
//     textTertiary: '#707070',
//     placeholder: '#6b7280',

//     // Message colors
//     senderBubble: '#2d7a3e',
//     senderText: '#ffffff',
//     receiverBubble: '#2a2a2a',
//     receiverText: '#e5e5e5',
//     timestamp: 'rgba(255, 255, 255, 0.5)',
//     timestampReceiver: '#707070',

//     // Input colors
//     inputBackground: '#2a2a2a',
//     inputBorder: '#3a3a3a',
//     inputText: '#e5e5e5',

//     // Button colors
//     primary: '#4CAF50',
//     primaryText: '#ffffff',
//     callButton: '#2a2a2a',
//     danger: '#f44336',

//     // Status colors
//     online: '#4CAF50',
//     offline: '#707070',
//     sending: '#ffa726',
//     failed: '#f44336',

//     // Border colors
//     border: '#3a3a3a',
//     divider: '#2a2a2a',

//     // Icon colors
//     icon: '#e5e5e5',
//     iconSecondary: '#a0a0a0',
//   },
// };

// /**
//  * Get colors based on current theme
//  * @param isDark - Whether dark mode is active
//  * @returns Color palette for the current theme
//  */
// export const getColors = (isDark: boolean) => {
//   return isDark ? Colors.dark : Colors.light;
// };

// /**
//  * Export individual theme objects for direct access
//  */
// export const LightColors = Colors.light;
// export const DarkColors = Colors.dark;

/**
 * Colors configuration for light and dark themes
 */

/**
 * Colors configuration for light and dark themes
 * Compatible with useThemeColor hook
 */

const tintColorLight = "#4CAF50";
const tintColorDark = "#4CAF50";

export const Colors = {
  light: {
    text: "#1f2937",
    background: "#f7f9fc",
    tint: tintColorLight,
    icon: "#4b5563",
    tabIconDefault: "#9ca3af",
    tabIconSelected: tintColorLight,

    // Background variations
    surface: "#ffffff",
    headerBackground: "#ffffff",
    item: "#f8f9fa",

    // Text variations
    textSecondary: "#6b7280",
    textTertiary: "#9ca3af",
    placeholder: "#a1a9b8",

    // Message colors
    senderBubble: "#4CAF50",
    senderText: "#ffffff",
    receiverBubble: "#f3f4f6",
    receiverText: "#1f2937",
    timestamp: "rgba(255, 255, 255, 0.8)",
    timestampReceiver: "#9ca3af",

    // Input colors
    inputBackground: "#ffffff",
    inputBorder: "#e5e7eb",
    inputText: "#1f2937",

    // Button colors
    primary: "#4CAF50",
    primaryText: "#ffffff",
    callButton: "#f9fafb",
    danger: "#ef4444",

    // Status colors
    online: "#4CAF50",
    offline: "#9ca3af",
    sending: "#f59e0b",
    failed: "#ef4444",

    // Border colors
    border: "#e5e7eb",
    divider: "#f3f4f6",

    // Icon variations
    iconSecondary: "#9ca3af",

    // Therapy-specific colors
    calm: "#e0f2f1",
    trust: "#e8f5e9",
    warmth: "#fff8e1",
  },

  dark: {
    text: "#e8eaf0",
    background: "#0a0e1a",
    tint: tintColorDark,
    icon: "#d1d5db",
    tabIconDefault: "#7b8794",
    tabIconSelected: tintColorDark,

    // Background variations
    surface: "#141b2d",
    headerBackground: "#1a2332",
    item: "#1e2742",

    // Text variations
    textSecondary: "#a5b4c7",
    textTertiary: "#7b8794",
    placeholder: "#697586",

    // Message colors
    senderBubble: "#4CAF50",
    senderText: "#ffffff",
    receiverBubble: "#1f2937",
    receiverText: "#e8eaf0",
    timestamp: "rgba(255, 255, 255, 0.6)",
    timestampReceiver: "#7b8794",

    // Input colors
    inputBackground: "#1f2937",
    inputBorder: "#374151",
    inputText: "#e8eaf0",

    // Button colors
    primary: "#4CAF50",
    primaryText: "#ffffff",
    callButton: "#1f2937",
    danger: "#ef4444",

    // Status colors
    online: "#4CAF50",
    offline: "#7b8794",
    sending: "#f59e0b",
    failed: "#ef4444",

    // Border colors
    border: "#374151",
    divider: "#1f2937",

    // Icon variations
    iconSecondary: "#9ca3af",

    // Therapy-specific colors
    calm: "#1a3a3a",
    trust: "#1a3b28",
    warmth: "#3a2f1a",
  },
};

/**
 * Get colors based on current theme
 * @param isDark - Whether dark mode is active
 * @returns Color palette for the current theme
 */
export const getColors = (isDark: boolean) => {
  return isDark ? Colors.dark : Colors.light;
};

/**
 * Export individual theme objects for direct access
 */
export const LightColors = Colors.light;
export const DarkColors = Colors.dark;
