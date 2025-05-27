import { Command } from '../command';
import { CommandHandler } from '../handler';

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

  /**
   * Registers a command handler.
   * @param commandClass - The command class to register
   * @param handlerClass - The handler class to register
   */
  register<C extends Command, R>(commandClass: { TYPE: string }, handlerClass: new (...args: any[]) => CommandHandler<C, R>): void;
}
