import chalk from 'chalk';
import { GraphQLClient } from 'graphql-request';
import gql from 'graphql-tag';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { CommandBuilder } from 'yargs';
import WebSocket from 'ws';

import { ILog, LogFragment } from '@jujulego/janus-common';
import { JanusConfig } from '@jujulego/janus-config';

import { commandWrapper, CommonArgs } from '../helpers';
import { LOG_LEVELS, logger, LogLevel } from '../logger';

// Types
interface ILogsData {
  logs: ILog[];
}

interface LogsArgs extends CommonArgs {
  follow: boolean;
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
    const client = new GraphQLClient(`http://localhost:${config.control.port}/graphql`);
    const { logs } = await client.request<ILogsData>(gql`
      query Logs {
        logs {
          ...Log
        }
      }
      
      ${LogFragment}
    `);

    logger.stop();

    for (const log of logs) {
      let { message, level } = log;

      if (log.metadata.context) {
        message = chalk`{grey [${log.metadata.context}]} ${log.message}`;
      }

      if (!LOG_LEVELS.includes(level)) {
        level = 'info';
      }

      logger.log(level as LogLevel, message);
    }

    // Subscribe to events
    if (args.follow) {
      const sclient = new SubscriptionClient(
        `http://localhost:${config.control.port}/graphql`,
        { lazy: true, reconnect: true },
        WebSocket,
      );

      const obs = sclient.request({
        query: gql`
          subscription Logs {
            logs {
              ...Log
            }
          }

          ${LogFragment}
        `
      });

      obs.subscribe({
        next(value) {
          const log = value.data?.logs as ILog;
          if (!log) return;

          let { message, level } = log;

          if (log.metadata.context) {
            message = chalk`{grey [${log.metadata.context}]} ${log.message}`;
          }

          if (!LOG_LEVELS.includes(level)) {
            level = 'info';
          }

          logger.log(level as LogLevel, message);
        },
        error(error) {
          logger.error(error);
        },
      });
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
