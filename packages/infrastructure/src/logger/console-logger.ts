
import { Logger } from '@domusjs/core';

export class ConsoleLogger implements Logger {
    info(msg: string) {
        console.log('[INFO]', msg);
    }

    error(msg: string) {
        console.error('[ERROR]', msg);
    }

    warn(msg: string) {
        console.warn('[WARN]', msg);
    }
}
