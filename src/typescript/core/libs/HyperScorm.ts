/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * an object that contains all the information about the interaction stored on scorm.
 *
 * @export
 */
interface InteractionObject {
  index: number;
  learnerResponse: string;
  correct: boolean;
  id: number;
}

/**
 * Scorm version type
 *
 * @enum {number}
 */
export enum SCORMVersion {
  NONE = "none",
  ONE_POINT_TWO = "1.2",
  TWO_THOUSAND_AND_FOUR = "2004"
}

/**
 * lesson status type (SCORM 1.2)
 *
 * @enum {number}
 */
enum LessonStatus {
  PASSED = "passed",
  FAILED = "failed",
  COMPLETED = "completed",
  INCOMPLETE = "incomplete",
  BROWSED = "browsed",
  NOT_ATTEMPTED = "not attempted"
}

/**
 * completeion status type SCORM 2004
 *
 * @enum {number}
 */
enum CompletionStatus {
  FAILED = "failed",
  COMPLETED = "completed",
  INCOMPLETE = "incomplete",
  UNKNOWN = "unknown"
}

/**
 * Success stsus tyle SCORM 2004
 *
 * @enum {number}
 */
enum SuccessStatus {
  PASSED = "passed",
  FAILED = "failed"
}

export interface SCORMWindowInterface {
  API: SCORMAPIInterface;
  parent: SCORMWindowInterface | null;
  top: SCORMWindowTopInterface | null;
  // TODO: document object
}

export interface SCORMWindowTopInterface {
  opener: SCORMWindowInterface | null;
}

export interface SCORMAPIInterface {
  LMSInitialize: () => boolean;
  LMSFinish: (s: string) => {};
  LMSGetValue: (key: any) => {};
  LMSSetValue: (key: any, value: any) => boolean;
  LMSCommit: () => boolean;
  LMSGetLastError: () => {};
  LMSGetErrorString: () => {};
  LMSGetDiagnostic: () => {};
  LMSStore: (force?: boolean) => void;
  LMSFetch: () => void;
  LMSClear: () => void;
}


/**
 * the main pipwerks code, mostly converted to typescript.  hopefully
 * any usefuly code this class can supply us with is now avalible via HyperSCORM,
 * so direct access to this class should not be required. (I'm also not gonna export this.)
 *
 * @class Scorm
 */
class Scorm {
  win: SCORMWindowInterface | Window = window;
  version: string = "";
  handleExitMode: boolean = true;
  handleCompletionStatus: boolean = true;
  isDebugActive: boolean = true;
  exitStatus: any;
  isActive = false;
  completionStatus: any;

  apiHandle: any = null;
  isAPIFound: boolean = false;

  public constructor(
    win: SCORMWindowInterface | Window = window,
    debug: boolean = true
  ) {
    this.win = win;
    this.isDebugActive = debug;
  }

  private static toBoolean(value: any): boolean {
    switch (typeof value) {
      case "object":
      case "string":
        return /^(true|1)$/i.test(value);
      case "number":
        return !!value;
      case "boolean":
        return value;
      case "undefined":
        return false;
      default:
        return false;
    }
  }

  private debug(...logs: any[]): void {
    if (this.isDebugActive) {
      for (const log of logs) {
        window.console.log(log);
      }
    }
  }

  private warn(...logs: any[]): void {
    if (this.isDebugActive) {
      for (const log of logs) {
        window.console.warn(log);
      }
    }
  }

  private error(...logs: any[]): void {
    if (this.isDebugActive) {
      for (const log of logs) {
        window.console.error(log);
      }
    }
  }

