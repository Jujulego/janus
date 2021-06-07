import chalk from 'chalk';
import gql from 'graphql-tag';
import { CommandBuilder } from 'yargs';

import { ILog, LogFragment } from '@jujulego/janus-common';
import { JanusConfig } from '@jujulego/janus-config';

import { commandWrapper, CommonArgs } from '../helpers';
import { LOG_LEVELS, logger, LogLevel } from '../logger';
import { JanusClient } from '../client';
import { map } from 'rxjs/operators';

// Types
interface ILogsData {
  logs: ILog[];
}

interface ILogsEvent {
  logs: ILog;
}

interface LogsArgs extends CommonArgs {
  follow: boolean;
}

// Utils
function printLog(log: ILog) {
  let { message, level } = log;

  if (log.metadata.context) {
    message = chalk`{grey [${log.metadata.context}]} ${log.message}`;
  }

  if (!LOG_LEVELS.includes(level)) {
    level = 'info';
  }

  logger.log(level as LogLevel, message);
}

// Command
export const command = 'logs';
export const describe = 'Print proxy logs';

export const builder: CommandBuilder = {
  follow: {
    alias: 'f',
    boolean: true,
    default: false,
  }
};

export const handler = commandWrapper(async (args: LogsArgs) => {
  try {
    // Load config
    logger.spin('Connecting to proxy server ...');
    const config = await JanusConfig.loadFile(args.config, { logger });

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
      client.subscription<ILogsEvent>(gql`
        subscription Logs {
          logs {
            ...Log
          }
        }

        ${LogFragment}
      `)
      .pipe(map((data) => data.logs))
      .subscribe(printLog);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
