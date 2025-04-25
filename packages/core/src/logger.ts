/**
 * Logger interface for consistent logging across applications.
 * Provides methods for different log levels (info, warn, error, debug).
 */

export interface Logger {


info(message: string, context?: any): void;
  warn(message: string, context?: any): void;
  error(message: string, context?: any): void;
  debug?(message: string, context?: any): void;
}