  private find(win: any): {} | null {
    let API = null,
      findAttempts = 0;

    const findAttemptLimit = 500,
      traceMsgPrefix = "SCORM.API.find";

    while (
      !win.API &&
      !win.API_1484_11 &&
      win.parent &&
      win.parent !== win &&
      findAttempts <= findAttemptLimit
    ) {
      findAttempts++;
      win = win.parent;
    }

    // If SCORM version is specified by user, look for specific API
    if (this.version) {
      switch (this.version) {
        case SCORMVersion.ONE_POINT_TWO:
          if (win.API) {
            API = win.API;
          } else {
            this.warn(
              `${traceMsgPrefix}: SCORM version 1.2 was specified by user, but API cannot be found`
            );
          }
          break;

        case SCORMVersion.TWO_THOUSAND_AND_FOUR:
          if (win.API_1484_11) {
            API = win.API_1484_11;
          } else {
            this.warn(
              `${traceMsgPrefix}: SCORM version 2004 was specified by user, but API_1484_11 cannot be found`
            );
          }
          break;
      }
    } else {
      // If SCORM version not specified by user, look for APIs
      if (win.API) {
        // SCORM 1.2-specific API
        this.version = SCORMVersion.ONE_POINT_TWO; // Set version
        API = win.API;
      } else if (win.API_1484_11) {
        // SCORM 2004-specific API.
        this.version = SCORMVersion.TWO_THOUSAND_AND_FOUR; // Set version
        API = win.API_1484_11;
      }
    }

    if (API) {
      this.debug(traceMsgPrefix + ": API found. Version: " + this.version);
      this.debug("API", API);
      /*} else {
            this.debug(
              traceMsgPrefix +
                ": Error finding API. \nFind attempts: " +
                findAttempts +
                ". \nFind attempt limit: " +
                findAttemptLimit
            );*/
    }

    return API;
  }

  getAPI(): any {
    const win = this.win;
    let API = this.find(win);

    if (!API && win.parent && win.parent !== win) {
      API = this.find(win.parent);
    }

    if (!API && win.top && win.top.opener) {
      API = this.find(win.top.opener);
    }

    // Special handling for Plateau
    // Thanks to Joseph Venditti for the patch
    if (!API && win.top && win.top.opener && win.top.opener.document) {
      API = this.find(win.top.opener.document);
    }

    if (API) {
      this.isAPIFound = true;
    } else {
      this.error("getAPI failed: Can't find the API!");
    }

    return API;
  }

  private getHandle(): any {
    if (!this.apiHandle && !this.isAPIFound) {
      this.apiHandle = this.getAPI();
    }
    return this.apiHandle;
  }

  configure(
    config: {
      version?: string; // SCORM version.
      debug?: boolean;
      handleExitMode?: boolean; // Whether or not the wrapper should automatically handle the exit mode
      handleCompletionStatus?: boolean; // Whether or not the wrapper should automatically handle the initial completion status
    } = {}
  ): void {
    if (config.version) {
      this.version = config.version as string;
    }

    this.handleExitMode = config.handleExitMode || true;
    this.handleCompletionStatus = config.handleCompletionStatus || true;
    this.isDebugActive = config.debug || true;
  }

