export enum LogLevel {
  CRITICAL = 0,
  ERROR = 1,
  WARNING = 2,
  NOTIFICATION = 3,
  VERBOSE = 4
}

export interface IFSLoggingSettings {
  path: string;
  level: LogLevel;
}
export interface IDatabaseLoggingSettings {
  host: string;
  port: string;

  username: string;
  password: string;
  options: { [key: string]: string };
  database: string;
  level: LogLevel;
}

export interface IServerLoggingSettings {
  nodeLoggingLevel?: number;
  fileSystemLogging?: IFSLoggingSettings;
  databaseLoggingSettings?: IDatabaseLoggingSettings;
}

export default class ServerLogging {
  private _settings: IServerLoggingSettings;
  private _server: SocketIO.Server;

  constructor(socketServer: SocketIO.Server, settings: IServerLoggingSettings) {
    this._server = socketServer;
    this._settings = settings;

    if (this._settings.fileSystemLogging) {
      // setup for filesystem logging.
    }
    if (this._settings.databaseLoggingSettings) {
      // setup for mongoDB logging.
    }
  }

  log(level: LogLevel, message: string, line?: number) {

    // file system logging
    if (this._settings.fileSystemLogging) {
      if (level <= this._settings.fileSystemLogging.level) {
        this.fslog(message, line);
      }
    }

    // database logging
    if (this._settings.databaseLoggingSettings) {
      if (level <= this._settings.databaseLoggingSettings.level) {
        this.dblog(message, line);
      }
    }

    if (this._settings.nodeLoggingLevel && level < + this._settings.nodeLoggingLevel) {
        // simple node logging.
        const mes = (line) ? line + ":" + message : message;
        console.log(mes);

    }

  }


  fslog(message: string,line?: number) {
    // TODO: impliment
  }

  dblog(message: string,line?: number) {
    // TODO: impliment

  }
}
