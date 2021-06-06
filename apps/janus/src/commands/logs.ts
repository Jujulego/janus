import chalk from 'chalk';
import { GraphQLClient } from 'graphql-request';
import gql from 'graphql-tag';
import { CommandBuilder } from 'yargs';

import { ILog, LogFragment } from '@jujulego/janus-common';
import { JanusConfig } from '@jujulego/janus-config';

import { commandWrapper, CommonArgs } from '../helpers';

// Types
interface ILogsData {
  logs: ILog[];
}

// Constants
const LEVELS: Record<string, (txt: string) => string | undefined> = {
  debug: chalk.blue,
  verbose: chalk.cyan,
  warn: chalk.yellow,
  error: chalk.red
};

// Command
export const command = 'logs';
export const describe = 'Print proxy logs';

export const builder: CommandBuilder = {};

export const handler = commandWrapper(async (args: CommonArgs) => {
  try {
    // Load config
    const config = await JanusConfig.loadFile(args.config);

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

    for (const log of logs) {
      const fmt = LEVELS[log.level] || ((txt) => txt);

      if (log.metadata.context) {
        console.log(chalk`{grey [${log.metadata.context}]} ${fmt(log.message)}`);
      } else {
        console.log(fmt(log.message));
      }
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
