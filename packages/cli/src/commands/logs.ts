import { loadJanusConfigFile } from '@jujulego/janus-common';
import { ILog, LogFragment } from '@jujulego/janus-types';
import { lastValueFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { gql } from 'graphql.macro';

import { JanusClient } from '../client';
import { logger } from '../logger';
import { CommandHandler } from '../wrapper';

// Types
interface ILogsData {
  logs: ILog[];
}

interface ILogsEvent {
  logs: ILog;
}

interface LogsArgs {
  follow: boolean;
}

// Utils
const remoteLogger = logger.child({ label: 'Nest' });

// Handler
export const logsCommand: CommandHandler<LogsArgs> = async (args) => {
  try {
    // Load config
    logger.spin('Connecting to proxy server ...');
    const config = await loadJanusConfigFile(args.config, logger);

    // Existing logs
    const client = new JanusClient(config);
    const { logs } = await client.query<ILogsData>(gql`
      query Logs {
        logs {
          ...Log
        }
      }
      
      ${LogFragment}
    `);

    logger.stop();

    for (const log of logs) {
      remoteLogger.log(log.level, log.message, { ...log.metadata, timestamp: log.timestamp });
    }

    // Subscribe to events
    if (args.follow) {
      await lastValueFrom(client.subscription<ILogsEvent>(gql`
        subscription Logs {
          logs {
            ...Log
          }
        }

        ${LogFragment}
      `)
      .pipe(
        map((data) => data.logs),
        tap((log) => remoteLogger.log(log.level, log.message, { ...log.metadata, timestamp: log.timestamp }))
      ));
    }

    return 0;
  } catch (error) {
    console.error(error);
    return 1;
  }
};
