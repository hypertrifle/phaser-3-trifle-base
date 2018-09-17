/**
 * Can be used as a standalone library, due to the nature of scorm this is built as a singleton, and should be accessed via `HyperScorm.Instance`
 * A CLeaned up and more appealing Typescript port of the SCORM API wrapper
 * probably lots stolen from pipwerks : https://github.com/pipwerks/scorm-api-wrapper
 * @author hypertrifle - Rich Searle
 * @export
 * @class HyperScorm
 */
export default class HyperScorm {

    /**
     * a reference to the current instance, we probably only want to connect to scorm once, a SCORM thing I think.
     *
     * @private
     * @type {HyperScorm}
     * @memberof HyperScorm
     */
    private static _instance: HyperScorm;

    /**
     * an instance of our scorm object.
     *
     * @private
     * @type {Scorm}
     * @memberof HyperScorm
     */
    private _scorm: Scorm;



    /**
     * the version of scorm we are connected to, either 1.2 or 2004
     *
     * @type {ScormVersion}
     * @memberof HyperScorm
     */
    public version: ScormVersion = ScormVersion.NONE;



    /**
     * Creates an instance of HyperScorm, should be accessed via HyperScorm.Instance -> this will call the contructor if it needs to.
     * @memberof HyperScorm
     */
    private constructor() {
        // should only be allow to be called by our get instance method.
        this._scorm = new Scorm();
        this._scorm.initialize();

        if (this._scorm.isActive) {
            console.log('SCORM ACTIVATED AND CONNECTED');
            this.version = this._scorm.version as ScormVersion;
        }
    }

    /**
     * Get the current, or create and instance of our scorm connection class.
     *
     * @readonly
     * @static
     * @type {HyperScorm}
     * @memberof HyperScorm
     */
    public static get Instance(): HyperScorm {

        if (!this._instance) {
            this._instance = new HyperScorm();

        }
        return this._instance;
    }

    /**
     * get wether the system is connected to a scorm system.
     *
     * @readonly
     * @type {boolean}
     * @memberof HyperScorm
     */
    get connected(): boolean {
        return this._scorm.isActive;
    }


    /**
     * mark this course as complete with an optional score
     *
     * @param {number} [scoreAsDecimal] an @optional decimal value of the score scaled bwtween 0 and 1, 0.5 => 50%
     * @memberof HyperScorm
     */
    public complete(scoreAsDecimal?: number) {
        if (this.version === ScormVersion.ONE_POINT_TWO) {

            this._scorm.set('', 'passed');

        } else if (this.version === ScormVersion.TWO_THOUSAND_AND_FOUR) {

            this._scorm.set('', 'passed');


        }
    }

    /**
     * mark this course as passed, with an optional score
     *
     * @param {number} [scoreAsDecimal] an @optional decimal value of the score scaled bwtween 0 and 1, 0.5 => 50%
     * @memberof HyperScorm
     */
    public passed(scoreAsDecimal?: number) {

    }

    /**
     * mark this course as failed, with optional score.
     *
     * @param {number} [scoreAsDecimal] an @optional decimal value of the score scaled bwtween 0 and 1, 0.5 => 50%
     * @memberof HyperScorm
     */
    public failed(scoreAsDecimal?: number) {
        if (this.version === ScormVersion.ONE_POINT_TWO) {

            this._scorm.set('', 'passed');

        } else if (this.version === ScormVersion.TWO_THOUSAND_AND_FOUR) {

            this._scorm.set('', 'passed');


        }
    }

    /**
     * track an interaction,
     *
     * @param {number} id
     * @param {boolean} result
     * @param {string} learner_response
     * @returns {InteractionObject} - an object of all the data saved with this interaction, everything should be as passed, apart from index which is supplied by the LMS
     * @memberof HyperScorm
     */
    public trackInteraction(id: number, result: boolean, learner_response: string): InteractionObject|undefined {

        if (!this.connected) {
            console.warn('interaction tracking disabled as not connected to scorm');
            return ;
        }

        // is interactions 2004 only?
        // if (this.version !== ScormVersion.TWO_THOUSAND_AND_FOUR) {
        //     console.warn("atempting to record a CMI interaction but not connected to SCORM 2004")
        // }

        // lets get the next avalible interaction
        let index = parseInt(this._scorm.get('cmi.interactions._count'));

        if (typeof index !== 'number') {
            console.warn('cmi.interactions._count returned NaN so skipping this interaction tracking');
            return;

        }

        // build our interaction object.
        let interaction: InteractionObject = {
            index: index,
            learner_response: learner_response,
            correct: result,
            id: id
        };

        // quick debug trace.
        console.log('setting cmi.interaction: ', interaction);



        // standard stuffs.
        if (interaction.correct !== undefined) {
            // lets format this so it better suits an LMS
            let formattedResult = (interaction.correct) ? 'correct' : 'wrong';
            this._scorm.set('cmi.interactions.' + interaction.index + '.result', formattedResult);
        }

        if (interaction.learner_response !== undefined) {

            // we are going to use fill in as this seems the best to store data.
            this._scorm.set('cmi.interactions.' + interaction.index + '.type', 'fill-in');

            this._scorm.set('cmi.interactions.' + interaction.index + '.student_response', encodeURI(interaction.learner_response).toString());
            }


        if (interaction.id !== undefined) {
            this._scorm.set('cmi.interactions.' + interaction.index + '.id', interaction.id);

        }

        // return the interaction we recorded.
        return interaction;
    }