  /**
   * boot the scorm instance and return if a successfull connection has been made.
   *
   * @returns {boolean}
   * @memberof Scorm
   */
  initialize(): boolean {
    let success = false;

    const traceMsgPrefix = "this.initialize ";

    this.debug("connection.initialize called");

    if (!this.isActive) {
      const API = this.getHandle();
      let errorCode = 0;

      if (API) {
        switch (this.version) {
          case SCORMVersion.ONE_POINT_TWO:
            success = Scorm.toBoolean(API.LMSInitialize(""));
            break;
          case SCORMVersion.TWO_THOUSAND_AND_FOUR:
            success = Scorm.toBoolean(API.Initialize(""));
            break;
        }
        if (success) {
          // Double-check that connection is active and working before returning 'true' boolean
          errorCode = this.getLastError();
          if (errorCode !== null && errorCode === 0) {
            this.isActive = true;

            if (this.handleCompletionStatus) {
              // Automatically set new launches to incomplete
              this.completionStatus = this.status();

              if (this.completionStatus) {
                switch (this.completionStatus) {
                  // Both SCORM 1.2 and 2004
                  case LessonStatus.NOT_ATTEMPTED:
                    this.status(LessonStatus.INCOMPLETE);
                    break;

                  // SCORM 2004 only
                  case CompletionStatus.UNKNOWN:
                    this.status(CompletionStatus.INCOMPLETE);
                    break;

                  // Additional options, presented here in case you'd like to use them
                  // case "completed"  : break;
                  // case "incomplete" : break;
                  // case "passed"     : break;    //SCORM 1.2 only
                  // case "failed"     : break;    //SCORM 1.2 only
                  // case "browsed"    : break;    //SCORM 1.2 only
                }

                // Commit changes
                this.commit();
              }
            }
          } else {
            // success = false;
            this.error(
              `${traceMsgPrefix} failed. \nError code: ${errorCode}\nError info: ${this.getErrorString(
                errorCode
              )}`
            );
          }
        } else {
          errorCode = this.getLastError();

          if (errorCode !== null && errorCode !== 0) {
            this.error(
              `${traceMsgPrefix} failed. \nError code: ${errorCode}\nError info: ${this.getErrorString(
                errorCode
              )}`
            );
          } else {
            this.warn(traceMsgPrefix + "failed: No response from server");
          }
        }
      } else {
        this.warn(traceMsgPrefix + "failed: API is null");
      }
    } else {
      this.debug(traceMsgPrefix + "aborted: Connection already active");
    }

    return this.isActive;
  }

  terminate(): boolean {
    let success = false;
    const traceMsgPrefix = "scorm.terminate ";

    if (this.isActive) {
      const API = this.getHandle();
      let errorCode = 0;

      if (API) {
        if (this.handleExitMode && !this.exitStatus) {
          if (
            this.completionStatus !== LessonStatus.COMPLETED &&
            this.completionStatus !== LessonStatus.PASSED
          ) {
            switch (this.version) {
              case SCORMVersion.ONE_POINT_TWO:
                success = this.set("cmi.core.exit", "suspend");
                break;
              case SCORMVersion.TWO_THOUSAND_AND_FOUR:
                success = this.set("cmi.exit", "suspend");
                break;
            }
          } else {
            switch (this.version) {
              case SCORMVersion.ONE_POINT_TWO:
                success = this.set("cmi.core.exit", "logout");
                break;
              case SCORMVersion.TWO_THOUSAND_AND_FOUR:
                success = this.set("cmi.exit", "normal");
                break;
            }
          }
        }

        // Ensure we persist the data
        success = this.commit();

        if (success) {
          switch (this.version) {
            case SCORMVersion.ONE_POINT_TWO:
              success = Scorm.toBoolean(API.LMSFinish(""));
              break;
            case SCORMVersion.TWO_THOUSAND_AND_FOUR:
              success = Scorm.toBoolean(API.Terminate(""));
              break;
          }

          if (success) {
            this.isActive = false;
          } else {
            errorCode = this.getLastError();
            this.debug(
              traceMsgPrefix +
              "failed. \nError code: " +
              errorCode +
              " \nError info: " +
              this.getErrorString(errorCode)
            );
          }
        }
      } else {
        this.warn(traceMsgPrefix + "failed: API is null");
      }
    } else {
      this.debug(traceMsgPrefix + "aborted: Connection already terminated");
    }

    return success;
  }

