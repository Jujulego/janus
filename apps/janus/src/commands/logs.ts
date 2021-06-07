import chalk from 'chalk';
import { GraphQLClient } from 'graphql-request';
import gql from 'graphql-tag';
import { CommandBuilder } from 'yargs';

import { ILog, LogFragment } from '@jujulego/janus-common';
import { JanusConfig } from '@jujulego/janus-config';

import { commandWrapper, CommonArgs } from '../helpers';
import { LOG_LEVELS, logger, LogLevel } from '../logger';

// Types
interface ILogsData {
  logs: ILog[];
}

// Command
export const command = 'logs';
export const describe = 'Print proxy logs';

export const builder: CommandBuilder = {};

export const handler = commandWrapper(async (args: CommonArgs) => {
  try {
    // Load config
    logger.spin('Connecting to proxy server ...');
    const config = await JanusConfig.loadFile(args.config, { logger });

    // Existing logs
    const client = new GraphQLClient(`http://localhost:${config.control.port}/graphql`,);
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
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