    get(path: string) {
        return this._scorm.get(path);
    }

    set(path: string, value: string) {
        return this._scorm.set(path, value);
    }

    save(): boolean {
        return this._scorm.commit();
    }




}

/**
 * an object that contains all the information about the interction stored on scorm.
 *
 * @export
 * @interface InteractionObject
 */
export interface InteractionObject {
    index: number;
    learner_response: string;
    correct: boolean;
    id: number;
}



/**
 * Scorm version type
 *
 * @enum {number}
 */
enum ScormVersion {
    NONE = 'none',
    ONE_POINT_TWO = '1.2',
    TWO_THOUSAND_AND_FOUR = '2004'
}

/**
 * lesson status type (SCORM 1.2)
 *
 * @enum {number}
 */
enum LessonStatus {
    PASSED = 'passed',
    FAILED = 'failed',
    COMPLETED = 'completed',
    INCOMPLETE = 'incomplete',
    BROWSED = 'browsed',
    NOT_ATTEMPTED = 'not attempted',
}

/**
 * completeion status type SCORM 2004
 *
 * @enum {number}
 */
enum CompletionStatus {
    COMPLETED = 'completed',
    INCOMPLETE = 'incomplete'
}

/**
 * Success stsus tyle SCORM 2004
 *
 * @enum {number}
 */
enum SuccessStatus {
    PASSED = 'passed',
    FAILED = 'failed'

}




/**
 * the main pipwerks code, mostly converted to typescript.  hopefully
 * any usefuly code this class can supply us with is now avalible via HyperScorm,
 * so direct access to this class should not be required. (I'm also not gonna export this.)
 *
 * @class Scorm
 */

class Scorm {
    version: string = "none";
    handleExitMode: boolean = true;
    handleCompletionStatus: boolean = true;
    isDebugActive: boolean = true;
    exitStatus: any;
    isActive = false;
    completionStatus: any;

    apiHandle: any = null;
    isAPIFound: boolean = false;

    private toBoolean(value: any) {// TODO: implicity any
        switch (typeof (value)) {
            case 'object':
            case 'string':
                return /(true|1)/i.test(value);
            case 'number':
                return !!value;
            case 'boolean':
                return value;
            case 'undefined':
                return null;
            default:
                return false;
        }
    }

    private debug(msg: any) { // TODO: implicity any
        if (this.isDebugActive) {
            window.console.log(msg);
        }
    }

    private find(win: any) { // TODO: implicity any
        let API = null,
            findAttempts = 0,
            findAttemptLimit = 500,
            traceMsgPrefix = 'SCORM.API.find';

        while (
            !win.API &&
            !win.API_1484_11 &&
            win.parent &&
            win.parent !== win &&  // TODO: check truthy is required.
            findAttempts <= findAttemptLimit
        ) {
            findAttempts++;
            win = win.parent;
        }

        // If SCORM version is specified by user, look for specific API
        if (this.version) {
            switch (this.version) {
                case '2004':
                    if (win.API_1484_11) {
                        API = win.API_1484_11;
                    } else {
                        this.debug(
                            traceMsgPrefix +
                            ': SCORM version 2004 was specified by user, but API_1484_11 cannot be found.',
                        );
                    }

                    break;

                case '1.2':
                    if (win.API) {
                        API = win.API;
                    } else {
                        this.debug(
                            traceMsgPrefix +
                            ': SCORM version 1.2 was specified by user, but API cannot be found.',
                        );
                    }

                    break;
            }
        } else {
            // If SCORM version not specified by user, look for APIs

            if (win.API_1484_11) {
                // SCORM 2004-specific API.

                this.version = '2004'; // Set version
                API = win.API_1484_11;
            } else if (win.API) {
                // SCORM 1.2-specific API

                this.version = '1.2'; // Set version
                API = win.API;
            }
        }

        if (API) {
            this.debug(traceMsgPrefix + ': API found. Version: ' + this.version);
            this.debug('API: ' + API);
        } else {
            this.debug(
                traceMsgPrefix +
                ': Error finding API. \nFind attempts: ' +
                findAttempts +
                '. \nFind attempt limit: ' +
                findAttemptLimit,
            );
        }

        return API;
    }