  get(parameter: any): any {
    let value = null;
    const traceMsgPrefix = "scorm.get('" + parameter + "') ";

    if (this.isActive) {
      const API = this.getHandle();
      let errorCode = 0;

      if (API) {
        switch (this.version) {
          case SCORMVersion.ONE_POINT_TWO:
            value = API.LMSGetValue(parameter);
            break;
          case SCORMVersion.TWO_THOUSAND_AND_FOUR:
            value = API.GetValue(parameter);
            break;
        }

        errorCode = this.getLastError();

        // GetValue returns an empty string on errors
        // If value is an empty string, check errorCode to make sure there are no errors
        if (value !== "" || errorCode === 0) {
          // GetValue is successful.
          // If parameter is lesson_status/completion_status or exit status, let's
          // grab the value and cache it so we can check it during connection.terminate()
          switch (parameter) {
            case "cmi.core.lesson_status":
            case "cmi.completion_status":
              this.completionStatus = value;
              break;

            case "cmi.core.exit":
            case "cmi.exit":
              this.exitStatus = value;
              break;
          }
        } else {
          this.error(
            traceMsgPrefix +
            "failed. \nError code: " +
            errorCode +
            "\nError info: " +
            this.getErrorString(errorCode)
          );
        }
      } else {
        this.warn(traceMsgPrefix + "failed: API is null");
      }
    } else {
      this.warn(traceMsgPrefix + "failed: API connection is inactive");
    }

    this.debug(traceMsgPrefix + " value: " + value);

    return String(value);
  }

  set(parameter: any, value: any): boolean {
    let success = false;

    const traceMsgPrefix = "scorm.set('" + parameter + "') ";

    if (this.isActive) {
      const API = this.getHandle();
      let errorCode = 0;

      if (API) {
        switch (this.version) {
          case SCORMVersion.ONE_POINT_TWO:
            success = Scorm.toBoolean(API.LMSSetValue(parameter, value));
            break;
          case SCORMVersion.TWO_THOUSAND_AND_FOUR:
            success = Scorm.toBoolean(API.SetValue(parameter, value));
            break;
        }

        if (success) {
          if (
            parameter === "cmi.core.lesson_status" ||
            parameter === "cmi.completion_status"
          ) {
            this.completionStatus = value;
          }
        } else {
          errorCode = this.getLastError();

          this.debug(
            traceMsgPrefix +
            "failed. \nError code: " +
            errorCode +
            ". \nError info: " +
            this.getErrorString(errorCode)
          );
        }
      } else {
        this.warn(traceMsgPrefix + "failed: API is null");
      }
    } else {
      this.warn(traceMsgPrefix + "failed: API connection is inactive");
    }

    this.debug(traceMsgPrefix + " value: " + value);

    return success;
  }

  commit(): boolean {
    let success = false;
    const traceMsgPrefix = "scorm.commit failed";

    if (this.isActive) {
      const API = this.getHandle();

      if (API) {
        switch (this.version) {
          case SCORMVersion.ONE_POINT_TWO:
            success = Scorm.toBoolean(API.LMSCommit(""));
            break;
          case SCORMVersion.TWO_THOUSAND_AND_FOUR:
            success = Scorm.toBoolean(API.Commit(""));
            break;
        }
      } else {
        this.warn(traceMsgPrefix + ": API is null");
      }
    } else {
      this.warn(traceMsgPrefix + ": API connection is inactive");
    }

    return success;
  }

  status(status?: string): any {
    let success: any = false,
      cmi = "";

    const traceMsgPrefix = "scorm.status failed",
      action = arguments.length === 0 ? "get" : "set";


    switch (this.version) {
      case SCORMVersion.ONE_POINT_TWO:
        cmi = "cmi.core.lesson_status";
        break;
      case SCORMVersion.TWO_THOUSAND_AND_FOUR:
        cmi = "cmi.completion_status";
        break;
    }

    switch (action) {
      case "get":
        success = this.get(cmi);
        break;

      case "set":
        if (status !== null) {
          success = this.set(cmi, status);
        } else {
          success = false;
          this.debug(traceMsgPrefix + ": status was not specified");
        }

        break;

      default:
        success = false;
        this.warn(traceMsgPrefix + ": no valid action was specified");
    }

    return success;
  }

