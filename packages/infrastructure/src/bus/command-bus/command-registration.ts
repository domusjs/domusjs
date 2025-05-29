import { container } from 'tsyringe';
import { CommandBus } from '../../../../core/src/application/bus/command-bus';
import { Command } from '../../../../core/src/application/command';
import { CommandHandler } from '../../../../core/src/application/handler';

export function registerCommandHandler<C extends Command, R>(
  commandBus: CommandBus,
  commandClass: { TYPE: string },
  handlerClass: new (...args: any[]) => CommandHandler<C, R>
) {
  container.register(handlerClass, { useClass: handlerClass });
  commandBus.register(commandClass, handlerClass);
}