    getAPI(): any {
        let API = null,
            win = window;

        API = this.find(win);

        if (!API && win.parent && win.parent !== win) { // TODO: check truthy is required.
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
            this.debug('getAPI failed: Can\'t find the API!');
        }
        console.log('getAPI, returning: ', API);

        return API;
    }

    private getHandle() {
        if (!this.apiHandle && !this.isAPIFound) {
            this.apiHandle = this.getAPI();
        }

        return this.apiHandle;
    }

    configure(config: {
        version?: string; // SCORM version.
        debug?: boolean;
        handleExitMode?: boolean; // Whether or not the wrapper should automatically handle the exit mode
        handleCompletionStatus?: boolean; // Whether or not the wrapper should automatically handle the initial completion status
    } = {}) {

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
        let success = false,
            traceMsgPrefix = 'this.initialize ';

        this.debug('connection.initialize called.');

        if (!this.isActive) {
            let API = this.getHandle(),
                errorCode = 0;

            if (API) {
                switch (this.version) {
                    case '1.2':
                        success = this.toBoolean(API.LMSInitialize(''));
                        break;
                    case '2004':
                        success = this.toBoolean(API.Initialize(''));
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
                                    case 'not attempted':
                                        this.status('incomplete');
                                        break;

                                    // SCORM 2004 only
                                    case 'unknown':
                                        this.status('incomplete');
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
                        success = false;
                        this.debug(
                            traceMsgPrefix +
                            'failed. \nError code: ' +
                            errorCode +
                            ' \nError info: ' +
                            this.getErrorString(errorCode),
                        );
                    }
                } else {
                    errorCode = this.getLastError();

                    if (errorCode !== null && errorCode !== 0) {
                        this.debug(
                            traceMsgPrefix +
                            'failed. \nError code: ' +
                            errorCode +
                            ' \nError info: ' +
                            this.getErrorString(errorCode),
                        );
                    } else {
                        this.debug(traceMsgPrefix + 'failed: No response from server.');
                    }
                }
            } else {
                this.debug(traceMsgPrefix + 'failed: API is null.');
            }
        } else {
            this.debug(traceMsgPrefix + 'aborted: Connection already active.');
        }

