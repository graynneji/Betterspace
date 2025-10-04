export const isToday = (timestamp: string) => {
  if (!timestamp) return false;
  const today = new Date();
  const messageDate = new Date(timestamp);
  return (
    messageDate.getDate() === today.getDate() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getFullYear() === today.getFullYear()
  );
};

// export const formatTime = (timestamp: string) => {
//   if (!timestamp) return "";
//   const date = new Date(timestamp);
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// };

export const formatTime = (
  date: string | Date,
  use24hr: boolean = false
): string => {
  const d = typeof date === "string" ? new Date(date) : date;

  return use24hr
    ? d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
};

export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(undefined, options);
};

export const formatDateTime = (
  date: string | Date,
  use24hr: boolean = false
): string => {
  return `${formatDate(date)} ${formatTime(date, use24hr)}`;
};

export const timeAgo = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  if (diffMins < 2880) return "yesterday";
  return formatDate(d);
};

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Something went wrong";
}

export const formatThreadTime = (timestamp: string): string => {
  const now = new Date();
  const postTime = new Date(timestamp);
  const diffInHours = Math.floor(
    (now.getTime() - postTime.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w ago`;
};

export function capitalizeFirstLetter(str: string | undefined): string {
  if (!str) return ""; // handle null, undefined, or empty string

  return str.charAt(0).toUpperCase() + str.slice(1);
}