  getLastError(): number {
    const API = this.getHandle();
    let code = 0;

    if (API) {
      switch (this.version) {
        case SCORMVersion.ONE_POINT_TWO:
          code = parseInt(API.LMSGetLastError(), 10);
          break;
        case SCORMVersion.TWO_THOUSAND_AND_FOUR:
          code = parseInt(API.GetLastError(), 10);
          break;
      }
    } else {
      this.warn("scorm.getLastError failed: API is null");
    }

    return code;
  }

  getErrorString(errorCode: any): string {
    const API = this.getHandle();
    let result = "";

    if (API) {
      switch (this.version) {
        case SCORMVersion.ONE_POINT_TWO:
          result = API.LMSGetErrorString(errorCode.toString());
          break;
        case SCORMVersion.TWO_THOUSAND_AND_FOUR:
          result = API.GetErrorString(errorCode.toString());
          break;
      }
    } else {
      this.warn("scorm.getErrorString failed: API is null");
    }

    return String(result);
  }

  getDiagnostic(errorCode: any): string {
    const API = this.getHandle();
    let result = "";

    if (API) {
      switch (this.version) {
        case SCORMVersion.ONE_POINT_TWO:
          result = API.LMSGetDiagnostic(errorCode);
          break;
        case SCORMVersion.TWO_THOUSAND_AND_FOUR:
          result = API.GetDiagnostic(errorCode);
          break;
      }
    } else {
      this.warn("scorm.getDiagnostic failed: API is null");
    }

    return result as string;
  }
}

/**
 * Can be used as a standalone library, due to the nature of SCORM this is built as a singleton, and should be accessed via `HyperSCORM.Instance`
 * A CLeaned up and more appealing Typescript port of the SCORM API wrapper
 * probably lots stolen from pipwerks : https://github.com/pipwerks/scorm-api-wrapper
 * @author hypertrifle - Rich Searle
 * @export
 * @class HyperSCORM
 */
export default class HyperSCORM {
  /**
   * a reference to the current instance, we probably only want to connect to SCORM once, a SCORM thing I think.
   *
   * @private
   * @type {HyperSCORM}
   * @memberof HyperSCORM
   */
  private static _instance: HyperSCORM;

  private _win: SCORMWindowInterface | Window;

  /**
   * an instance of our scorm object.
   *
   * @private
   * @type {Scorm}
   * @memberof HyperSCORM
   */
  private _scorm: Scorm;

  /**
   * the version of scorm we are connected to, either 1.2 or 2004
   *
   * @type {SCORMVersion}
   * @memberof HyperSCORM
   */
  public version: SCORMVersion = SCORMVersion.NONE;

  private _startTime: Date;

  /**
   * Creates an instance of HyperSCORM, should be accessed via HyperSCORM.Instance -> this will call the contructor if it needs to.
   * @memberof HyperSCORM
   */
  constructor(
    win: SCORMWindowInterface | Window = window,
    debug: boolean = false
  ) {
    // console.warn( "A new HyperSCORM instance should not be created with new; please use HyperSCORM.Instance instead" );

    this._win = win;
    this._scorm = new Scorm(this._win, debug);
    this._scorm.initialize();
    this._startTime = new Date();

    if (this._scorm.isActive) {
      this.version = this._scorm.version as SCORMVersion;
    }
  }

  /**
   * Get the current, or create and instance of our scorm connection class.
   *
   * @readonly
   * @static
   * @type {HyperSCORM}
   * @memberof HyperSCORM
   */
  public static get Instance(): HyperSCORM {
    if (!this._instance) {
      this._instance = new HyperSCORM();
    }
    return this._instance;
  }

  public static get DebugInstance(): HyperSCORM {
    if (!this._instance) {
      this._instance = new HyperSCORM(window, true);
    }
    return this._instance;
  }

  /**
   * get wether the system is connected to a scorm system.
   *
   * @readonly
   * @type {boolean}
   * @memberof HyperSCORM
   */
  get connected(): boolean {
    return this._scorm.isActive;
  }

