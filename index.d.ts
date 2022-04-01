/**
 * A Node.js wrapper for the Matomo (http://matomo.org) tracking HTTP API
 * https://github.com/matomo-org/matomo-nodejs-tracker
 *
 * @author  Frederic Hemberger, Matomo Team
 * @license MIT
 */
/// <reference types="node" />
import * as events from "events";
/**
 * @constructor
 * @param {Number} siteId     Id of the site you want to track
 * @param {String} trackerUrl URL of your Matomo instance
 * @param {Boolean} [noURLValidation]  Set to true if the `piwik.php` or `matomo.php` has been renamed
 */
export declare class MatomoTracker extends events.EventEmitter {
    private readonly siteId;
    private readonly trackerUrl;
    private readonly usesHTTPS;
    constructor(siteId: number, trackerUrl: string, noURLValidation?: boolean);
    /**
     * Executes the call to the Matomo tracking API
     *
     * For a list of tracking option parameters see
     * https://developer.matomo.org/api-reference/tracking-api
     *
     * @param {(String|Object)} options URL to track or options (must contain URL as well)
     */
    track(options: MatomoSingleTrackOptions | string): void;
    trackBulk(events: MatomoTrackOptions[], callback: (response: string) => void): void;
}
interface MatomoSingleTrackOptions extends MatomoTrackOptions {
    url: string;
}
interface MatomoTrackOptions {
    [key: string]: number | string | undefined;
    idsite?: number;
    rec?: 1;
    action_name?: string;
    _id?: string;
    rand?: string;
    apiv?: 1;
    urlref?: string;
    _cvar?: string;
    _idvc?: string;
    _viewts?: string;
    _idts?: string;
    _rcn?: string;
    _rck?: string;
    res?: string;
    h?: number;
    m?: number;
    s?: number;
    fla?: 1;
    java?: 1;
    dir?: 1;
    qt?: 1;
    pdf?: 1;
    wma?: 1;
    ag?: 1;
    cookie?: 1;
    ua?: string;
    lang?: string;
    uid?: string;
    cid?: string;
    new_visit?: number;
    cvar?: string;
    link?: string;
    download?: string;
    search?: string;
    search_cat?: string;
    search_count?: number;
    pv_id?: string;
    idgoal?: number;
    revenue?: number;
    gt_ms?: number;
    cs?: string;
    ca?: 1;
    e_c?: string;
    e_a?: string;
    e_n?: string;
    e_v?: string;
    c_n?: string;
    c_p?: string;
    c_t?: string;
    c_i?: string;
    ec_id?: string;
    ec_items?: string;
    ec_st?: number;
    ec_tx?: number;
    ec_sh?: number;
    ec_dt?: number;
    _ects?: number;
    token_auth?: string;
    cip?: string;
    cdt?: string;
    country?: string;
    region?: string;
    city?: string;
    lat?: string;
    long?: string;
    ma_id?: string;
    ma_ti?: string;
    ma_re?: string;
    ma_mt?: "video" | "audio";
    ma_pn?: string;
    ma_sn?: number;
    ma_le?: number;
    ma_ps?: number;
    ma_ttp?: number;
    ma_w?: number;
    ma_h?: number;
    ma_fs?: 1 | 0;
    ma_se?: string;
    queuedtracking?: 0;
    send_image?: 0;
    ping?: 1;
    bots?: 1;
}
export {};
