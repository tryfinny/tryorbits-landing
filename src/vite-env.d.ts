/// <reference types="vite/client" />

declare function gtag(
  command: "event",
  action: string,
  params?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    send_to?: string;
    transport_type?: "beacon";
    event_callback?: () => void;
    [key: string]: unknown;
  }
): void;

declare function gtag(command: "config" | "js", ...args: unknown[]): void;
