var YK = {}

// Utility helpers for internal performance tweaks
YK.Utils = {
    /**
     * Lightweight JSON normalization to ensure handlers always receive objects.
     * Accepts plain objects or JSON strings.
     * @param {object|string} payload
     * @returns {object|string}
     */
    normalizeJson(payload) {
        if (typeof payload !== 'string') {
            return payload;
        }

        try {
            return JSON.parse(payload);
        } catch (e) {
            return payload;
        }
    },

    /**
     * Simple throttle implementation to reduce high-frequency handler calls.
     * @param {function} fn
     * @param {number} wait
     * @returns {function}
     */
    throttle(fn, wait) {
        let inFlight = false;
        return function (...args) {
            if (inFlight) return;
            inFlight = true;
            fn.apply(this, args);
            setTimeout(() => {
                inFlight = false;
            }, wait);
        };
    }
};
/*#####################################################################################################################*/
// Form Validation Module - Load yannick/validation.js for form validation utilities
YK.Validation = window.YannickValidator || null;
/*#####################################################################################################################*/
YK.Web = {
    Ajax: {
        _cache: new Map(),

        _buildCacheKey(url, method, data) {
            return `${method}:${url}:${JSON.stringify(data || {})}`;
        },

        _resolveCache(key, cacheMs) {
            if (!cacheMs || cacheMs <= 0) return null;
            const cached = this._cache.get(key);
            if (!cached) return null;

            const isFresh = Date.now() - cached.timestamp < cacheMs;
            return isFresh ? cached.payload : null;
        },

        _storeCache(key, payload) {
            this._cache.set(key, {payload, timestamp: Date.now()});
        },

        /**
         * Generic JSON helper with optional response caching and abort support.
         * @param {Object} opts
         * @param {string} opts.url
         * @param {'get'|'post'|'put'|'delete'} [opts.method]
         * @param {Object} [opts.data]
         * @param {Function} [opts.onSuccess]
         * @param {Function} [opts.onError]
         * @param {number} [opts.cacheMs] Cache duration in milliseconds
         * @param {Object} [opts.headers]
         * @returns {jqXHR|PromiseLike<any>} jqXHR instance for network calls or a resolved promise for cache hits
         */
        requestJson: function ({
            url,
            method = 'post',
            data = {},
            onSuccess = function () {},
            onError = function () {},
            cacheMs = 0,
            headers = {}
        }) {
            const normalizedMethod = method.toLowerCase();
            const cacheKey = this._buildCacheKey(url, normalizedMethod, data);
            const cached = this._resolveCache(cacheKey, cacheMs);

            if (cached !== null) {
                const response = YK.Utils.normalizeJson(cached);
                onSuccess(response, cached);
                return $.Deferred().resolve(response, cached).promise();
            }

            const ajaxOptions = {
                url: url,
                type: normalizedMethod,
                data: JSON.stringify(data || {}),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                headers: headers,
                success: (response) => {
                    const normalized = YK.Utils.normalizeJson(response);
                    if (cacheMs > 0) this._storeCache(cacheKey, normalized);
                    onSuccess(normalized, response);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    onError(textStatus, errorThrown, jqXHR);
                }
            };

            return $.ajax(ajaxOptions);
        },

        /**
         * Legacy alias with improved parsing and optional caching.
         * @param {string} url
         * @param {Object} data
         * @param {Function} onSuccess
         * @param {Function} onError
         * @param {Object} options Additional options ({cacheMs, headers})
         */
        PostAsJson: function (url, data = {}, onSuccess = function (response, original) {
        }, onError = function (jqXHR, textStatus, errorThrown) {
        }, options = {}) {
            return this.requestJson({
                url,
                data,
                onSuccess,
                onError,
                cacheMs: options.cacheMs,
                headers: options.headers
            });
        },

        /**
         * Clear a cached response or reset the entire cache.
         * @param {string} [key]
         */
        clearCache: function (key) {
            if (typeof key === 'string') {
                this._cache.delete(key);
            } else {
                this._cache.clear();
            }
        }
    }
}
/*#####################################################################################################################*/
$(document).on('click', '[yk-type=checkbox]', function () {
    if ($(this).attr('yk-state') === "visible")
        $(this).removeAttr('yk-state');
    else
        $(this).attr('yk-state', 'visible');
});
/*#####################################################################################################################*/
YK.Ratio = {
    OnChange: function (group, item){},
    OnBeforeChange: function (group, item){},
}
$(document).on('click', '[yk-type=ratio]', function () {
    const m = $(this);
    if (m.attr('yk-state') === "selected")
        return;

    const group = m.attr('yk-group');
    const mb = $('[yk-type=ratio][yk-state=selected][yk-group=' + group + ']');
    YK.Ratio.OnBeforeChange(group, mb);
    mb.removeAttr('yk-state');
    
    YK.Ratio.OnChange(group, m);

    m.attr('yk-state', 'selected');
});
/*#####################################################################################################################*/
/*
* YK.Tab namespace to manage tab functionality.
*/
YK.Tab = {
    /**
     * Called after a tab change.
     * @param {string} [group] - The group of the tab.
     * @param {string} link - The link of the tab.
     */
    AfterChange: function (group, link) {
        // Function implementation
    },

    /**
     * Called before a tab change.
     * @param {string} [group] - The group of the tab.
     * @param {string} link - The link of the tab.
     * @param {string} newLink - The link of the tab that now open.
     */
    BeforeChange: function (group, link, newLink) {
        // Function implementation
    },

    Active: {
        Last: {
            Link: null,
            Group: null
        },
        Groups: {}
    },

    /**
     * Updates the visibility state of the tabs.
     */
    UpdateTabs: function () 
    {
        YK.Tab.Active = {
            Last: {
                Link: null,
                    Group: null
            },
            Groups: {}
        }
        
        $('[yk-type=tab][yk-option=menu]').each(function (_, v) {
            const m = $(v);
            if (m.attr('yk-state') !== "visible") {
                $('[yk-type=tab][yk-option=content][yk-link=' + m.attr('yk-link') + ']').hide();
                YK.Tab.Active.Groups[m.attr('yk-group')] = {
                    Active: true,
                    Link: m.attr('yk-link')
                };
            } else {
                YK.Tab.Active.Last.Link = m.attr('yk-link');
                YK.Tab.Active.Last.Group = m.attr('yk-group');
                YK.Tab.Active.Groups[YK.Tab.Active.Last.Group] = {
                    Active: false,
                    Link: null
                };
            }
        });
    },

    /**
     * Changes the tab to active.
     * @param {string} link - The link of the tab.
     * @param {string|undefined} [group] - The group of the tab. Optional.
     */
    ChangeToActive: function (link, group = undefined) {
        // Make group optional
        group = group || YK.Tab.Active.Last.Group;

        const m = $('[yk-type=tab][yk-option=menu][yk-link=' + link + '][yk-group=' + group + ']');
        if (m.attr('yk-state') === "visible")
            return;

        const mm = $('[yk-type=tab][yk-option=menu][yk-state=visible][yk-group=' + group + ']');
        mm.removeAttr('yk-state');

        m.attr('yk-state', 'visible');

        const c = $('[yk-type=tab][yk-option=content][yk-state=visible][yk-group=' + group + ']');
        c.hide();
        c.removeAttr('yk-state');

        const nc = $('[yk-type=tab][yk-option=content][yk-link=' + link + '][yk-group=' + group + ']');
        
        YK.Tab.BeforeChange(YK.Tab.Active.Last.Group, YK.Tab.Active.Last.Link, nc.attr('yk-link'));
        YK.Tab.Active.Groups[group].Active = false;
        YK.Tab.Active.Groups[group].Link = null;
        
        nc.attr('yk-state', 'visible');
        YK.Tab.Active.Last.Link = nc.attr('yk-link');
        YK.Tab.Active.Last.Group = nc.attr('yk-group');
        YK.Tab.Active.Groups[YK.Tab.Active.Last.Group].Active = true;
        YK.Tab.Active.Groups[YK.Tab.Active.Last.Group].Link = YK.Tab.Active.Last.Link;
        $('[yk-type="tab"][yk-option="info"][yk-group=' + group + ']').attr('yk-state', YK.Tab.Active.Last.Link)
        YK.Tab.AfterChange(YK.Tab.Active.Last.Group, YK.Tab.Active.Last.Link);
        nc.show();
    }
};

