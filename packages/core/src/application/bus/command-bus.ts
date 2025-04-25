import { Command } from '../command';

/**
 * Command bus interface for executing commands in the application.
 * Provides a consistent way to execute commands across different command handlers.
 */

export interface CommandBus {
  /**
   * Dispatches a command.
   * @param command - The command to dispatch
   */
  dispatch<T extends Command>(command: T): Promise<void>;
}
