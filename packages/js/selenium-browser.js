const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const ElementFinder = require('./elementfinder.js')

class SeleniumBrowser {
    constructor(runInstance) {
        this.driver = null;
        this.runInstance = runInstance;

        // Register this browser in the persistent array browsers
        // Used to kill all open browsers if the runner is stopped
        let browsers = this.runInstance.p("browsers");
        if(!browsers) {
            browsers = this.runInstance.p("browsers", []);
        }

        browsers.push(this);
        this.runInstance.p("browsers", browsers);
    }

    /**
     * Kills all open browsers
     */
    static async killAllBrowsers(runner) {
        let browsers = runner.p("browsers");
        if(browsers) {
            for(let i = 0; i < browsers.length; i++) {
                let browser = browsers[i];
                await browser.driver && browser.driver.quit();
            }
        }
    }

    /**
     * Opens the browser
     * See https://w3c.github.io/webdriver/#capabilities
     * @param {Object} params - Object containing parameters for this browser
     * @param {String} params.name - The name of the browser (e.g., chrome|firefox|safari|internet explorer|MicrosoftEdge)
     * @param {String} [params.version] - The version of the browser
     * @param {String} [params.platform] - The platform (e.g., linux|mac|windows)
     * @param {Number} [params.width] - The initial browser width, in pixels
     * @param {Number} [params.height] - The initial browser height, in pixels
     * @param {String} [params.deviceEmulation] - What mobile device to emulate, if any (only works with Chrome)
     * @param {Boolean} [params.isHeadless] - If true, run the browser headlessly, if false do not run the browser headlessly, if not set, use headless unless we're debugging
     * @param {String} [params.serverUrl] - The absolute url of the standalone selenium server, if we are to use one (e.g., http://localhost:4444/wd/hub)
     */
    async open(params) {
        let options = {
            chrome: new chrome.Options(),
            firefox: new firefox.Options()

            // TODO: add other browsers



        };

        // Dimensions

        if(!params.width) {
            // See if {browser width} is defined below
            try {
                params.width = parseInt(this.runInstance.findVarValue("browser width", false, true));
            }
            catch(e) {} // it's ok if the variable isn't found (simply don't set dimensions)
        }

        if(!params.height) {
            // See if {browser height} is defined below
            try {
                params.height = parseInt(this.runInstance.findVarValue("browser height", false, true));
            }
            catch(e) {} // it's ok if the variable isn't found (simply don't set dimensions)
        }

        if(params.width && params.height) {
            options.chrome.windowSize({width: params.width, height: params.height});

            // TODO: add other browsers





        }

        // Mobile device emulation (Chrome)

        if(!params.deviceEmulation) {
            try {
                params.deviceEmulation = this.runInstance.findVarValue("device to emulate *", false, true);
            }
            catch(e) {} // it's ok if the variable isn't found
        }

        if(params.deviceEmulation) {
            options.chrome.setMobileEmulation({deviceName: params.deviceEmulation});
        }

        // Headless

        if(typeof params.isHeadless == 'undefined') {
            // Set isHeadless to true, unless we're debugging
            params.isHeadless = !this.runInstance.tree.isDebug;

            // Override if --headless flag is set
            if(this.runInstance.runner.flags.hasOwnProperty("headless")) {
                let headlessFlag = this.runInstance.runner.flags.headless;
                if(headlessFlag === "true" || headlessFlag === "" || headlessFlag === undefined) {
                    params.isHeadless = true;
                }
                else if(headlessFlag === "false") {
                    params.isHeadless = false;
                }
                else {
                    throw new Error("Invalid --headless flag value. Must be true or false.");
                }
            }
        }

        if(params.isHeadless) {
            options.chrome.headless();

            // TODO: add other browsers






        }

        // Server URL

        if(!params.serverUrl) {
            // If serverUrl isn't set, look to the -seleniumServer flag
            if(this.runInstance.runner.flags.seleniumServer) {
                params.serverUrl = this.runInstance.runner.flags.seleniumServer;
            }
        }

        let builder = new Builder()
            .forBrowser(params.name, params.version, params.platform)
            .setChromeOptions(options.chrome)
            .setFirefoxOptions(options.firefox);

            // TODO: add other browsers







        if(params.serverUrl) {
            builder = builder.usingServer(params.serverUrl);
        }

        try {
            this.driver = await builder.build();
        }
        catch(e) {
            e.fatal = true;
            throw e;
        }
    }

    async close() {
        if(this.driver) {
            await this.driver.quit();
        }

        let browsers = this.runInstance.p("browsers");
        for(let i = 0; i < browsers.length; i++) {
            if(browsers[i] === this) {
                browsers.splice(i, 1);
            }
        }
    }

    /**
     * Navigates the browser to the given url
     * @param {String} url - The absolute or relative url to navigate to. If relative, uses the browser's current domain.
     */
    async nav(url) {
        // TODO:
        // absolute vs. relative url (for relative, use browser's current domain)
        // for no http(s)://, use http://




        await this.driver.get(url);
    }

    /**
     * @param {String} finder - A string representing an ElementFinder, css selector, or xpath
     * @param {Number} [timeout] - If no elements are found initially, this is how long (in ms) to keep trying until elements are found, 0 if omitted
     * @param {Boolean} [noError] - If true, return an empty array if no elements found, otherwise throw an Error
     * @param {Boolean} [anywhereInDOM] - If true, search among all elements in the DOM, otherwise only search among visible ones
     * @return {Array} The elements matching the given finder, empty array if noError is set and nothing was found
     * @throws {Error} If no elements are found before the timeout expires (if noError isn't set)
     */
    async elements(finder, timeout, noError, anywhereInDOM) {







    }

    /**
     * Same as elements(), but only returns one element
     * @return {Element} The first element matching the finder
     * @throws {Error} Just like elements()
     */
    async element(finder, timeout, noError, anywhereInDOM) {
        let elements = this.elements(finder, timeout, noError, anywhereInDOM);
        if(elements.length > 0) {
            return elements[0];
        }
    }
}
module.exports = SeleniumBrowser;