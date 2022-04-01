/**
 * A Node.js wrapper for the Matomo (http://matomo.org) tracking HTTP API
 * https://github.com/matomo-org/matomo-nodejs-tracker
 *
 * @author  Frederic Hemberger, Matomo Team
 * @license MIT
 */
'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatomoTracker = void 0;
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const assert = __importStar(require("assert"));
const events = __importStar(require("events"));
const qs = __importStar(require("querystring"));
const url = __importStar(require("url"));
/**
 * @constructor
 * @param {Number} siteId     Id of the site you want to track
 * @param {String} trackerUrl URL of your Matomo instance
 * @param {Boolean} [noURLValidation]  Set to true if the `piwik.php` or `matomo.php` has been renamed
 */
class MatomoTracker extends events.EventEmitter {
    constructor(siteId, trackerUrl, noURLValidation) {
        super();
        events.EventEmitter.call(this);
        assert.ok(siteId && (typeof siteId === 'number' || typeof siteId === 'string'), 'Matomo siteId required.');
        assert.ok(trackerUrl && typeof trackerUrl === 'string', 'Matomo tracker URL required, e.g. http://example.com/matomo.php');
        if (!noURLValidation) {
            assert.ok(trackerUrl.endsWith('matomo.php') || trackerUrl.endsWith('piwik.php'), 'A tracker URL must end with "matomo.php" or "piwik.php"');
        }
        this.siteId = siteId;
        this.trackerUrl = trackerUrl;
        // Use either HTTPS or HTTP agent according to Matomo tracker URL
        this.usesHTTPS = trackerUrl.startsWith('https');
    }
    /**
     * Executes the call to the Matomo tracking API
     *
     * For a list of tracking option parameters see
     * https://developer.matomo.org/api-reference/tracking-api
     *
     * @param {(String|Object)} options URL to track or options (must contain URL as well)
     */
    track(options) {
        const hasErrorListeners = this.listeners('error').length;
        if (typeof options === 'string') {
            options = {
                url: options
            };
        }
        // Set mandatory options
        // options = options || {};
        if (!options || !options.url) {
            assert.fail('URL to be tracked must be specified.');
            return;
        }
        options.idsite = this.siteId;
        options.rec = 1;
        const requestUrl = this.trackerUrl + '?' + qs.stringify(options);
        const self = this;
        let req;
        if (this.usesHTTPS) {
            req = https.get(requestUrl, handleResponse);
        }
        else {
            req = http.get(requestUrl, handleResponse);
        }
        function handleResponse(res) {
            // Check HTTP statuscode for 200 and 30x
            if (res.statusCode && !/^(20[04]|30[12478])$/.test(res.statusCode.toString())) {
                if (hasErrorListeners) {
                    self.emit('error', res.statusCode);
                }
            }
        }
        req.on('error', err => {
            hasErrorListeners && this.emit('error', err.message);
        });
        req.end();
    }
    // eslint-disable-next-line no-unused-vars
    trackBulk(events, callback) {
        const hasErrorListeners = this.listeners('error').length;
        assert.ok(events && (events.length > 0), 'Events require at least one.');
        assert.ok(this.siteId !== undefined && this.siteId !== null, 'siteId must be specified.');
        const body = JSON.stringify({
            requests: events.map(query => {
                query.idsite = this.siteId;
                query.rec = 1;
                return '?' + qs.stringify(query);
            })
        });
        const uri = url.parse(this.trackerUrl);
        const requestOptions = {
            protocol: uri.protocol,
            hostname: uri.hostname,
            port: uri.port,
            path: uri.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
            }
        };
        let req;
        if (this.usesHTTPS) {
            req = https.request(requestOptions, handleResponse);
        }
        else {
            req = http.request(requestOptions, handleResponse);
        }
        const self = this;
        function handleResponse(res) {
            if (res.statusCode && !/^(20[04]|30[12478])$/.test(res.statusCode.toString())) {
                if (hasErrorListeners) {
                    self.emit('error', res.statusCode);
                }
            }
            const data = [];
            res.on('data', chunk => {
                data.push(chunk);
            });
            res.on('end', () => {
                const output = Buffer.concat(data).toString();
                typeof callback === 'function' && callback(output);
            });
        }
        req.on('error', (err) => {
            hasErrorListeners && this.emit('error', err.message);
        });
        req.write(body);
        req.end();
    }
}
exports.MatomoTracker = MatomoTracker;
module.exports = MatomoTracker;