$(document).on('click', '[yk-type=tab][yk-option=menu]', function () {
    const m = $(this);
    if (m.attr('yk-state') === "visible")
        return;

    YK.Tab.ChangeToActive(m.attr('yk-link'), m.attr('yk-group'));
});

YK.Tab.UpdateTabs();
/*#####################################################################################################################*/
YK.Menu = {
    Active: {
        Link: null,
        Group: null
    }
}

$(document).on('click', '[yk-type=menu][yk-option=menu]', function () {
    const t = $(this);
    const c = $('[yk-type=menu][yk-option=content][yk-link=' + t.attr('yk-link') + ']');
    if (t.attr('yk-state') === "visible") {
        t.removeAttr('yk-state');
        c.removeAttr('yk-state');
        c.hide();
    } else {
        if (YK.Menu.Active.Link !== null) {
            $('[yk-type=menu][yk-option=menu][yk-link=' + YK.Menu.Active.Link + ']').removeAttr('yk-state');
            const c2 = $('[yk-type=menu][yk-option=content][yk-link=' + YK.Menu.Active.Link + ']');
            c2.removeAttr('yk-state');
            c2.hide();
        }
        YK.Menu.Active.Link = t.attr('yk-link');
        YK.Menu.Active.Group = t.attr('yk-group');
        t.attr('yk-state', "visible");
        c.attr('yk-state', "visible");
        c.show();
    }
});

