

// This is a mock interface for authentication results used for signing JWT tokens.
// Adapt this interface to match the actual return type from your authentication service as needed.
export interface AuthResult {
    userId: string;
    email: string;
    roles: string[];
}