  /**
   * mark this course as complete with an optional score
   *
   * @memberof HyperSCORM
   */
  public complete(): void {
    if (this.version === SCORMVersion.ONE_POINT_TWO) {
      this.set("cmi.core.lesson_status", LessonStatus.COMPLETED);
    } else if (this.version === SCORMVersion.TWO_THOUSAND_AND_FOUR) {
      this.set("cmi.completion_status", CompletionStatus.COMPLETED);
    }
  }

  /**
   * mark this course as passed, with an optional score
   * Also marks as completion as 'complete'
   *
   * @param {number} [scoreAsDecimal] an @optional decimal value of the score scaled bwtween 0 and 1, 0.5 => 50%
   * @memberof HyperSCORM
   */
  public pass(scoreAsDecimal?: number): void {
    if (scoreAsDecimal) {
      this.score = scoreAsDecimal;
    }

    if (this.version === SCORMVersion.ONE_POINT_TWO) {
      this.set("cmi.core.lesson_status", LessonStatus.PASSED);
    } else if (this.version === SCORMVersion.TWO_THOUSAND_AND_FOUR) {
      this.set("cmi.success_status", SuccessStatus.PASSED);
      this.set("cmi.completion_status", CompletionStatus.COMPLETED);
    }
  }

  /**
   * mark this course as failed, with optional score.
   * Can't be called if completion is 'complete'
   *
   * @param {number} [scoreAsDecimal] an @optional decimal value of the score scaled bwtween 0 and 1, 0.5 => 50%
   * @memberof HyperSCORM
   */
  public fail(scoreAsDecimal?: number): void {
    if (
      (this.version === SCORMVersion.ONE_POINT_TWO &&
        this.get("cmi.core.lesson_status") === LessonStatus.COMPLETED) ||
      (this.version === SCORMVersion.TWO_THOUSAND_AND_FOUR &&
        this.get("cmi.completion_status") === CompletionStatus.COMPLETED)
    ) {
      return;
    }

    if (scoreAsDecimal) {
      this.score = scoreAsDecimal;
    }

    if (this.version === SCORMVersion.ONE_POINT_TWO) {
      this.set("cmi.core.lesson_status", LessonStatus.FAILED);
    } else if (this.version === SCORMVersion.TWO_THOUSAND_AND_FOUR) {
      this.set("cmi.success_status", SuccessStatus.FAILED);
      this.set("cmi.completion_status", CompletionStatus.COMPLETED);
    }
  }

  incomplete(): void {
    this.set("cmi.core.lesson_status", LessonStatus.INCOMPLETE);
  }

  browsed(): void {
    this.set("cmi.core.lesson_status", LessonStatus.BROWSED);
  }

  /**
   * get the suspend data, will be an object, but you probably will want to cast this to a typed model
   *
   * @type {object}
   * @memberof HyperSCORM
   */
  get suspendData(): any {
    const _s = this.get("cmi.suspend_data") || "{}";

    return JSON.parse(_s) || {};
  }

  /**
   * set the suspend data, must be an object, must be at least an object.
   *
   * @memberof HyperSCORM
   */
  set suspendData(o: any) {
    const s = JSON.stringify(o) || "{}";
    this.set("cmi.suspend_data", s);
  }

  // public setSuspendData(key: string, value: any): void {
  //   let suspendData = this.suspendData;
  //   suspendData[key] = value;
  //   this.suspendData = suspendData;
  // }

  /**
   * set the score of this SCO
   *
   * @param {number} scoreAsDecimal
   * @memberof HyperSCORM
   */
  set score(scoreAsDecimal: number) {
    try {
      this.set("cmi.core.score.raw", scoreAsDecimal.toString());
      this.set("cmi.core.score.max", "1");
      this.set("cmi.core.score.min", "0");
    } catch (e) {
      console.warn("error reporting cmi.core.score.raw");
    }

    try {
      this.set("cmi.score.scaled", scoreAsDecimal.toString());
    } catch (e) {
      console.warn("error reporting cmi.score.scaled");
    }
  }