// Use a single delegated listener instead of binding to every element
$(document).on('click', function (event) {
    if (YK.Menu.Active.Link === null) return;

    const target = $(event.target);
    if (target.attr('yk-link') === YK.Menu.Active.Link) return;

    const activeM = $('[yk-type=menu][yk-option=menu][yk-link=' + YK.Menu.Active.Link + ']');
    const activeC = $('[yk-type=menu][yk-option=content][yk-link=' + YK.Menu.Active.Link + ']');
    if (!activeM.is(':focus') && !activeC.is(':focus')) {
        activeM.removeAttr('yk-state');
        activeC.removeAttr('yk-state');
        activeC.hide();
        YK.Menu.Active.Link = null;
        YK.Menu.Active.Group = null;
    }
});

function UpdateMenu() {
    $('[yk-type=menu][yk-option=menu]').each(function (_, v) {
        const m = $(v);
        if (m.attr('yk-state') !== "visible")
            $('[yk-type=menu][yk-option=content][yk-link=' + m.attr('yk-link') + ']').hide();
    });
}

UpdateMenu();
/*#####################################################################################################################*/
$(document).on('click', '[yk-type=onClick][yk-option=redirect]', function () {
    let cL = window.location.href;
    let tL = $(this).attr('yk-link');
    if (cL.includes("?")) {
        cL = cL.substring(0, window.location.href.indexOf("?"));
    } else if (cL.includes("#")) {
        cL = cL.substring(0, window.location.href.indexOf("#"));
    }
    if (tL.includes("?")) {
        tL = tL.substring(0, window.location.href.indexOf("?"));
    } else if (tL.includes("#")) {
        tL = tL.substring(0, window.location.href.indexOf("#"));
    }

    if (cL !== tL)
        window.location.href = $(this).attr('yk-link');
});
/*#####################################################################################################################*/
$('[yk-type=modal][yk-option=content]').hide();
YK.Modal = {
    open(link, beforeScript, beforeType) {
        if (beforeScript && beforeType === 'js') {
            new Function(beforeScript)();
        }
        const panel = $('[yk-type=modal][yk-option=content][yk-link=\'' + link + '\']');
        panel.attr('yk-state', 'visible');
        panel.show();
    },
    close(link) {
        const panel = $('[yk-type=modal][yk-option=content][yk-link=\'' + link + '\']');
        panel.removeAttr('yk-state');
        panel.hide();
    },
    closeAll() {
        $('[yk-type=modal][yk-option=content][yk-state=visible]').each(function (_, v) {
            const panel = $(v);
            panel.removeAttr('yk-state');
            panel.hide();
        });
    }
};