        return this.isActive;
    }

    terminate() {
        let success = false,
            traceMsgPrefix = 'scorm.terminate ';

        if (this.isActive) {
            let API = this.getHandle(),
                errorCode = 0;

            if (API) {
                if (this.handleExitMode && !this.exitStatus) {
                    if (this.completionStatus !== 'completed' && this.completionStatus !== 'passed') {
                        switch (this.version) {
                            case '1.2':
                                success = this.set('cmi.core.exit', 'suspend');
                                break;
                            case '2004':
                                success = this.set('cmi.exit', 'suspend');
                                break;
                        }
                    } else {
                        switch (this.version) {
                            case '1.2':
                                success = this.set('cmi.core.exit', 'logout');
                                break;
                            case '2004':
                                success = this.set('cmi.exit', 'normal');
                                break;
                        }
                    }
                }

                // Ensure we persist the data
                success = this.commit();

                if (success) {
                    switch (this.version) {
                        case '1.2':
                            success = this.toBoolean(API.LMSFinish(''));
                            break;
                        case '2004':
                            success = this.toBoolean(API.Terminate(''));
                            break;
                    }

                    if (success) {
                        this.isActive = false;
                    } else {
                        errorCode = this.getLastError();
                        this.debug(
                            traceMsgPrefix +
                            'failed. \nError code: ' +
                            errorCode +
                            ' \nError info: ' +
                            this.getErrorString(errorCode),
                        );
                    }
                }
            } else {
                this.debug(traceMsgPrefix + 'failed: API is null.');
            }
        } else {
            this.debug(traceMsgPrefix + 'aborted: Connection already terminated.');
        }

        return success;
    }

    get(parameter: any) { // TODO: implicity any
        let value = null,
            traceMsgPrefix = 'scorm.get(\'' + parameter + '\') ';

        if (this.isActive) {
            let API = this.getHandle(),
                errorCode = 0;

            if (API) {
                switch (this.version) {
                    case '1.2':
                        value = API.LMSGetValue(parameter);
                        break;
                    case '2004':
                        value = API.GetValue(parameter);
                        break;
                }

                errorCode = this.getLastError();

                // GetValue returns an empty string on errors
                // If value is an empty string, check errorCode to make sure there are no errors
                if (value !== '' || errorCode === 0) {
                    // GetValue is successful.
                    // If parameter is lesson_status/completion_status or exit status, let's
                    // grab the value and cache it so we can check it during connection.terminate()
                    switch (parameter) {
                        case 'cmi.core.lesson_status':
                        case 'cmi.completion_status':
                            this.completionStatus = value;
                            break;

                        case 'cmi.core.exit':
                        case 'cmi.exit':
                            this.exitStatus = value;
                            break;
                    }
                } else {
                    this.debug(
                        traceMsgPrefix +
                        'failed. \nError code: ' +
                        errorCode +
                        '\nError info: ' +
                        this.getErrorString(errorCode),
                    );
                }
            } else {
                this.debug(traceMsgPrefix + 'failed: API is null.');
            }
        } else {
            this.debug(traceMsgPrefix + 'failed: API connection is inactive.');
        }

        this.debug(traceMsgPrefix + ' value: ' + value);

        return String(value);
    }

    set(parameter: any, value: any) {// TODO: implicity any
        let success = false,
            traceMsgPrefix = 'scorm.set(\'' + parameter + '\') ';

        if (this.isActive) {
            let API = this.getHandle(),
                errorCode = 0;

            if (API) {
                switch (this.version) {
                    case '1.2':
                        success = this.toBoolean(API.LMSSetValue(parameter, value));
                        break;
                    case '2004':
                        success = this.toBoolean(API.SetValue(parameter, value));
                        break;
                }

                if (success) {
                    if (
                        parameter === 'cmi.core.lesson_status' ||
                        parameter === 'cmi.completion_status'
                    ) {
                        this.completionStatus = value;
                    }
                } else {
                    errorCode = this.getLastError();

                    this.debug(
                        traceMsgPrefix +
                        'failed. \nError code: ' +
                        errorCode +
                        '. \nError info: ' +
                        this.getErrorString(errorCode),
                    );
                }
            } else {
                this.debug(traceMsgPrefix + 'failed: API is null.');
            }
        } else {
            this.debug(traceMsgPrefix + 'failed: API connection is inactive.');
        }

        this.debug(traceMsgPrefix + ' value: ' + value);

        return success;
    }

    commit() {
        let success = false,
            traceMsgPrefix = 'scorm.commit failed';

        if (this.isActive) {
            let API = this.getHandle();

            if (API) {
                switch (this.version) {
                    case '1.2':
                        success = this.toBoolean(API.LMSCommit(''));
                        break;
                    case '2004':
                        success = this.toBoolean(API.Commit(''));
                        break;
                }
            } else {
                this.debug(traceMsgPrefix + ': API is null.');
            }
        } else {
            this.debug(traceMsgPrefix + ': API connection is inactive.');
        }

        return success;
    }

    status(status?: string) {
        let success: any = false,
            traceMsgPrefix = 'scorm.status failed',
            cmi = '',
            action = (arguments.length === 0) ? 'get' : 'set';

        switch (this.version) {
            case '1.2':
                cmi = 'cmi.core.lesson_status';
                break;
            case '2004':
                cmi = 'cmi.completion_status';
                break;
        }

        switch (action) {
            case 'get':
                success = this.get(cmi);
                break;

            case 'set':
                if (status !== null) {
                    success = this.set(cmi, status);
                } else {
                    success = false;
                    this.debug(traceMsgPrefix + ': status was not specified.');
                }

                break;

            default:
                success = false;
                this.debug(traceMsgPrefix + ': no valid action was specified.');
        }

        return success;
    }

    getLastError() {
        let API = this.getHandle(),
            code = 0;

        if (API) {
            switch (this.version) {
                case '1.2':
                    code = parseInt(API.LMSGetLastError(), 10);
                    break;
                case '2004':
                    code = parseInt(API.GetLastError(), 10);
                    break;
            }
        } else {
            this.debug('scorm.getLastError failed: API is null.');
        }

        return code;
    }

    getErrorString(errorCode: any) {// TODO: implicity any
        let API = this.getHandle(),
            result = '';

        if (API) {
            switch (this.version) {
                case '1.2':
                    result = API.LMSGetErrorString(errorCode.toString());
                    break;
                case '2004':
                    result = API.GetErrorString(errorCode.toString());
                    break;
            }
        } else {
            this.debug('scorm.getErrorString failed: API is null.');
        }

        return String(result);
    }

    getDiagnostic(errorCode: any) {// TODO: implicity any
        let API = this.getHandle(),
            result = '';

        if (API) {
            switch (this.version) {
                case '1.2':
                    result = API.LMSGetDiagnostic(errorCode);
                    break;
                case '2004':
                    result = API.GetDiagnostic(errorCode);
                    break;
            }
        } else {
            this.debug('scorm.getDiagnostic failed: API is null.');
        }

        return result as string;
    }
}