const clonedeep = require('lodash/clonedeep');
const utils = require('./utils.js');
const Constants = require('./constants.js');

/**
 * Represents a step within a Branch
 */
class Step {
    constructor(id) {
        this.id = id;                         // id of the corresponding StepNode

        /*
        OPTIONAL

        this.fid = -1;                        // id of StepNode that corresponds to the function declaration, if this step is a function call
        this.level = 0;                       // number of function calls deep this step is within its branch

        SET AFTER STEP IS RUN

        this.isPassed = false;                // true if this step passed after being run
        this.isFailed = false;                // true if this step failed after being run
        this.isSkipped = false;               // true if this step was skipped
        this.isRunning = false;               // true if this step is currently running

        this.error = {};                      // if this step failed, this is the Error that was thrown
        this.log = [];                        // Array of objects that represent the logs of this step

        this.elapsed = 0;                     // number of ms it took this step to execute
        this.timeStarted = {};                // Date object (time) of when this step started being executed
        this.timeEnded = {};                  // Date object (time) of when this step ended execution

        reportTemplateIndex = -1;             // Index of the html that represents this step in reports (stored in Tree.reportTemplates)
        reportView = {};                      // object that replaces {{{template tags}}} in reportTemplates, values can only be strings
        */
    }

    /**
     * @return {Step} Clone of this step
     */
    clone() {
        return clonedeep(this);
    }

    /**
     * @return {Boolean} True if this Step completed already
     */
    isComplete() {
        return this.isPassed || this.isFailed || this.isSkipped;
    }

    /**
     * Logs the given item to this Step
     * @param {Object or String} item - The item to log
     */
    appendToLog(item) {
        if(!this.log) {
            this.log = [];
        }

        if(typeof item == 'string') {
            this.log.push( { text: item } );
        }
        else {
            this.log.push(item);
        }
    }

    /**
     * @return {Object} An Object representing this step, but able to be converted to JSON and only containing the most necessary stuff for a report
     */
    serialize() {
        let o = {
            id: this.id,
            fid: this.fid,
            level: this.level
        };

        utils.copyProps(o, this, [
            'isPassed',
            'isFailed',
            'isSkipped',
            'isRunning',

            'error',
            'log',

            'elapsed',

            'reportTemplateIndex',
            'reportView'
        ]);

        return o;
    }
}
module.exports = Step;
