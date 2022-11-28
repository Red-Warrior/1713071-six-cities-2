export default class FileReadError extends Error {
  public path: string;
  public message: string;

  constructor(path: string) {
    super();
    this.path = path;
    this.message = `Неверный путь к файлу ${this.path}`;
  }
}
