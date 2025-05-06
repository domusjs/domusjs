import { container } from 'tsyringe';

import { CommandBus } from '../../../../core/src/application/bus/command-bus';
import { CommandHandler } from '../../../../core/src/application/handler';
import { Command } from '../../../../core/src/application/command';

export class InMemoryCommandBus implements CommandBus {
  async dispatch<C extends Command, R = void>(command: C): Promise<R> {
    const handlerToken = `${command.type}Handler`;

    try {
      const handler = container.resolve<CommandHandler<C, R>>(handlerToken);
      return handler.execute(command);
    } catch {
      throw new Error(
        `Command handler not found for type "${command.type}". Did you forget to register it?`
      );
    }
  }
}
