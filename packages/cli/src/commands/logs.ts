import { JanusConfig } from '@jujulego/janus-core';
import { ILog, LogFragment } from '@jujulego/janus-types';
import { map, tap } from 'rxjs/operators';
import gql from 'graphql-tag';

import { JanusClient } from '../client';
import { logger } from '../logger';
import { CommandHandler } from '../wrapper';
import { lastValueFrom } from 'rxjs';

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
function printLog(log: ILog) {
  const { message, level, timestamp, metadata } = log;
  logger.log(level, message, { ...metadata, timestamp });
}

// Handler
export const logsCommand: CommandHandler<LogsArgs> = async (args) => {
  try {
    // Load config
    logger.spin('Connecting to proxy server ...');
    const config = await JanusConfig.loadFile(args.config);

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
      printLog(log);
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
        tap((log) => printLog(log))
      ));
    }

    return 0;
  } catch (error) {
    console.error(error);
    return 1;
  }
};
