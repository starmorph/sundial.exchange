export { };

declare global {
    interface Window {
        twq?: {
            (command: string, eventId: string, payload?: Record<string, unknown>): void;
            exe?: (...args: unknown[]) => void;
            queue?: unknown[];
            version?: string;
        };
    }
}


