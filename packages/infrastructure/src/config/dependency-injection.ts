import { container } from 'tsyringe';
import { CommandBus, QueryBus, EventBus } from '@domusjs/core';
import { Logger } from '@domusjs/core';
import { registerAuthModule } from '@domusjs/auth';

import { InMemoryCommandBus } from '../bus/command-bus/in-memory-command-bus';
import { InMemoryQueryBus } from '../bus/query-bus/in-memory-query-bus';
import { InMemoryEventBus } from '../bus/event-bus/in-memory-event-bus';
import { PinoLogger } from '../logger/pino-logger';

export interface DomusOverrides {
  commandBus?: CommandBus;
  queryBus?: QueryBus;
  eventBus?: EventBus;
  logger?: Logger;
}

export function registerDomusCore(overrides: DomusOverrides = {}): void {
  // CommandBus
  container.register<CommandBus>('CommandBus', {
    useValue: overrides.commandBus ?? new InMemoryCommandBus(),
  });

  // QueryBus
  container.register<QueryBus>('QueryBus', {
    useValue: overrides.queryBus ?? new InMemoryQueryBus(),
  });

  // EventBus
  container.register<EventBus>('EventBus', {
    useValue: overrides.eventBus ?? new InMemoryEventBus(),
  });

  // Logger
  container.register<Logger>('Logger', {
    useValue: overrides.logger ?? new PinoLogger(),
  });

  // Modules registration
  registerAuthModule();
}