$(document).on('click', '[yk-type=modal][yk-option=onClick]', function () {
    YK.Modal.open($(this).attr('yk-link'), $(this).attr('yk-before'), $(this).attr('yk-before-type'));
});

$(document).on('click', '[yk-type=modal][yk-option=exit]', function () {
    YK.Modal.close($(this).attr('yk-link'));
});

$(document).on('keydown', function (event) {
    if (event.key === 'Escape') {
        if (YK.Menu.Active.Link !== null) {
            const activeM = $('[yk-type=menu][yk-option=menu][yk-link=' + YK.Menu.Active.Link + ']');
            const activeC = $('[yk-type=menu][yk-option=content][yk-link=' + YK.Menu.Active.Link + ']');
            activeM.removeAttr('yk-state');
            activeC.removeAttr('yk-state');
            activeC.hide();
            YK.Menu.Active.Link = null;
            YK.Menu.Active.Group = null;
        }
        YK.Modal.closeAll();
    }
});
/*#####################################################################################################################*/
$(document).on('click', '[yk-type=onClick][yk-option=scroll]', function () {
    if ($(this).attr('yk-arg') === "menu") {
        const g = $(this).attr('yk-group');
        if (typeof g !== 'undefined' && g !== false)
            $('[yk-type=onClick][yk-option=scroll][yk-arg=menu][yk-state=visible][yk-group=' + g + ']').removeAttr("yk-state");
        else
            $('[yk-type=onClick][yk-option=scroll][yk-arg=menu][yk-state=visible]').removeAttr("yk-state");

        $(this).attr("yk-state", "visible")
    }
    $($(this).attr("yk-link")).get(0).scrollIntoView({
        behavior: "smooth"
    });
});
let scrollMenuItemList = []

function refreshScrollMenuList() {
    scrollMenuItemList.length = 0;
    $('[yk-type=onClick][yk-option=scroll][yk-arg=menu]').each(function (_, v) {
        scrollMenuItemList.push($(v));
    });
}

