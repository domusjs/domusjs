import { Command } from '../command';

/**
 * CommandBus is responsible for dispatching commands to their corresponding handlers.
 * It follows the CQRS pattern, allowing the application to trigger operations (side-effects)
 * without coupling to specific implementations.
 *
 * While commands typically do not return data (write-only), this interface allows handlers
 * to optionally return a result when useful (e.g., for confirmation tokens or generated IDs).
 */
export interface CommandBus {
  /**
   * Dispatches a command.
   * @param command - The command to dispatch
   */
  dispatch<T extends Command, R = void>(command: T): Promise<R>;
}
