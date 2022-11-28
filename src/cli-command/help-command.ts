import chalk from 'chalk';

import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        ${chalk.hex('#fafafa').underline('Программа для подготовки данных для REST API сервера.')}
        Пример:
            ${chalk.hex('#ab6dfc')('main.js --<command> [--arguments]')}
        Команды:
            ${chalk.hex('#b5e653')('--version:                   # выводит номер версии')}
            ${chalk.hex('#64e653')('--help:                      # печатает этот текст')}
            ${chalk.hex('#53e6ab')('--import <path>:             # импортирует данные из TSV')}
            ${chalk.hex('53d0e6')('--generate <count> <path> <url> # генерирует произвольное количество <count> тестовых данных')}
        `);
  }
}
