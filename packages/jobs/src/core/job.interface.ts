
export interface Job<T = any> {
    id: string | number | null;
    name: string;
    data: T;
    attemptsMade: number;
    failedReason?: string;
    returnvalue?: unknown;
    timestamp: number;
}
