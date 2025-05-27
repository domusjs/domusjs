import { CommandBus } from '../../../../core/src/application/bus/command-bus';
import { CommandHandler } from '../../../../core/src/application/handler';
import { Command } from '../../../../core/src/application/command';
import { container } from 'tsyringe';

export class InMemoryCommandBus implements CommandBus {
  private handlers: Map<string, CommandHandler<any, any>> = new Map();

  register<C extends Command, R>(
    commandClass: { TYPE: string },
    handlerClass: new (...args: any[]) => CommandHandler<C, R>
  ) {
    const handlerInstance = container.resolve(handlerClass);
    this.handlers.set(commandClass.TYPE, handlerInstance);
  }

  async dispatch<C extends Command, R = void>(command: C): Promise<R> {
    const handler = this.handlers.get(command.type);

    if (!handler) {
      throw new Error(`Command handler not found for type "${command.type}"`);
    }

    return handler.execute(command);
  }
}
