"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ieVersion() {
    var ua = window.navigator.userAgent;
    if (ua.indexOf("Trident/7.0") > 0) return 11;else if (ua.indexOf("Trident/6.0") > 0) return 10;else if (ua.indexOf("Trident/5.0") > 0) return 9;else return 0; // not IE9, 10 or 11
}

!window.ActiveXObject && "ActiveXObject";
function isIE11() {
    return !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
}

function isWebkit() {
    if (!!window.webkitURL) {
        return true;
    } else {
        return false;
    }
}

function isIos() {
    if (['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0) {
        return true;
    } else {
        return false;
    }
}

function isIpad() {
    if (['iPad'].indexOf(navigator.platform) >= 0) {
        return true;
    } else {
        return false;
    }
}

function isRetina() {
    if (window.devicePixelRatio > 1) {
        return true;
    } else {
        return false;
    }
}
//
// var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
// var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

// dit is een nieuwe //

function webgl_detect(return_context) {
    if (!!window.WebGLRenderingContext) {
        var canvas = document.createElement("canvas"),
            names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
            context = false;

        for (var i = 0; i < 4; i++) {
            try {
                context = canvas.getContext(names[i]);
                if (context && typeof context.getParameter == "function") {
                    // WebGL is enabled
                    if (return_context) {
                        // return WebGL object if the function's argument is present
                        return { name: names[i], gl: context };
                    }
                    // else, return just true
                    return true;
                }
            } catch (e) {}
        }

        if (canvas && canvas !== null) {
            canvas.remove();
        }

        // WebGL is supported, but disabled
        return false;
    }

    // WebGL not supported
    return false;
}

var black = 'rgb(0,0,0)';
var white = 'rgb(255,255,255)';
var grey = '#ddd';

var purple = 'rgb(182,32,121)';
var pink = 'rgb(237,62,117)';
var lightpink = 'rgb(252,213,225)';
var yellow = 'rgb(255,241,0)';
function loadJSON(filepath, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', filepath, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

var Lines = function () {
    function Lines(map, config) {
        _classCallCheck(this, Lines);

        this._map = map;
        this._config = config;

        this.speedFactor = 30; // number of frames per longitude degree
        this.animation = ''; // to store and cancel the animation
        this.startTime = 0;
        this.progress = 0; // progress = timestamp - startTime
        this.resetTime = false; // indicator of whether time reset is needed for the animation
        this.layerId = 'cjc4zc40d13wa2wqskv9bk020';

        //mapbox://styles/wijnemenjemee/cjdvrcqvn6dy32smopkqhd9q3
    }

    Lines.prototype.init = function init() {

        var self = this;
        self._draw();
    };

    // er zijn per route twee sources, een voor oud, een voor nieuw

    Lines.prototype.drawOldLayers = function drawOldLayers(routesId) {

        var self = this;

        self._map.addLayer({
            "id": 'route-bus_old',
            "type": "line",
            "source": 'routes-oud',
            "layout": {
                "line-join": "miter",
                "line-cap": "square",
                "visibility": "visible"
            },
            "paint": {
                "line-color": black,
                "line-width": 4,
                "line-dasharray": [1, 0]
            },
            "filter": ['all', ["==", "isNieuw", false], ["==", "transport_type", "bus"]]
        }, 'origins');

        self._map.addLayer({
            "id": 'route-tram_old',
            "type": "line",
            "source": 'routes-oud',
            "layout": {
                "line-join": "miter",
                "line-cap": "square",
                "visibility": "visible"
            },
            "paint": {
                "line-color": black,
                "line-width": 4,
                "line-dasharray": [.75, .25]
            },
            "filter": ['all', ["==", "isNieuw", false], ["==", "transport_type", "tram"]]
        }, 'origins');

        self._map.addLayer({
            "id": 'route-metro_old',
            "type": "line",
            "source": 'routes-oud',
            "layout": {
                "line-join": "miter",
                "line-cap": "square",
                "visibility": "visible"
            },
            "paint": {
                "line-color": black,
                "line-width": 4,
                "line-dasharray": [1, 1]

            },
            "filter": ['all', ["==", "isNieuw", false], ["==", "transport_type", "metro"]]
        }, 'origins');

        self._map.addLayer({
            "id": 'route-train_old',
            "type": "line",
            "source": 'routes-oud',
            "layout": {
                "line-join": "miter",
                "line-cap": "square",
                "visibility": "visible"
            },
            "paint": {
                "line-color": black,
                "line-width": 4,
                "line-dasharray": [1, 2]

            },
            "filter": ['all', ["==", "isNieuw", true], ["==", "transport_type", "trein"]]
        }, 'origins');
    };

    Lines.prototype.drawNewLayers = function drawNewLayers(routesId) {
        var _layout, _layout2;

        var self = this;

        self._map.addLayer({
            "id": 'route-bus_new',
            "type": "line",
            "source": 'routes-nieuw',
            "layout": {
                "line-join": "miter",
                "line-cap": "square",
                "visibility": "visible"
            },
            "paint": {
                "line-color": black,
                "line-width": 4,
                "line-dasharray": [1, 0]

            },
            "filter": ['all', ["==", "isNieuw", true], ["==", "transport_type", "bus"]]
        }, 'origins');

        self._map.addLayer({
            "id": 'route-tram_new',
            "type": "line",
            "source": 'routes-nieuw',
            "layout": {
                "line-join": "miter",
                "line-cap": "square",
                "visibility": "visible"
            },
            "paint": {
                "line-color": black,
                "line-width": 4,
                "line-dasharray": [.25, .75]

            },
            "filter": ['all', ["==", "isNieuw", true], ["==", "transport_type", "tram"]]
        }, 'origins');

        self._map.addLayer({
            "id": 'route-metro_new',
            "type": "line",
            "source": 'routes-nieuw',
            "layout": {
                "line-join": "miter",
                "line-cap": "square",
                "visibility": "visible"
            },
            "paint": {
                "line-color": black,
                "line-width": 4,
                "line-dasharray": [.5, .5]
            },
            "filter": ['all', ["==", "isNieuw", true], ["==", "transport_type", "metro"]]
        }, 'origins');

        self._map.addLayer({
            "id": 'route-train_new',
            "type": "line",
            "source": 'routes-nieuw',
            "layout": {
                "line-join": "miter",
                "line-cap": "square",
                "visibility": "visible"
            },
            "paint": {
                "line-color": black,
                "line-width": 4,
                "line-dasharray": [1, 2]

            },
            "filter": ['all', ["==", "isNieuw", true], ["==", "transport_type", "trein"]]
        }, 'origins');

        self._map.addLayer({
            "id": "transport-mode-new",
            "type": "symbol",
            "source": "routes-nieuw",
            "layout": (_layout = {
                "symbol-placement": "line",
                "icon-rotation-alignment": "viewport",
                "icon-image": {
                    property: 'transport_type',
                    type: 'categorical',
                    stops: [['trein', "trein"], ['bus', "bus"], ['tram', "tram"], ['metro', "metro"], ['wandel', "voetganger"]]
                },
                "icon-size": .7,
                "icon-padding": 20,
                "icon-allow-overlap": true,
                "icon-anchor": 'bottom',
                "icon-offset": [-40, 25],
                "visibility": "none",
                "text-field": "{transport_nrs}"
            }, _defineProperty(_layout, "symbol-placement", "point"), _defineProperty(_layout, "text-size", 15), _defineProperty(_layout, "text-anchor", "right"), _defineProperty(_layout, "text-offset", [-2.75, .275]), _defineProperty(_layout, "text-max-width", 30), _defineProperty(_layout, "text-font", ["Avenir LT Std 85 Heavy"]), _defineProperty(_layout, "text-transform", "uppercase"), _defineProperty(_layout, "text-allow-overlap", true), _layout),
            "paint": {
                "icon-opacity": 1,
                "text-color": black
            },
            "filter": ['all', ["==", "isNieuw", true]]
        });

        self._map.addLayer({
            "id": "transport-mode-old",
            "type": "symbol",
            "source": "routes-oud",
            "layout": (_layout2 = {
                "symbol-placement": "line",
                "icon-rotation-alignment": "viewport",
                "icon-image": {
                    property: 'transport_type',
                    type: 'categorical',
                    stops: [['trein', "trein"], ['bus', "bus"], ['tram', "tram"], ['metro', "metro"], ['wandel', "voetganger"]]
                },
                "icon-size": .7,
                "icon-padding": 20,
                "icon-allow-overlap": true,
                "icon-anchor": 'bottom',
                "icon-offset": [-40, 25],
                "visibility": "none",
                "text-field": "{transport_nrs}"
            }, _defineProperty(_layout2, "symbol-placement", "point"), _defineProperty(_layout2, "text-size", 15), _defineProperty(_layout2, "text-anchor", "right"), _defineProperty(_layout2, "text-offset", [-2.75, .275]), _defineProperty(_layout2, "text-max-width", 30), _defineProperty(_layout2, "text-font", ["Avenir LT Std 85 Heavy"]), _defineProperty(_layout2, "text-transform", "uppercase"), _defineProperty(_layout2, "text-allow-overlap", true), _layout2),
            "paint": {
                "icon-opacity": 1,
                "text-color": black
            },
            "filter": ['all', ["==", "isNieuw", false]]
        });
    };

    Lines.prototype._animateLine = function _animateLine(timestamp) {

        var self = this;

        if (self.resetTime) {
            // resume previous progress
            self.startTime = performance.now() - self.progress;
            self.resetTime = false;
        } else {
            self.progress = timestamp - self.startTime;
        }

        // restart if it finishes a loop
        if (self.progress > self.speedFactor * 360) {
            self.startTime = timestamp;
            self.lines.features[0].geometry.coordinates = [];
        } else {
            var x = self.progress / self.speedFactor;
            // draw a sine wave with some math.
            var y = Math.sin(x * Math.PI / 90) * 40;
            // append new coordinates to the lineString
            self.lines.features[0].geometry.coordinates.push([x, y]);
            // then update the map
            self._map.getSource('lines').setData(self.lines);
        }
        // Request the next frame of the animation.
        self.animation = requestAnimationFrame(self._animateLine);
    };

    return Lines;
}();

var MapJs = function () {
    function MapJs(config) {
        _classCallCheck(this, MapJs);

        this._config = config;
    }

    MapJs.prototype.create = function create() {

        var self = this;
        console.log(self._config);
        L.mapbox.accessToken = self._config.accessToken;
        this._map = L.mapbox.map(self._config.hostContainer).setView([self._config.center[1], self._config.center[0]], self._config.zoom);
        var styleLayer = L.mapbox.styleLayer(self._config.style).addTo(this._map);

        console.log(self._config.scrollzoom);
        console.log(self._map.scrollWheelZoom);
        if (self._map.scrollWheelZoom && self._config.scrollzoom === false) {
            console.log('disable');
            self._map.scrollWheelZoom.disable();
        }

        return this._map;
    };

    return MapJs;
}();

var MapWebGL = function () {
    function MapWebGL(config) {
        _classCallCheck(this, MapWebGL);

        this._config = config;
    }

    MapWebGL.prototype.create = function create() {

        var self = this;

        mapboxgl.accessToken = self._config.accessToken;

        this._map = new mapboxgl.Map({
            attributionControl: false,
            container: self._config.hostContainer,
            center: self._config.center,
            zoom: self._config.zoom,
            minZoom: 10,
            maxZoom: 16,
            style: self._config.style,
            scrollZoom: self._config.scrollZoom,
            pitch: self._config.pitch,
            bearing: self._config.bearing
        });

        var nav = new mapboxgl.NavigationControl();
        self._map.addControl(nav, 'top-right').addControl(new mapboxgl.AttributionControl({
            compact: true
        }));

        if (self._map.scrollZoom && self._config.scrollzoom === false) {
            self._map.scrollZoom.disable();
        }

        return this._map;
    };

    MapWebGL.prototype._drawContentFromTemplate = function _drawContentFromTemplate() {

        var self = this;
        self._map.on('load', function () {
            self._addIcons(self.templateContent);
        });
    };

    MapWebGL.prototype._drawPoints = function _drawPoints() {

        var self = this;

        self._map.on('load', function () {

            self._map.addSource("points", {
                "type": "geojson",
                "data": self.dataset.points
            });

            self._map.addLayer({
                "id": "references",
                "type": "circle",
                "source": "points",
                "paint": {
                    "circle-color": {
                        property: 'class',
                        type: 'categorical',
                        stops: [['omleiding', '#4C9630'], ['beperking', '#DC3D50'], ['geluidsmeter', '#4C9630']]
                    },
                    "circle-radius": {
                        property: 'class',
                        type: 'categorical',
                        stops: [['omleiding', 20], ['beperking', 20], ['geluidsmeter', 2]]
                    },
                    "circle-opacity": {
                        property: 'class',
                        type: 'categorical',
                        stops: [['omleiding', 1], ['beperking', 1], ['geluidsmeter', 1]]

                    },
                    "circle-stroke-width": {
                        property: 'class',
                        type: 'categorical',
                        stops: [['omleiding', 0], ['beperking', 0], ['geluidsmeter', 18]]

                    },
                    "circle-stroke-color": {
                        property: 'class',
                        type: 'categorical',
                        stops: [['omleiding', '#4C9630'], ['beperking', '#DC3D50'], ['geluidsmeter', '#4C9630']]
                    },
                    "circle-stroke-opacity": {
                        property: 'class',
                        type: 'categorical',
                        stops: [['omleiding', 1], ['beperking', 1], ['geluidsmeter', .7]]

                    }
                }
            });

            self._map.addLayer({
                "id": "labels",
                "type": "symbol",
                "source": "points",
                'layout': {
                    'visibility': 'visible',
                    'text-field': '{reference}',
                    "text-font": ["Arial Unicode MS Bold"], // "Cabrito Sans W01 Norm Bold",
                    "text-size": 14,
                    "text-offset": [0, -0.1]
                },
                'paint': {
                    "text-color": "#fff"
                }
            });
        });
    };

    MapWebGL.prototype._initPopup = function _initPopup() {

        var self = this;

        self._map.on('style.load', function () {
            // Create a popup, but don't add it to the map yet.
            var popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
        });
    };

    return MapWebGL;
}();

var Origin = function () {
    function Origin(map, config) {
        _classCallCheck(this, Origin);

        this._map = map;
        this._config = config;
    }

    Origin.prototype.loadData = function loadData(origin) {

        this._map.addSource('points', {
            type: 'geojson',
            data: 'features/features_Amstelland_Station_Hoofddorp.json'
        });
    };

    return Origin;
}();

var Points = function () {
    function Points(map, config) {
        _classCallCheck(this, Points);

        this._map = map;
        this._config = config;
    }

    Points.prototype.addOrigins = function addOrigins() {

        this._map.addSource("origins", {
            "type": "geojson",
            "data": this._config.origins
        });
    };

    Points.prototype.drawOrigins = function drawOrigins(filter) {

        var self = this;

        self._map.addLayer({
            "id": "origins",
            "type": "circle",
            "source": "origins",
            "paint": {
                "circle-color": white,
                "circle-radius": 4,
                "circle-opacity": 1,
                "circle-stroke-width": 4,
                "circle-stroke-color": {
                    property: 'state',
                    type: 'categorical',
                    stops: [['inactive', purple], ['highlighted', pink], ['origin', black], ['destination', black]]
                },
                "circle-stroke-opacity": 1
            },
            "filter": ['all']
        });

        self._map.addLayer({
            "id": "origin-labels",
            "type": "symbol",
            "source": "origins",
            "layout": {
                "visibility": "visible",
                "icon-image": {
                    property: 'state',
                    type: 'categorical',
                    stops: [['inactive', ''], ['highlighted', 'rect_pink'], ['origin', 'rect_black'], ['destination', 'rect_black']]
                },
                "icon-padding": 0,
                "icon-text-fit": 'both',
                "icon-text-fit-padding": [5, 10, 2, 10],
                "icon-allow-overlap": true,
                "text-field": "{naam}",
                "symbol-placement": "point",
                "text-size": 15,
                "text-anchor": "left",
                "text-offset": [2, 0],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform": "uppercase",
                "text-allow-overlap": true
            },
            "paint": {
                'text-color': {
                    property: 'state',
                    type: 'categorical',
                    stops: [['inactive', '#fff'], ['highlighted', '#fff'], ['origin', yellow], ['destination', yellow]]
                }
            },
            "filter": ['all', ["in", "state", "origin", "destination", "highlighted"]]
        });

        self._map.addLayer({
            "id": "origin-labels-connector",
            "type": "symbol",
            "source": "origins",
            "layout": {

                "icon-image": {
                    property: 'state',
                    type: 'categorical',
                    stops: [['inactive', ''], ['highlighted', 'connector_pink'], ['origin', 'connector_black'], ['destination', 'connector_black']]
                },
                "icon-padding": 0,
                "icon-allow-overlap": true,
                "symbol-placement": "point",
                "icon-size": 1,
                "icon-offset": [16, 0]

            },
            "filter": ['all', ["in", "state", "origin", "destination", "highlighted"]]
        }, 'origins');
    };

    // drawDestinations(filter) {
    //
    //     let self = this;
    //
    //     self._map.addLayer({
    //         "id": "destinations",
    //         "type": "circle",
    //         "source": "destinations",
    //         "paint": {
    //             "circle-color": white,
    //             "circle-radius": 4,
    //             "circle-opacity": 1,
    //             "circle-stroke-width": 4,
    //             "circle-stroke-color": {
    //                 property: 'state',
    //                 type: 'categorical',
    //                 stops: [
    //                     ['inactive', grey],
    //                     ['highlighted', pink],
    //                     ['active', yellow]
    //                 ]
    //             },
    //             "circle-stroke-opacity": 1,
    //         },
    //     });
    //
    //     self._map.addLayer({
    //         "id": "destination-labels",
    //         "type": "symbol",
    //         "source": "destinations",
    //         "layout": {
    //             "visibility": "visible",
    //             "icon-image": {
    //                 property: 'state',
    //                 type: 'categorical',
    //                 stops: [
    //                     ['inactive', ''],
    //                     ['highlighted', 'rect_pink'],
    //                     ['active', 'rect_yellow']
    //                 ]
    //             },
    //             "icon-padding": 0,
    //             "icon-text-fit": 'both',
    //             "icon-text-fit-padding": [5,10,2,10],
    //             "icon-allow-overlap": true,
    //             "text-field": "{naam}",
    //             "symbol-placement": "point",
    //             "text-size": 15,
    //             "text-anchor": "left",
    //             "text-offset": [1.6,0],
    //             "text-max-width": 30,
    //             "text-font": ["Avenir LT Std 85 Heavy"],
    //             "text-transform" : "uppercase",
    //             "text-allow-overlap":true
    //         },
    //         "paint": {
    //             'text-color': {
    //                 property: 'state',
    //                 type: 'categorical',
    //                 stops: [
    //                     ['inactive', '#fff'],
    //                     ['highlighted', '#fff'],
    //                     ['active', '#000']
    //                 ]
    //             },
    //         },
    //         "filter": ['all',
    //             ["in", "state", "highlighted","active"]
    //         ]
    //     });
    //
    //     self._map.addLayer({
    //         "id": "destination-labels-connector",
    //         "type": "symbol",
    //         "source": "destinations",
    //         "layout": {
    //
    //             "icon-image": {
    //                 property: 'state',
    //                 type: 'categorical',
    //                 stops: [
    //                     ['inactive', ''],
    //                     ['highlighted', 'connector_pink'],
    //                     ['active', 'connector_yellow']
    //                 ]
    //             },
    //             "icon-padding": 0,
    //             "icon-allow-overlap": true,
    //             "symbol-placement": "point",
    //             "icon-size": 1,
    //             "icon-offset": [16,0],
    //
    //         },
    //         "filter": ['all',
    //             ["in", "state", "highlighted","active"]
    //         ]
    //     },'destination-labels');
    // }

    Points.prototype.drawTransfers = function drawTransfers(routesId) {

        var self = this;

        self._map.addLayer({
            "id": "transfers-old",
            "type": "circle",
            "source": "routes-oud",
            "paint": {
                "circle-color": "#fff",
                "circle-radius": 4,
                "circle-opacity": 1,
                "circle-stroke-width": 4,
                "circle-stroke-color": black,
                "circle-stroke-opacity": 1
            },
            "filter": ['all', ["==", "function", "overstap"]]
        });

        self._map.addLayer({
            "id": "transfers-new",
            "type": "circle",
            "source": "routes-nieuw",
            "paint": {
                "circle-color": "#fff",
                "circle-radius": 4,
                "circle-opacity": 1,
                "circle-stroke-width": 4,
                "circle-stroke-color": black,
                "circle-stroke-opacity": 1
            },
            "filter": ['all', ["==", "function", "overstap"]]
        });

        self._map.addLayer({
            "id": "transfer-labels-old",
            "type": "symbol",
            "source": "routes-oud",
            "layout": {
                "visibility": "visible",
                "icon-image": "rect_black",
                "icon-padding": 0,
                "icon-text-fit": 'both',
                "icon-text-fit-padding": [5, 10, 2, 10],
                "icon-allow-overlap": true,
                "text-field": "{naam}",
                "symbol-placement": "point",
                "text-size": 15,
                "text-anchor": "right",
                "text-offset": [-1.6, 0],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform": "uppercase",
                "text-allow-overlap": true
            },
            "paint": {
                'text-color': "#fff"
            },
            "filter": ['all', ["==", "function", "overstap"], ["==", "isNieuw", false]]
        });

        self._map.addLayer({
            "id": "transfer-labels-new",
            "type": "symbol",
            "source": "routes-nieuw",
            "layout": {
                "visibility": "visible",
                "icon-image": "rect_black",
                "icon-padding": 0,
                "icon-text-fit": 'both',
                "icon-text-fit-padding": [5, 10, 2, 10],
                "icon-allow-overlap": true,
                "text-field": "{naam}",
                "symbol-placement": "point",
                "text-size": 15,
                "text-anchor": "right",
                "text-offset": [-1.6, 0],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform": "uppercase",
                "text-allow-overlap": true
            },
            "paint": {
                'text-color': "#fff"
            },
            "filter": ['all', ["==", "function", "overstap"], ["==", "isNieuw", true]]
        });
    };

    // self._map.addLayer({
    //     "id": "labels",
    //     "type": "symbol",
    //     "source": "originData",
    //     "layout": {
    //         "text-font": ["Cabrito Semi W01 Norm E ExtraBold"],
    //         "text-field": "{name}",
    //         "symbol-placement": "point",
    //         "text-size": 20,
    //         "text-anchor": "left",
    //         "text-offset": [1.5,0],
    //         "text-max-width": 30
    //     },
    //     "paint": {
    //         'text-color': '#ffffff'
    //     }
    // });


    return Points;
}();

var Map = function () {
    function Map(element, data, interaction) {
        _classCallCheck(this, Map);

        this.element = document.getElementById(element);

        try {
            var dataConfig = this.element.getAttribute('data-config');
            this.customConfig = JSON.parse(dataConfig);
        } catch (err) {
            this.customConfig = [];
            console.log(err);
        }

        this.config = {
            accessToken: 'pk.eyJ1Ijoid2lqbmVtZW5qZW1lZSIsImEiOiJjaWgwZjB4ZGwwMGdza3FseW02MWNxcmttIn0.l-4VI25pfA5GKukRQTXnWA',
            style: 'mapbox://styles/wijnemenjemee/cjcywszq502re2sobjc8d1e0z',
            hostContainer: element,
            center: [4.9, 52.37],
            zoom: 10.2,
            pitch: 0,
            bearing: 0,
            scrollZoom: false
        };

        this.session = {
            incarnation: 'old',
            origin: null,
            destination: null,
            data: {},
            route: null,
            routeName: ''

            //data from argument in footer scripts (datasets)
        };if (data) {
            this.config.origins = JSON.parse(data);
        } else {
            this.config.origins = {};
        }

        this.config.origins = JSON.parse(data);

        this._callToAction = document.getElementById('call-to-action');
        this._listContainer = document.getElementById('list-container');
        this._routeBlock = document.getElementById('route-block');
        this._newOrigin = document.getElementById('new-origin');

        // this._newDestination = document.getElementById('new-destination');

    }

    Map.prototype.init = function init() {

        var self = this;

        var mapWebGL = new MapWebGL(self.config);
        self._map = mapWebGL.create();

        // self._background = new Background(self._map, self.config);
        self._origin = new Origin(self._map, self.config);
        self._points = new Points(self._map, self.config);
        self._lines = new Lines(self._map, self.config);

        self._map.on('style.load', function () {
            console.log(self.config.origins);
            self._points.addOrigins();
            self._initMap();
        });
        self._newOrigin.addEventListener("click", function () {
            self._clearOrigin();
        }, false);

        this._listEventHandlers();
    };

    Map.prototype._listEventHandlers = function _listEventHandlers() {

        var self = this;
        this._originList = document.getElementById('origin-list');
        [].slice.call(self._originList.querySelectorAll('ul')).forEach(function (ul) {
            var concessiegebied = ul.getAttribute('data-concession');
            ul.querySelector('span.concessiegebied').addEventListener("click", function (el) {
                self._toggleConcession(ul, concessiegebied);
            }, false);
        });
    };

    Map.prototype._toggleConcession = function _toggleConcession(ul, concessiegebied) {
        var self = this;

        [].slice.call(ul.querySelectorAll('li')).forEach(function (li) {
            if (li.classList.contains('hidden')) {
                li.classList.remove('hidden');
            } else {
                li.classList.add('hidden');
            }
        });
    };

    Map.prototype._initMap = function _initMap() {

        var self = this;

        self._points.drawOrigins();
        self._adaptOriginList();

        self._map.on("mouseover", "origins", function (e) {
            self._highlightOrigin(e.features[0].properties.originId);
        });
        self._map.on("mouseout", "origins", function (e) {
            self._unhighlightOrigin();
        });
        self._map.on("click", "origin-labels", function (e) {
            self._selectOrigin(e.features[0].properties.originId, '');
        });
    };

    Map.prototype._adaptOriginList = function _adaptOriginList() {

        var self = this;
        self._callToAction.innerHTML = "\n\n            <h2><span>Kies</span> een <span>startpunt</span></h2>\n            <span>uit de lijst of klik op een punt op de kaart</span>\n\n        ";

        var listItems = [].slice.call(self._listContainer.querySelectorAll('li'));

        listItems.forEach(function (item) {

            var name = item.getAttribute('data-name');
            var originId = item.getAttribute('data-origin-id');
            var filename = item.getAttribute('data-filename');

            item.addEventListener('mouseover', function () {
                self._highlightOrigin(originId);
            }, false);
            item.addEventListener('mouseout', function () {
                self._unhighlightOrigin();
            }, false);
            item.addEventListener('click', function () {
                self._selectOrigin(originId, filename);
            }, false);
        });
    };

    Map.prototype._highlightOrigin = function _highlightOrigin(originId) {

        self = this;
        self.config.origins.features.forEach(function (d) {

            if (d.properties.state !== 'origin' && d.properties.state !== 'destination' && d.properties.originId === originId) {
                d.properties.state = 'highlighted';
            }
        });
        this._map.getSource('origins').setData(self.config.origins);
    };

    Map.prototype._unhighlightOrigin = function _unhighlightOrigin() {

        self = this;
        self.config.origins.features.forEach(function (d) {
            if (d.properties.state !== 'origin' && d.properties.state !== 'destination') {
                d.properties.state = 'inactive';
            }
        });
        this._map.getSource('origins').setData(self.config.origins);
    };

    Map.prototype._purgeOrigins = function _purgeOrigins() {

        self = this;

        self.config.origins.features = self.config.origins.features.filter(function (f) {

            return f.property.availabe_as_destination === true;
        });

        this._map.getSource('origins').setData(self.config.origins);
    };

    Map.prototype._selectOrigin = function _selectOrigin(originId, filename) {
        var self = this;
        self.session.origin = originId;
        self.session.routeName = self._getPointName(originId);

        self.config.origins.features.forEach(function (d) {
            // if(d.properties.state === 'origin') {
            //     d.properties.state = 'inactive';
            // } else if (d.properties.id === id) {
            //     d.properties.state = 'highlighted';
            // }
            d.properties.state = 'inactive';
            if (d.properties.originId === originId) {
                d.properties.state = 'origin';
            }
        });
        this._map.getSource('origins').setData(self.config.origins);

        // let url = 'http://localhost:9876/api/route/' + originId;
        var url = 'http://37.46.136.132:9876/api/route/' + originId;

        axios.get(url).then(function (response) {
            if (response.status !== 200) {
                console.log('foutje bedankt');
            }
            self.session.data = {};
            self.session.data.originData = response.data;
            self._destinationList();
        });
    };

    // _highlightDestination(id) {
    //
    //     let self = this;
    //     self.session.data.destinations.features.forEach( function(d) {
    //         if(d.properties.state === 'highlighted') {
    //             d.properties.state = 'inactive';
    //         } else if (d.properties.id === id) {
    //             d.properties.state = 'highlighted';
    //         }
    //     });
    //     this._map.getSource('destinations').setData(self.session.data.destinations);
    // }

    // _unhighlightDestination() {
    //
    //     let self = this;
    //     self.session.data.destinations.features.forEach( function(d) {
    //         if(d.properties.state === 'highlighted') {
    //             d.properties.state = 'inactive';
    //         }
    //     });
    //     this._map.getSource('destinations').setData(self.session.data.destinations);
    // }
    //
    // _activateDestination(id) {
    //
    //
    // }

    Map.prototype._destinationList = function _destinationList() {

        var self = this;
        // self._listContainer.innerHTML = '';
        self._callToAction.innerHTML = "\n                <h2><span>Kies</span> een <span>bestemming</span></h2>\n                <span>uit de lijst of klik op een punt op de kaart</span>\n            ";

        // wissel oude lijst met nieuwe lijst (zonder event handlers)
        var list = self._listContainer.querySelector('#origin-list');
        var newList = list.cloneNode(true);

        if (['13412', '13663', '13431', '13527', '13378', '36003', '35250', '41783', '34294', '10220', '37224'].indexOf(self.session.origin) > -1) {}

        // [].slice.call(newList.querySelectorAll('ul.buiten-amsterdam li')).forEach((li) => {
        //     li.classList.add('hidden');
        // });


        // kun je hier de origin list clonen en appenden?

        var originalOriginItem = [].slice.call(list.querySelectorAll('li[data-origin-id]')).find(function (li) {
            return li.getAttribute('data-origin-id') === self.session.origin;
        });

        var originItem = originalOriginItem.cloneNode(true);
        originItem.classList.add('active-origin');

        var selectionList = document.createElement('ul');
        selectionList.id = "selection-list";
        selectionList.appendChild(originItem);

        self._listContainer.removeChild(list);
        self._listContainer.appendChild(selectionList);
        self._listContainer.appendChild(newList);

        // kan dit via een data property op de ul?
        if (['13412', '13663', '13431', '13527', '13378', '36003', '35250', '41783', '34294', '10220', '37224'].indexOf(self.session.origin) > -1) {

            // hide gebieden buiten amsterdam
            [].slice.call(newList.querySelectorAll('ul.buiten-amsterdam')).forEach(function (ul) {
                ul.classList.add('hidden');
                console.log('yes');
            });

            // open amsterdam items
            [].slice.call(newList.querySelectorAll('ul[data-concession]')).forEach(function (ul) {
                if (ul.getAttribute('data-concession') === 'amsterdam') {
                    self._toggleConcession(ul, 'amsterdam');
                }
            });

            //
        }

        // nieuwe event handlers)
        var listItems = [].slice.call(self._listContainer.querySelectorAll('li'));
        listItems.forEach(function (item) {

            var name = item.getAttribute('data-name');
            var originId = item.getAttribute('data-origin-id');
            var filename = item.getAttribute('data-filename');

            item.addEventListener('mouseover', function () {
                // self._highlightDestination(originId);
            }, false);
            item.addEventListener('mouseout', function () {
                // self._unhighlightDestination();
            }, false);
            item.addEventListener('click', function () {
                self._initRoute(originId);
            }, false);
        });

        var activeOriginItem = listItems.find(function (li) {

            // console.log(li.getAttribute('data-origin-id'));
            return li.getAttribute('data-origin-id') == self.session.origin;
        });

        activeOriginItem.classList.add('active');

        self._listEventHandlers();

        // let ul = document.createElement('ul');
        //
        // self.session.data.destinations.features.sort(function(a,b) {
        //     return (a.properties.naam > b.properties.naam) ? 1 : ((b.properties.naam > a.properties.naam) ? -1 : 0);
        // });
        //
        // self.session.data.destinations.features.forEach( (o) => {
        //
        //     let li = document.createElement('li');
        //     li.innerHTML = o.properties.naam;
        //     li.addEventListener('mouseover', function () {
        //         self._highlightDestination(o.properties.id);
        //     }, false);
        //     li.addEventListener('mouseout', function () {
        //         self._unhighlightDestination();
        //     }, false);
        //     li.addEventListener('click', function () {
        //         self._initRoute(o.properties.id);
        //     }, false);
        //
        //     ul.appendChild(li);
        // });
        //
        // self._listContainer.appendChild(ul);
    };

    Map.prototype._initRoute = function _initRoute(destination) {

        var self = this;

        // remove previous route layers
        // self._map.getStyle().layers.forEach( (l) => {
        //     if(l.id.indexOf('route-') > -1 || l.id.indexOf('transfer') > -1) {
        //         self._map.removeLayer(l.id);
        //     }
        // });


        // add selected destination to session
        self.session.destination = destination;
        self.session.route = self.session.origin + '_' + destination;
        self.session.routeName = self.session.routeName + ' naar ' + self._getPointName(destination);

        // highlight item in list
        var list = document.querySelector('#origin-list');
        [].slice.call(list.querySelectorAll('li[data-origin-id]')).forEach(function (li) {
            if (li.classList.contains('active')) {
                li.classList.remove('active');
            }
            if (li.getAttribute('data-origin-id') === self.session.destination) {
                li.classList.add('active');
            }
        });

        // hier status van origins aanpassen
        self.config.origins.features.forEach(function (d) {

            if (d.properties.state !== 'origin') {
                d.properties.state = 'inactive';
            }
            if (d.properties.originId === destination) {
                // console.log(d.properties);
                d.properties.state = 'destination';
            }
        });
        self._map.getSource('origins').setData(self.config.origins);

        // self._activateDestination(destination);

        var newRoute = [];
        var oldRoute = [];

        // verdeel trajecten over object met nieuwe en oude route
        self.session.data.originData.forEach(function (traject) {

            // origin = 13412
            // destination = 15569

            if (traject.properties.routeId.split('_')[0] === self.session.origin && traject.properties.routeId.split('_')[1] === destination ||
            // voor reversed route
            traject.properties.routeId.split('_')[1] === self.session.origin && traject.properties.routeId.split('_')[0] === destination) {

                if (traject.properties.routeId.split('_')[2].indexOf('oud') > -1) {
                    oldRoute.push(traject);
                } else if (traject.properties.routeId.split('_')[2].indexOf('nieuw') > -1) {
                    newRoute.push(traject);
                }
            }
        });

        self.session.data.routes = [oldRoute, newRoute];

        if (self.session.data.routes[0] && self.session.data.routes[0].length > 0) {

            self._setRouteInfo(self.session.data.routes);

            self.session.data.routes.forEach(function (r) {

                var incarnation = r[0].properties.routeId.split('_')[2];

                // console.log(r);

                var route = {
                    "type": "FeatureCollection",
                    "features": r
                };

                if (self._map.getSource('routes-' + incarnation) === undefined) {
                    self._map.addSource('routes-' + incarnation, {
                        "type": "geojson",
                        "data": route
                    });
                    setTimeout(function () {
                        self._lines.drawOldLayers();
                        self._lines.drawNewLayers();
                        self._points.drawTransfers(self.session.route);
                        self._switchRouteBlockColor();
                        self._switchRouteLayers(self.session.route);
                    }, 200);
                } else {
                    self._map.getSource('routes-' + incarnation).setData(route);
                }
            });
        } else {

            console.log('routes object is leeg');
            console.log(self.session);
        }

        setTimeout(function () {

            self._setBoundingBox();
        }, 500);
    };

    Map.prototype._showDestinations = function _showDestinations() {

        var self = this;
        var params = {};
        params.layers = ['destinations'];
        self.config.destinations = self._filterDestinations(self._map.queryRenderedFeatures(params));
    };

    Map.prototype._setRouteInfo = function _setRouteInfo(routes) {

        var self = this;

        self._routeBlock.innerHTML = '';
        var header = document.createElement('h3');

        header.innerHTML = self.session.routeName;

        var knob = document.createElement('div');
        knob.id = "route-select";

        knob.innerHTML = "\n                    <label class=\"switch\">\n                        <input id=\"route-switch\" type=\"checkbox\">\n                        <span class=\"slider round\"></span>\n                        <span class=\"label checked\">Nieuwe reis</span>\n                        <span class=\"label unchecked\">Huidige reis</span>\n                    </label>\n        ";

        knob.addEventListener("click", function (e) {
            self._routeSwitch(this, e, true);
        }, false);

        var ul = document.createElement('ul');

        var routeIds = [];

        routes.forEach(function (route) {

            //  sort by  properties.order_nr

            var sort = function sort(prop, arr) {
                prop = prop.split('.');
                var len = prop.length;

                arr.sort(function (a, b) {
                    var i = 0;
                    while (i < len) {
                        a = a[prop[i]];
                        b = b[prop[i]];
                        i++;
                    }
                    if (a < b) {
                        return -1;
                    } else if (a > b) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                return arr;
            };

            route = sort('properties.order_nr', route);

            var q = void 0;

            if (route[0] && route[0].properties.isNieuw === true) {
                q = 'Nieuwe route';
            } else {
                q = 'Huidige route';
            }

            var li = document.createElement('li');
            li.addEventListener("click", function (e) {
                self._routeSwitch(this, e, false);
            }, false);
            var input = document.createElement('input');
            input.type = "checkbox";
            input.name = route[0].properties.routeId;
            input.checked = true;
            li.appendChild(input);
            var label = document.createElement('label');
            label.innerHTML = q;
            li.appendChild(label);
            var segmentList = document.createElement('ul');
            route.forEach(function (traject) {

                if (traject.geometry.type === 'LineString') {

                    var nrs = void 0;
                    if (traject.properties.transport_type !== 'trein') {
                        nrs = traject.properties.transport_nrs.join('/');
                    } else {
                        nrs = '';
                    }

                    var icon = '';

                    if (traject.properties.transport_type === 'bus') {

                        icon = "\n                            <svg width=\"26px\" height=\"32px\" viewBox=\"0 0 26 32\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                <polygon id=\"Path\" fill=\"#FFFFFF\" points=\"5.832 28.416 5.832 31.232 2.312 31.232 2.312 28.416 0.968 28.416 0.2 20.672 1.288 1.856 2.632 0.448 23.112 0.448 24.456 1.856 25.544 20.672 24.776 28.416 23.432 28.416 23.432 31.232 19.912 31.232 19.912 28.416\"></polygon>\n                                <polygon id=\"Path\" fill=\"#000000\" points=\"2.888 4.864 22.856 4.864 22.856 2.304 2.888 2.304\"></polygon>\n                                <path d=\"M2.312,23.296 C2.312,24.32 3.08,25.088 4.04,25.088 C5,25.088 5.832,24.32 5.832,23.296 C5.832,22.336 5,21.568 4.04,21.568 C3.08,21.568 2.312,22.336 2.312,23.296 Z\" id=\"Path\" fill=\"#000000\"></path>\n                                <path d=\"M19.912,23.296 C19.912,24.32 20.744,25.088 21.704,25.088 C22.664,25.088 23.432,24.32 23.432,23.296 C23.432,22.336 22.664,21.568 21.704,21.568 C20.744,21.568 19.912,22.336 19.912,23.296 Z\" id=\"Path\" fill=\"#000000\"></path>\n                                <polygon id=\"Path\" fill=\"#000000\" points=\"3.656 18.048 22.088 18.048 22.856 6.464 2.888 6.464\"></polygon>\n                            </svg> \n                        ";
                    } else if (traject.properties.transport_type === 'metro') {

                        icon = "<svg width=\"34px\" height=\"34px\" viewBox=\"0 0 34 34\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                            <polygon id=\"Path\" fill=\"#fff\" points=\"7.208 0.232 27.048 0.232 28.136 1.384 28.136 21.352 26.024 23.4 8.104 23.4 5.992 21.352 5.992 1.384\"></polygon>\n                            <path d=\"M7.016,19.112 C7.016,20.008 7.72,20.712 8.616,20.712 C9.512,20.712 10.216,20.008 10.216,19.112 C10.216,18.216 9.512,17.512 8.616,17.512 C7.72,17.512 7.016,18.216 7.016,19.112 Z\" id=\"Path\" fill=\"#000\"></path>\n                            <polygon id=\"Path\" fill=\"#fff\" points=\"29.864 33.32 22.248 25.128 23.592 25.128 33.768 33.32\"></polygon>\n                            <polygon id=\"Path\" fill=\"#fff\" points=\"12.328 25.128 4.776 33.32 0.872 33.32 11.048 25.128\"></polygon>\n                            <path d=\"M23.528,19.112 C23.528,20.008 24.296,20.712 25.192,20.712 C26.024,20.712 26.792,20.008 26.792,19.112 C26.792,18.216 26.024,17.512 25.192,17.512 C24.296,17.512 23.528,18.216 23.528,19.112 Z\" id=\"Path\" fill=\"#000\"></path>\n                            <polygon id=\"Path\" fill=\"#000\" points=\"13.352 6.504 13.352 14.696 26.792 14.696 26.792 6.504\"></polygon>\n                            <polygon id=\"Path\" fill=\"#000\" points=\"7.464 1.64 7.464 5.352 12.328 5.352 12.328 1.64\"></polygon>\n                        </svg>";
                    } else if (traject.properties.transport_type === 'tram') {

                        icon = "<svg width=\"19px\" height=\"36px\" viewBox=\"0 0 19 36\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                            <polygon id=\"Path\" fill=\"#fff\" points=\"0.976 30.904 0.976 8.184 5.776 8.184 5.776 4.344 14.16 4.344 14.16 8.184 18.96 8.184 18.96 30.904 16.272 33.592 16.272 35.896 14.928 35.832 14.928 33.592 5.008 33.592 5.008 35.832 3.6 35.896 3.6 33.592\"></polygon>\n                            <polygon id=\"Path\" fill=\"#000\" points=\"17.04 11.192 2.896 11.192 4.56 24.184 15.376 24.184\"></polygon>\n                            <path d=\"M8.4,28.152 C8.4,28.984 9.104,29.688 9.936,29.688 C10.832,29.688 11.536,28.984 11.536,28.152 C11.536,27.256 10.832,26.616 9.936,26.616 C9.104,26.616 8.4,27.256 8.4,28.152 Z\" id=\"Path\" fill=\"#000\"></path>\n                            <polygon id=\"Path\" fill=\"#000\" points=\"7.12 9.592 12.752 9.592 12.752 5.688 7.12 5.688\"></polygon>\n                            <polygon id=\"Path\" fill=\"#fff\" points=\"2.384 2.04 2.384 0.76 17.552 0.76 17.552 2.04\"></polygon>\n                        </svg>";
                    } else if (traject.properties.transport_type === 'walk') {

                        icon = "\n                            <svg width=\"38px\" height=\"36px\" viewBox=\"0 0 38 36\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                <path d=\"M5.112,9.976 C5.112,9.144 5.816,8.376 6.712,8.376 C7.608,8.376 8.312,9.144 8.312,9.976 C8.312,10.872 7.608,11.576 6.712,11.576 C5.816,11.576 5.112,10.872 5.112,9.976 Z\" id=\"Path\"></path>\n                                <polygon id=\"Path\" points=\"29.496 7.416 32.76 13.304 37.752 17.336 36.664 19.384 30.648 15.672 29.496 13.432 29.496 18.232 32.568 24.248 34.488 35.064 31.288 35.832 29.24 26.488 26.808 22.456 23.928 28.28 19.256 34.168 17.08 32.184 21.176 25.592 23.736 18.04 23.736 11.704 21.048 14.328 18.424 19.128 16.44 17.976 19.256 11.896 23.736 7.416\"></polygon>\n                                <path d=\"M23.928,3.448 C23.928,1.976 25.144,0.76 26.616,0.76 C28.088,0.76 29.304,1.976 29.304,3.448 C29.304,4.92 28.088,6.072 26.616,6.072 C25.144,6.072 23.928,4.92 23.928,3.448 Z\" id=\"Path\"></path>\n                                <polygon id=\"Path\" points=\"4.984 12.408 8.44 12.408 11.128 15.096 12.856 18.744 11.64 19.384 10.104 16.568 8.44 14.968 8.44 18.744 9.976 23.288 12.472 27.256 11.128 28.408 8.376 24.952 6.648 21.432 5.112 23.864 3.896 29.432 1.976 28.984 3.192 22.456 4.984 18.872 4.984 15.992 4.28 17.336 0.696 19.576 0.056 18.36 3.064 15.928\"></polygon>\n                            </svg>";
                    }

                    var segment = document.createElement('li');
                    var segmentContent = icon + '<div><span>' + traject.properties.transport_type + '</span> <span>' + nrs + '</span><span> : </span><span>' + traject.properties.start_naam + '</span><span> - </span></span><span>' + traject.properties.end_naam + '</span></div>';
                    segment.innerHTML = segmentContent;
                    segmentList.appendChild(segment);
                }
            });
            li.appendChild(segmentList);
            // li.addEventListener("click", function (e) {
            //     self._toggleRoute(e,r.features[0].properties.routeId);
            // }, false);
            ul.appendChild(li);

            routeIds.push(route[0].properties.routeId);
        });

        self._routeBlock.appendChild(header);
        self._routeBlock.appendChild(knob);
        self._routeBlock.appendChild(ul);
    };

    Map.prototype._switchRouteLayers = function _switchRouteLayers(routeId) {

        self = this;

        if (self.session.incarnation === 'old') {

            self._showOld(routeId);
        } else {
            self._showNew(routeId);
        }
    };

    Map.prototype._switchRouteBlockColor = function _switchRouteBlockColor() {

        self = this;
        if (self.session.incarnation === 'old') {
            self._routeBlock.querySelector('#route-block > ul > li:nth-child(1)').style.background = lightpink;
            self._routeBlock.querySelector('#route-block > ul > li:nth-child(2)').style.background = grey;
        } else {
            self._routeBlock.querySelector('#route-block > ul > li:nth-child(1)').style.background = grey;
            self._routeBlock.querySelector('#route-block > ul > li:nth-child(2)').style.background = lightpink;
        }
    };

    Map.prototype._showNew = function _showNew() {

        var self = this;

        self._map.setLayoutProperty('route-bus_new', 'visibility', 'visible');
        self._map.setLayoutProperty('route-metro_new', 'visibility', 'visible');
        self._map.setLayoutProperty('route-tram_new', 'visibility', 'visible');
        self._map.setLayoutProperty('route-train_new', 'visibility', 'visible');

        self._map.setLayoutProperty('route-bus_old', 'visibility', 'none');
        self._map.setLayoutProperty('route-metro_old', 'visibility', 'none');
        self._map.setLayoutProperty('route-tram_old', 'visibility', 'none');
        self._map.setLayoutProperty('route-train_old', 'visibility', 'none');

        self._map.setLayoutProperty('transfers-new', 'visibility', 'visible');
        self._map.setLayoutProperty('transfer-labels-new', 'visibility', 'visible');
        self._map.setLayoutProperty('transfers-old', 'visibility', 'none');
        self._map.setLayoutProperty('transfer-labels-old', 'visibility', 'none');

        self._map.setLayoutProperty('transport-mode-old', 'visibility', 'none');
        self._map.setLayoutProperty('transport-mode-new', 'visibility', 'visible');
    };

    Map.prototype._showOld = function _showOld() {

        var self = this;

        self._map.setLayoutProperty('route-bus_new', 'visibility', 'none');
        self._map.setLayoutProperty('route-metro_new', 'visibility', 'none');
        self._map.setLayoutProperty('route-tram_new', 'visibility', 'none');
        self._map.setLayoutProperty('route-train_new', 'visibility', 'none');

        self._map.setLayoutProperty('route-bus_old', 'visibility', 'visible');
        self._map.setLayoutProperty('route-metro_old', 'visibility', 'visible');
        self._map.setLayoutProperty('route-tram_old', 'visibility', 'visible');
        self._map.setLayoutProperty('route-train_old', 'visibility', 'visible');

        self._map.setLayoutProperty('transfers-new', 'visibility', 'none');
        self._map.setLayoutProperty('transfer-labels-new', 'visibility', 'none');
        self._map.setLayoutProperty('transfers-old', 'visibility', 'visible');
        self._map.setLayoutProperty('transfer-labels-old', 'visibility', 'visible');

        self._map.setLayoutProperty('transport-mode-old', 'visibility', 'visible');
        self._map.setLayoutProperty('transport-mode-new', 'visibility', 'none');
    };

    Map.prototype._setBoundingBox = function _setBoundingBox() {

        var self = this;
        var features = self._map.queryRenderedFeatures({ layers: ['route-bus_new', 'route-metro_new', 'route-tram_new', 'route-train_new', 'route-bus_old', 'route-metro_old', 'route-tram_old', 'route-train_old'] });

        var collection = {
            "type": "FeatureCollection",
            "features": features
        };

        var bbox = turf.bbox(collection);

        self._map.fitBounds(bbox, {
            padding: { top: 200, bottom: 200, left: 200, right: 200 },
            linear: true
        });
    };

    Map.prototype._routeSwitch = function _routeSwitch(el, e, fromSwitch) {

        console.log(e.target.tagName);

        if (!fromSwitch || fromSwitch && (e.target.tagName === 'INPUT' || e.target.tagName === 'DIV')) {

            var _self = this,
                routes = void 0,
                routeIds = [];

            if (this.session.incarnation === 'old') {
                this.session.incarnation = 'new';
                var newRouteId = _self.session.data.routes[1][0].properties.routeId;
                _self._switchRouteLayers(newRouteId);
            } else {
                this.session.incarnation = 'old';
                var oldRouteId = _self.session.data.routes[0][0].properties.routeId;
                _self._switchRouteLayers(oldRouteId);
            }

            _self._switchRouteBlockColor();
        }
    };

    Map.prototype._filterOrigins = function _filterOrigins(dataset) {
        var features = dataset.features.filter(function (obj, pos, arr) {
            return arr.map(function (mapObj) {
                return mapObj.properties.naam;
            }).indexOf(obj.properties.naam) === pos && obj.properties.function == 'herkomst';
        });
        var collection = {
            "type": "FeatureCollection",
            "features": features
        };
        return collection;
    };

    Map.prototype._filterDestinations = function _filterDestinations(features) {
        var unique = [];
        return features.filter(function (obj) {
            if (unique.indexOf(obj.properties.naam) > -1) {
                return false;
            } else {
                unique.push(obj.properties.naam);
                return true;
            }
        });
    };

    Map.prototype._filterRoutes = function _filterRoutes(routes) {

        var unique = [];
        return routes.filter(function (obj) {
            if (unique.indexOf(obj.start_id) > -1) {
                return false;
            } else {
                unique.push(obj.start_id);
                return true;
            }
        });
    };

    Map.prototype._clearOrigin = function _clearOrigin() {
        var self = this;
        this.session = {
            origin: null,
            destination: null
        };
        this._listContainer.innerHTML = '';

        // remove previous route layers
        self._map.getStyle().layers.forEach(function (l) {
            if (l.id.indexOf('route-') > -1 || l.id.indexOf('origin') > -1 || l.id.indexOf('destination') > -1) {
                self._map.removeLayer(l.id);
            }
        });

        self._initMap();
    };

    Map.prototype._getPointName = function _getPointName(id) {

        var self = this;
        var point = self.config.origins.features.find(function (p) {
            return p.properties.originId === id;
        });
        return point.properties.naam;
    };

    return Map;
}();