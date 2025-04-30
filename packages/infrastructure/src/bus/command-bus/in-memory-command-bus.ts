import { container } from 'tsyringe';
import { Command, CommandBus, CommandHandler } from '@domusjs/core';

export class InMemoryCommandBus implements CommandBus {
  async dispatch<C extends Command>(command: C): Promise<void> {
    const handlerToken = `${command.type}Handler`;

    try {
      const handler = container.resolve<CommandHandler<C>>(handlerToken);
      await handler.execute(command);
    } catch {
      throw new Error(
        `Command handler not found for type "${command.type}". Did you forget to register it?`
      );
    }
  }
}