  get score(): number {
    return parseFloat(
      this.get("cmi.core.score.raw") || this.get("cmi.score.scaled")
    );
  }

  /**
   * track an interaction,
   *
   * @param {number} id
   * @param {boolean} result
   * @param {string} learnerResponse
   * @returns {InteractionObject} - an object of all the data saved with this interaction, everything should be as passed, apart from index which is supplied by the LMS
   * @memberof HyperSCORM
   */
  public trackInteraction(
    id: number,
    result: boolean,
    learnerResponse: string
  ): InteractionObject | undefined {
    if (!this.connected) {
      console.warn("interaction tracking disabled as not connected to scorm");
      return;
    }

    // is interactions 2004 only?
    // if (this.version !== SCORMVersion.TWO_THOUSAND_AND_FOUR) {
    //     console.warn("atempting to record a CMI interaction but not connected to SCORM 2004")
    // }

    // lets get the next avalible interaction
    const index = parseInt(this.get("cmi.interactions._count"));

    if (typeof index !== "number") {
      console.warn(
        "cmi.interactions._count returned NaN so skipping this interaction tracking"
      );
      return;
    }

    // build our interaction object.
    const interaction: InteractionObject = {
      index,
      learnerResponse,
      id,
      correct: result
    };

    // quick debug trace.
    console.log("setting cmi.interaction: ", interaction);

    // standard stuffs.
    if (interaction.correct !== undefined) {
      // lets format this so it better suits an LMS
      const formattedResult = interaction.correct ? "correct" : "wrong"; // serriosly scorm why you choose these words.
      this.set(`cmi.interactions.${interaction.index}.result`, formattedResult);
    }

    if (interaction.learnerResponse !== undefined) {
      // we are going to use fill in as this seems the best to store data.
      this.set("cmi.interactions." + interaction.index + ".type", "fill-in");

      this.set(
        `cmi.interactions.${interaction.index}.student_response`,
        encodeURI(interaction.learnerResponse).toString()
      );
    }

    if (interaction.id !== undefined) {
      this.set(
        `cmi.interactions.${interaction.index}.id`,
        interaction.id.toString()
      );
    }

    // return the interaction we recorded.
    return interaction;
  }

  get(path: string): string {
    return this._scorm.get(path);
  }

  set(path: string, value: string): string {
    this._scorm.set(path, value);
    this.save();
    return value;
  }

  save(): boolean {
    return this._scorm.commit();
  }

  get startTime(): Date {
    return this._startTime;
  }

  get duration(): number {
    return new Date().getTime() - this.startTime.getTime();
  }

  end(): void {
    this.set(
      "cmi.core.session_time",
      HyperSCORM.convertToSCORM12Time(this.duration)
    );
    if (this.version === SCORMVersion.ONE_POINT_TWO) {
      this.set("cmi.core.exit", "");
    }
  }

  static convertToSCORM12Time(msConvert: number): string {
    const msPerSec = 1000;
    const msPerMin = msPerSec * 60;
    const msPerHour = msPerMin * 60;

    const ms = msConvert % msPerSec;
    msConvert -= ms;

    let secs = msConvert % msPerMin;
    msConvert -= secs;
    secs /= msPerSec;

    let mins = msConvert % msPerHour;
    msConvert -= mins;
    mins /= msPerMin;

    const hrs = msConvert / msPerHour;

    if (hrs > 9999) {
      return "9999:99:99.99";
    } else {
      const padWithZeroes = (numToPad: number, padBy: number): string => {
        let len = padBy;
        let out = numToPad.toString();
        while (--len) {
          out = "0" + out;
        }
        return out.slice(-padBy);
      };

      const str = [
        padWithZeroes(hrs, 4),
        padWithZeroes(mins, 2),
        padWithZeroes(secs, 2)
      ].join(":");
      return `${str}.${~~(ms / 10)}`;
    }
  }
}