refreshScrollMenuList();
$(document).ready(function () {
    document.addEventListener('scroll', function (e) {
        if (!EnableAutoSmoothScroll)
            return true;
        const mE = $('[yk-type=onClick][yk-option=scroll][yk-arg=menu][yk-state=visible]');
        if (mE === undefined)
            return true;
        const eE = $(mE.attr('yk-link'));
        if (eE.css('visibility') !== 'hidden' && eE.css('display') !== 'none')
            return true;
        for (let i = 0; i < scrollMenuItemList.length; i++) {
            const e = scrollMenuItemList[i];
            if (e.is(":visible")) {
                mE.removeAttr("yk-state");
                e.attr('yk-state', 'visible');
            }
        }
    }, true);
});
EnableAutoSmoothScroll = false;
/*#####################################################################################################################*/
$(document).on('click', '[yk-type=ajax][yk-option=click]', function () {
    const l = $('[yk-type=ajax][yk-option=post][yk-group=' + $(this).attr('yk-group') + ']').attr('yk-link');
    const para = {};

    $('[yk-type=ajax][yk-option=parameter][yk-group=' + $(this).attr('yk-group') + ']').each(function (_, v) {
        const tv = $(v);
        let vT = null;
        switch (tv[0].nodeName.toLowerCase()) {
            case "input":
                vT = tv.val();
                break;
            default:
                vT = tv.text();
                break;
        }
        para[tv.attr('yk-arg')] = vT;
    });

    $.ajax({
        url: l,
        type: "post",
        data: para,
        dataType: "json",
        success: function (response) {
            const r = JSON.parse(response);
            if (r.isOk) {
                window.location.href = r.redirectToUrl;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
});
/*#####################################################################################################################*/
let autoScrollList = [];

function refreshAutoScrollList() {
    autoScrollList = [];

    $('[yk-type=scroll][yk-option=auto]').each(function (_, v) {
        const $tv = $(v);
        const group = $tv.attr('yk-group');

        const scrollInfo = {
            active: 0,
            max: 0,
            last: $tv.scrollTop(),
            start: $tv.scrollTop(),
            activeS: false
        };

        const itemList = [$tv];

        // Select children based on the presence of yk-group attribute
        const childrenSelector = group ? `[yk-group=${group}]` : '*';

        $tv.children(childrenSelector).each(function (_, vc) {
            scrollInfo.max++;
            itemList.push($(vc));
        });

        autoScrollList.push({scrollInfo, itemList});

        if (scrollInfo.max > 0) {
            scrollInfo.active = 1;

            $tv.on('scroll', function () {
                if (scrollInfo.activeS) return;

                scrollInfo.activeS = true;

                const currentScrollTop = $tv.scrollTop();
                const beforeActive = scrollInfo.active;

                if (currentScrollTop > scrollInfo.last) {
                    if (scrollInfo.active < scrollInfo.max) scrollInfo.active++;
                } else {
                    if (scrollInfo.active > 0) scrollInfo.active--; // Allow decrement to 0
                }

                scrollInfo.last = currentScrollTop;

                let targetPos;
                if (beforeActive !== scrollInfo.active) {
                    targetPos = itemList[scrollInfo.active].get(0).offsetTop;
                } else {
                    targetPos = scrollInfo.start;
                }

                $tv.stop().animate({
                    scrollTop: targetPos,
                }, 300, function () {
                    setTimeout(function () {
                        scrollInfo.activeS = false;
                    }, 20);
                });
            });
        }
    });
}

refreshAutoScrollList();

/*##################################*/
YK.Event = {};
YK.Event.Input = {};
/*#####################################################################################################################*/

/**
 * @class YK.Event.Input.Filter
 * @classdesc A class to filter user input on an HTML element based on specified criteria.
 */
YK.Event.Input.Filter = class 
{
    // Private fields
    #element;
    #filterFunction;
    #keydownHandler;
    #inputHandler;
    /**
     * @type {boolean}
     */
    #enabled;
    /**
     * @type {boolean}
     */
    #allowedBypassFilterFuncForControlKeys;
    #idToElement
    #lastValidValue;
    #controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];

    /**
     * Constructs a new Filter instance for the specified element.
     * @param {HTMLElement|jQuery|String} element - The input element to apply the filter to. or css selector
     */
    constructor(element) {
        if (typeof element === "string")
            this.#idToElement = element;
        else
        {
            this.#element = $(element);
            this.#lastValidValue = new Array(this.#element.length)
        }
        
        this.#filterFunction = null;
        this.#keydownHandler = null;
        this.#inputHandler = null;
        this.#enabled = false;
        this.#allowedBypassFilterFuncForControlKeys = true;
    }
    
    static CreateNumberFilter(element) {
        const instance = new YK.Event.Input.Filter(element);

        instance.setFilterFunction(function (newValue) {
            // Allow empty string
            if (newValue === '') return true;

            // Disallow non-digit characters
            if (!/^[0-9]+$/.test(newValue)) {
                return false;
            }

            // Prevent leading zeros (except for zero itself)
            if (/^0\d/.test(newValue)) {
                return false;
            }

            const numericValue = parseInt(newValue, 10);
            if (isNaN(numericValue)) {
                return false;
            }
        });

        return instance;
    }

    static CreateNumberFloatFilter(element) {
        const instance = new YK.Event.Input.Filter(element);

        instance.setFilterFunction(function (newValue) {
            // Allow empty string
            if (newValue === '' || newValue === '-' || newValue === '.' || newValue === '-.' || newValue === ',') {
                return true;
            }

            // Check for valid format
            const isValidFormat = /^-?\d*(\.|,)?\d*$/.test(newValue);
            const hasSingleDecimal = !/(\..*\.)|(,.*,)|\.,|,\./.test(newValue);
            const isNotLeadingZero =
                !/^0\d/.test(newValue) || /^0([.,]|$)/.test(newValue) || /^-0([.,]|$)/.test(newValue);

            if (!isValidFormat || !hasSingleDecimal || !isNotLeadingZero) {
                return false;
            }

            const numericValue = parseFloat(newValue.replace(',', '.'));
            if (isNaN(numericValue)) {
                return false;
            }
        });

        return instance;
    }

    static CreateNumberFilterWithRange(element, min, max) {
        const instance = new YK.Event.Input.Filter(element);

        instance.setFilterFunction(function (newValue) {
            // Allow empty string
            if (newValue === '') return true;

            // Disallow non-digit characters
            if (!/^[0-9]+$/.test(newValue)) {
                return false;
            }

            // Prevent leading zeros (except for zero itself)
            if (/^0\d/.test(newValue)) {
                return false;
            }

            const numericValue = parseInt(newValue, 10);
            if (isNaN(numericValue)) {
                return false;
            }

            const minValue = min !== undefined ? min : Number.MIN_SAFE_INTEGER;
            const maxValue = max !== undefined ? max : Number.MAX_SAFE_INTEGER;

            return numericValue >= minValue && numericValue <= maxValue;
        });

        return instance;
    }


    
    static CreateNumberFloatFilterWithRange(element, min, max) {
        const instance = new YK.Event.Input.Filter(element);

        instance.setFilterFunction(function (newValue) {
            // Allow empty string
            if (newValue === '' || newValue === '-' || newValue === '.' || newValue === '-.' || newValue === ',') {
                return true;
            }

            // Check for valid format
            const isValidFormat = /^-?\d*(\.|,)?\d*$/.test(newValue);
            const hasSingleDecimal = !/(\..*\.)|(,.*,)|\.,|,\./.test(newValue);
            const isNotLeadingZero =
                !/^0\d/.test(newValue) || /^0([.,]|$)/.test(newValue) || /^-0([.,]|$)/.test(newValue);

            if (!isValidFormat || !hasSingleDecimal || !isNotLeadingZero) {
                return false;
            }

            const numericValue = parseFloat(newValue.replace(',', '.'));
            if (isNaN(numericValue)) {
                return false;
            }

            const minValue = min !== undefined ? min : -Number.MAX_VALUE;
            const maxValue = max !== undefined ? max : Number.MAX_VALUE;

            return numericValue >= minValue && numericValue <= maxValue;
        });

        return instance;
    }

    #setSelectorToElement()
    {
        if (typeof this.#idToElement !== undefined)
        {
            this.#element = $(this.#idToElement);
            this.#idToElement = undefined;
            this.#lastValidValue = new Array(this.#element.length)
        }
        
        return this;
    }

    currentVal()
    {
        return this.#element.val();
    }
    
    allowedControlKeys()
    {
        this.#allowedBypassFilterFuncForControlKeys = true;
    }
    disableControlKeys()
    {
        this.#allowedBypassFilterFuncForControlKeys = false;
    }
    isControlKeysEnabled()
    {
        return this.#allowedBypassFilterFuncForControlKeys;
    }
    
    /**
     * Sets the filter using a list of allowed characters.
     * @param  {...string} chars - Allowed characters. support single string its split then
     * @return {Filter} the current instance
     */
    setFilterWithKeys(...chars) {
        const allowedChars = new Set(chars.length === 1 ?  chars[0].split('') : chars);
        this.#filterFunction = function (char) {
            return allowedChars.has(char);
        };
        return this;
    }

    /**
     * Sets the filter using a regular expression.
     * @param {RegExp} regex - Regular expression to test characters.
     * @return {Filter} the current instance or null if regex not allowed
     */
    setFilterWithRegex(regex) {
        if (regex instanceof RegExp) {
            this.#filterFunction = function (char) {
                return regex.test(char);
            };
        } else {
            return null;
        }
        
        return this;
    }


    #initialCheck() {
        const elements = this.#element;
        
        elements.each((i, el) => {
            const $el = $(el);
            const v = $el.val();

            if (!v) return;
            
            const newV = v.split('').filter(char => this.#filterFunction(char)).join('');

            $el.val(newV);
            
            this.#lastValidValue[i] = newV || '';
        });
    }

    /**
     * Registers the filter by attaching event handlers to the element.
     * @throws {Error} If no filter function has been set.
     */
    register() {
        if (this.#filterFunction === null) {
            throw new Error('No filter function set');
        }

        if (this.#enabled) {
            // Already registered
            return this;
        }

        this.#setSelectorToElement();

        this.#initialCheck();

        const instance = this;

        this.#keydownHandler = function () {}
        
        // Input handler to filter pasted or IME input
        this.#inputHandler = function() 
        {
            const element = $(this);
            const value = element.val();
            const index = element.index(this);
            
            if (!instance.#filterFunction(value))
                element.val(instance.#lastValidValue[index]);
            else
                instance.#lastValidValue[index] = value;
        };

        // Attach the event handlers
        this.#element.on('keydown', this.#keydownHandler);
        this.#element.on('input', this.#inputHandler);

        this.#enabled = true;

        return this;
    }


    /**
     * Unregisters the filter by detaching event handlers from the element.
     */
    unregister() {
        if (!this.#enabled) {
            return;
        }

        if (this.#keydownHandler !== null) {
            this.#element.off('keydown', this.#keydownHandler);
            this.#keydownHandler = null;
        }
        if (this.#inputHandler !== null) {
            this.#element.off('input', this.#inputHandler);
            this.#inputHandler = null;
        }

        this.#enabled = false;
    }

    /**
     * Checks if the specified character is allowed by the filter.
     * @param {string} char - The character to check.
     * @returns {boolean} True if the character is allowed, false otherwise.
     * @throws {Error} If no filter function has been set.
     */
    isCharAllowed(char) {
        if (this.#filterFunction === null) {
            throw new Error('No filter function set');
        }
        return this.#filterFunction(char);
    }

    /**
     * Gets the current filter function.
     * @returns {function} The current filter function.
     */
    getFilterFunction() {
        return this.#filterFunction;
    }

    /**
     * Sets the filter function directly.
     * @param {function} func - A function that takes a character and returns true if allowed.
     * @return {Filter} the current instance or null if filter func not a function
     * @throws {Error} If func is not a function.
     */
    setFilterFunction(func) {
        if (typeof func === 'function') {
            this.#filterFunction = func;
        } else {
            return null;
        }
        
        return this;
    }

    /**
     * Enables the filter without re-registering the event handlers.
     * @return {Filter} the current instance
     */
    enable() {
        this.register();
        return this;
    }

    /**
     * Disables the filter without unregistering the event handlers.
     * @return {Filter} the current instance
     */
    disable() {
        this.unregister();
        return this;
    }

    /**
     * Checks if the filter is currently enabled.
     * @returns {boolean} True if enabled, false otherwise.
     */
    isEnabled() {
        return this.#enabled;
    }
};

/*#####################################################################################################################*/
/*$(document).on('change', '*', function () //NOT SUPPORT
{
    const t = $(this)

    $('body').each(function (_, v)
    {
        const t2 = $(this);

        if (t2.attr('yk-type') === "onChange")
        {
            const o = t2.attr('yk-option');
            const k = t2.attr('yk-key');
            const v = t2.attr('yk-value');
            const l = t2.attr('yk-link');
            const e = $(e);

            if (t.is(e))
            {
                if (o === "attribute")
                {
                    if (t.attr(k) === v)
                        t2.attr(k,v);
                    else
                        t2.removeAttr(k);
                }
            }
        }
    });
});*/
/*#####################################################################################################################*/


































