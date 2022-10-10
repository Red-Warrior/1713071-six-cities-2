import got from 'got';
import chalk from 'chalk';
import TSVFileWriter from '../common/file-writer/tsv-file-writer.js';
import OfferGenerator from '../common/offer-generator/offer-generator.js';
import { MockData } from '../types/mock-data.type.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;

    if (!count) {
      return console.error(chalk.red('Отсутствует обязательный параметр count: Количество итераций записи данных.'));
    }
    if (!filepath) {
      return console.error(chalk.red('Отсутствует обязательный параметр filepath: Путь к файлу для записи данных.'));
    }
    if (!url) {
      return console.error(chalk.red('Отсутствует обязательный параметр url: Адрес сервера для считывания данных.'));
    }

    const offerCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(chalk.red(`Can't fetch data from ${url}.`));
    }

    const offerGeneratorString = new OfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(offerGeneratorString.generate());
    }

    console.log(`File ${filepath} was created!`);
  }
}
