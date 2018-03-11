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

var purple = 'rgb(182,32,121)';
var pink = 'rgb(237,62,117)';
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

var ActiveMarkers = function () {
    function ActiveMarkers(map, config, popup, center) {
        _classCallCheck(this, ActiveMarkers);

        this._map = map;
        this._config = config;
        this._interactionPopup = popup;
        this._center = center;
    }

    ActiveMarkers.prototype.setGL = function setGL(array) {

        var self = this,
            filter = void 0;

        if (array && array.length > 0 && array.length < 2) {
            // < 2 zorgt ervoor dat ie op homepage niet actief is
            filter = ['in', 'slug'];
            array.forEach(function (item) {
                filter.push(item);
            });
            // voor verzamelpagina's zoals homepage .. nu even niks
        } else if (array && array.length > 1) {
            filter = ["==", 'slug', ''];
            // als activeItems leeg is zoals bijv bij bouwprojecten
        } else {
            filter = ['has', 'slug'];
        }

        if (self._map.getLayer('icons-active')) {

            self._map.setFilter('icons-active', filter);

            setTimeout(function () {
                self._center.setGL();
            }, 2000);
        }
    };

    ActiveMarkers.prototype.setJS = function setJS(content, activeItems) {

        var self = this,
            m = void 0;

        if (activeItems && activeItems.length < 2) {

            activeItems.forEach(function (item) {
                m = document.querySelector('.leaflet-marker-icon.' + item);
                // console.log(m);
                if (m) {
                    m.classList.add('active');
                }
            });

            self._center.setJS(content, activeItems);
        }
    };

    return ActiveMarkers;
}();

var Background = function () {
    function Background(map, config) {
        _classCallCheck(this, Background);

        this._map = map;
        this._config = config;
    }

    Background.prototype.init = function init() {

        var self = this;

        self._map.addSource("terrain", {
            "type": "vector",
            "url": "mapbox://mapbox.mapbox-terrain-v2"
        });

        self._map.addLayer({
            "id": "water",
            "type": "fill",
            "source": "terrain",
            "paint": {
                "circle-color": "#fff",
                "circle-radius": 6,
                "circle-opacity": 1,
                "circle-stroke-width": 6,
                "circle-stroke-color": donkergeel,
                "circle-stroke-opacity": 1
            },
            "filter": ['any', ["==", "name", "overstap"], ["==", "name", "0"]]
        });
    };

    return Background;
}();

var Center = function () {
    function Center(map, config) {
        _classCallCheck(this, Center);

        this._map = map;
        this._config = config;
    }

    Center.prototype.setGL = function setGL() {

        var self = this,
            activeFeatures = self._map.queryRenderedFeatures({ layers: ['icons-active'] });

        if (activeFeatures && activeFeatures.length === 1) {
            var latLng = [activeFeatures[0].geometry.coordinates[0], activeFeatures[0].geometry.coordinates[1]];
            self._map.setCenter(latLng);
            self._map.setZoom(self._config.zoom);
        } else if (activeFeatures && activeFeatures.length > 1) {

            var collection = activeFeatures.map(function (f) {
                return f.geometry.coordinates;
            });
            // self._map.fitBounds(collection, {
            //     padding: {top: 10, bottom:10, left: 10, right: 10}
            // });
        }
    };

    Center.prototype.setJS = function setJS(content, activeItems) {

        var self = this,
            latLng = void 0,
            activeMarkers = void 0;

        // console.log(activeItems);

        if (activeItems && activeItems.length < 2) {

            activeMarkers = content.features.filter(function (f) {
                return f.properties.slug === activeItems[0];
            });

            // console.log(activeMarkers);

            if (activeMarkers[0]) {
                latLng = new L.LatLng(parseFloat(activeMarkers[0].geometry.coordinates[1]) + 0, parseFloat(activeMarkers[0].geometry.coordinates[0]) - 0);
                setTimeout(function () {
                    self._map.setView(latLng, self._config.zoom);
                }, 500);
            }
        } else {
            // self._map.fitBounds(activeMarkers.getBounds().pad(2.5));
        }
    };

    return Center;
}();

var ContentLayer = function () {
    function ContentLayer(map, config, popup, activeItems) {
        _classCallCheck(this, ContentLayer);

        this._map = map;
        this._config = config;
        this.interactionPopup = popup;
        this.activeItems = activeItems;
    }

    ContentLayer.prototype.draw = function draw(content) {

        var self = this,
            html = void 0,
            lngLat = void 0,
            type = void 0,
            offset = void 0;

        if (webgl_detect()) {

            self._map.addSource('markers', {
                'type': 'geojson',
                'data': content
            });

            self._map.addLayer({
                "id": "icons",
                "type": "symbol",
                "source": "markers",

                "layout": {
                    "icon-image": {
                        property: 'type',
                        type: 'categorical',
                        stops: [['project', "projectIcon"], ['blog', "blogIcon"]]
                    },
                    "icon-padding": 0,
                    "icon-allow-overlap": true,
                    "icon-anchor": 'bottom',
                    "icon-offset": [20, 10],
                    "visibility": "visible"

                    // "icon-rotate": 25
                },
                "paint": {
                    "icon-opacity": 1
                },
                "filter": ['any', ['==', 'type', 'project'], ['==', 'type', 'blog']]
            });

            if (self._config.highlights) {

                self._map.addLayer({
                    "id": "icons-active",
                    "type": "symbol",
                    "source": "markers",

                    "layout": {
                        "icon-image": {
                            property: 'type',
                            type: 'categorical',
                            stops: [['project', "projectIconActive"], ['blog', "blogIconActive"]]
                        },
                        "icon-padding": 0,
                        "icon-allow-overlap": true,
                        "icon-anchor": 'bottom',
                        "icon-offset": [15, 10],
                        "visibility": "visible",
                        "icon-size": 1
                        // "icon-rotate": 25
                    },
                    "paint": {
                        "icon-color": "#000"

                    },
                    "filter": ['all', ["==", 'slug', '']]
                });
            }

            self._map.on("click", "icons", function (e) {

                self._map.getCanvas().style.cursor = 'pointer';

                html = self.interactionPopup.createPopup(e.features[0]);
                offset = [18, -42];
                lngLat = e.features[0].geometry.coordinates;
                type = e.features[0].properties.type;

                self.interactionPopup.openPopup(self._map, html, lngLat, type, offset);
            });

            self._map.on("click", "icons-active", function (e) {

                self._map.getCanvas().style.cursor = 'pointer';

                html = self.interactionPopup.createPopup(e.features[0]);
                offset = [16, -34];
                lngLat = e.features[0].geometry.coordinates;
                type = e.features[0].properties.type;

                self.interactionPopup.openPopup(self._map, html, lngLat, type, offset);
            });

            self.activeItems.setGL(self._config.activeItems);
        } else {

            var marker = void 0,
                markers = [],
                _html = void 0,
                latLng = void 0,
                popup = void 0,
                initialPopups = void 0,
                blogIcon = void 0;

            var iconGenerator = new IconGenerator();

            content.features.forEach(function (item) {

                if (item.properties.type === 'blog') {
                    blogIcon = iconGenerator.blogIcon(item);
                } else if (item.properties.type === 'project') {
                    blogIcon = iconGenerator.projectIcon(item);
                }

                marker = L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]], { icon: blogIcon }); // .bindPopup(item.title);

                // console.log(item);
                // console.log(marker);

                marker.on('click', function (e) {

                    _html = self.interactionPopup.createPopup(item);
                    //open popup;
                    initialPopups = L.popup({
                        className: item.properties.type,
                        offset: [0, 36]
                    }).setLatLng(e.latlng).setContent(_html).openOn(self._map);
                });
                markers.push(marker);
            });

            this.markers = new L.featureGroup(markers);
            this.markers.addTo(self._map);

            self.activeItems.setJS(content, self._config.activeItems);
            self._map.fitBounds(self.markers.getBounds().pad(1));
        }
    };

    // voor bereikbaarheid


    ContentLayer.prototype.zoom = function zoom() {

        var self = this,
            coordinates = self._config.dataset.lines.features[1].geometry.coordinates,
            bounds = coordinates.reduce(function (bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        self._map.fitBounds(bounds, {
            padding: 100
        });
    };

    // voor bereikbaarheid


    ContentLayer.prototype.addLegend = function addLegend() {

        var legend = document.createElement('div');
        legend.classList.add('legend');
        self.hostContainer.appendChild(legend);
    };

    ContentLayer.prototype.navigate = function navigate(url) {

        window.location.href = url;
    };

    return ContentLayer;
}();

var IconGenerator = function () {
    function IconGenerator() {
        _classCallCheck(this, IconGenerator);
    }

    IconGenerator.prototype.blogIcon = function blogIcon(item) {

        return L.divIcon({

            iconSize: (45, 63),
            className: 'blog yellow ' + item.properties.slug,
            iconAnchor: (0, 0),
            popupAnchor: (0, 0),
            html: "\n\n               \n                        <svg width=\"53px\" height=\"46px\" viewBox=\"0 0 53 46\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                            <defs>\n                                <linearGradient x1=\"63.6706155%\" y1=\"0%\" x2=\"77.9408035%\" y2=\"100%\" id=\"linearGradient-1\">\n                                    <stop stop-color=\"#000000\" stop-opacity=\"0\" offset=\"0%\"></stop>\n                                    <stop stop-color=\"#000000\" stop-opacity=\"0.5\" offset=\"100%\"></stop>\n                                </linearGradient>\n                                <filter x=\"-6.2%\" y=\"-17.6%\" width=\"112.5%\" height=\"135.1%\" filterUnits=\"objectBoundingBox\" id=\"filter-2\">\n                                    <feGaussianBlur stdDeviation=\"1.2\" in=\"SourceGraphic\"></feGaussianBlur>\n                                </filter>\n                            </defs>\n                             <polygon class=\"shadow\" fill=\"url(#linearGradient-1)\" filter=\"url(#filter-2)\" transform=\"translate(34.041211, 33.569908) scale(-1, 1) translate(-34.041211, -33.569908) \" points=\"5.18789062 30.0335664 37.2 23.3226562 62.8945312 34.3583711 48.9246094 37.7324922 57.4957031 43.8171602 38.7899414 40.0384492 30.8824219 41.3670625\"></polygon>\n                             <polygon class=\"marker\" fill=\"#78C6C2\" transform=\"translate(14.687695, 22.335937) scale(-1, 1) translate(-14.687695, -22.335937) \" points=\"0 6.14137893 29.3753906 0 29.3753906 30.8630859 18.0421875 33.6676758 18.0421875 44.671875 7.90751953 35.9736328 0 37.2914063\"></polygon>\n                              <g class=\"excavator\" transform=\"translate(25, 11) scale(-.7, .7)\" fill-rule=\"nonzero\" fill=\"#000000\">\n                                    <path d=\"M12.0000143,6.00000715 L6.00000715,6.00000715 L6.00000715,12.0000143 L12.0000143,12.0000143 L12.0000143,6.00000715 Z M14.0000167,16.0000191 L14.0000167,18.0000215 L4.00000477,18.0000215 L4.00000477,16.0000191 L14.0000167,16.0000191 Z M14.0000167,4.00000477 L14.0000167,14.0000167 L4.00000477,14.0000167 L4.00000477,4.00000477 L14.0000167,4.00000477 Z M24.0000286,16.0000191 L24.0000286,18.0000215 L16.0000191,18.0000215 L16.0000191,16.0000191 L24.0000286,16.0000191 Z M24.0000286,12.0000143 L24.0000286,14.0000167 L16.0000191,14.0000167 L16.0000191,12.0000143 L24.0000286,12.0000143 Z M24.0000286,8.00000954 L24.0000286,10.0000119 L16.0000191,10.0000119 L16.0000191,8.00000954 L24.0000286,8.00000954 Z M24.0000286,4.00000477 L24.0000286,6.00000715 L16.0000191,6.00000715 L16.0000191,4.00000477 L24.0000286,4.00000477 Z M26.000031,19.0000226 L26.000031,2.00000238 L2.00000238,2.00000238 L2.00000238,19.0000226 C2.00000238,19.3437731 1.93750231,19.6875235 1.82812718,20.0000238 L25.0000298,20.0000238 C25.5469055,20.0000238 26.000031,19.5468983 26.000031,19.0000226 Z M28.0000334,0 L28.0000334,19.0000226 C28.0000334,20.6562746 26.6562818,22.0000262 25.0000298,22.0000262 L6.34677063e-12,22.0000262 C6.3468722e-12,19.1413023 5.29235914e-12,12.4746277 3.18323146e-12,2.00000238 L3.18323146e-12,0 L28.0000334,0 Z\" fill=\"#000000\"></path>\n                              </g>\n                        </svg>\n                   \n                     "
        });
    };

    IconGenerator.prototype.projectIcon = function projectIcon(item) {

        return L.divIcon({

            iconSize: (45, 63),
            className: 'project ' + item.properties.slug,
            iconAnchor: (0, 0),
            popupAnchor: (0, 0),
            html: "\n                       \n                       \n                            <svg width=\"63px\" height=\"45px\" viewBox=\"0 0 63 45\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                <defs>\n                                    <linearGradient x1=\"51.724294%\" y1=\"0%\" x2=\"53.5242129%\" y2=\"100%\" id=\"linearGradient-1\">\n                                        <stop stop-color=\"#000000\" stop-opacity=\"0\" offset=\"0%\"></stop>\n                                        <stop stop-color=\"#000000\" stop-opacity=\"0.5\" offset=\"100%\"></stop>\n                                    </linearGradient>\n                                    <polygon id=\"path-2\" points=\"18.5575702 11.1869203 18.5575702 0.0403432594 0.0222639772 0.0403432594 0.0222639772 11.1869203\"></polygon>\n                                </defs>\n                                <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n                                    <g id=\"projectIcon\" transform=\"translate(0.000000, -11.000000)\">\n                                        <polygon class=\"shadow\"  fill=\"url(#linearGradient-1)\" fill-rule=\"nonzero\" transform=\"translate(34.041211, 44.569908) scale(-1, 1) translate(-34.041211, -44.569908) \" points=\"5.1878908 41.0335664 37.2000002 34.3226562 62.8945314 45.3583711 48.9246096 48.7324922 57.4957033 54.8171602 38.7899416 51.0384492 30.8824221 52.3670625\"></polygon>\n                                        <polygon class=\"marker\" fill=\"#78C6C2\" fill-rule=\"nonzero\" transform=\"translate(14.687695, 33.335938) scale(-1, 1) translate(-14.687695, -33.335938) \" points=\"-6e-07 17.1413789 29.37539 11 29.37539 41.8630859 18.0421869 44.6676758 18.0421869 55.671875 7.90751893 46.9736328 -6e-07 48.2914063\"></polygon>\n                                        <g id=\"Group\" transform=\"translate(3.400000, 24.000000)\">\n                                            <g id=\"Group-3\" transform=\"translate(2.685047, 1.525853)\">\n                                                <g id=\"Fill-1-Clipped\">\n                                                    <mask id=\"mask-3\" fill=\"white\">\n                                                        <use xlink:href=\"#path-2\"></use>\n                                                    </mask>\n                                                    <g id=\"path-1\"></g>\n                                                    <path d=\"M5.70283856,8.65433574 C5.70146864,7.8963936 5.10862107,7.2285561 4.29291454,7.22750388 C3.49479781,7.22656242 2.88463442,7.87147224 2.88008627,8.65234206 C2.87542854,9.44384496 3.5178125,10.0878134 4.3112167,10.0788416 C5.09596299,10.0699807 5.69982473,9.4224126 5.70283856,8.65433574 L5.70283856,8.65433574 Z M12.0008645,8.65477884 C12.0047003,9.4518198 12.6395771,10.0896409 13.4331457,10.0791739 C14.1959184,10.0690393 14.8224661,9.44550642 14.8213702,8.65206516 C14.820329,7.8597315 14.1948773,7.22063664 13.399336,7.22739312 C12.5822596,7.23431574 11.9967548,7.91317404 12.0008645,8.65477884 L12.0008645,8.65477884 Z M12.2711776,0.979493178 C12.1349525,1.66676937 11.9986178,2.35000276 11.8642011,3.03362382 C11.7300583,3.71591573 11.5904906,4.39715542 11.4601288,5.08398856 L17.2874495,5.08398856 C17.2874495,4.93113745 17.284874,4.78559661 17.2887646,4.64016653 C17.2902441,4.58351193 17.271668,4.54280702 17.2358856,4.50104987 C16.8460605,4.04676086 16.4578793,3.59103194 16.0693694,3.1356907 C15.4764122,2.44077196 14.8830715,1.74618549 14.2916486,1.04993761 C14.2451808,0.995165958 14.1972883,0.972792096 14.1247373,0.973179762 C13.5434518,0.97611495 12.9621664,0.974564286 12.380881,0.974785806 C12.3470713,0.974785806 12.3133712,0.977610234 12.2711776,0.979493178 L12.2711776,0.979493178 Z M10.3439709,6.05132562 C10.7232202,4.04504405 11.1007708,2.04767877 11.4799653,0.0414525568 C11.5653388,0.0414525568 11.6437532,0.0413971759 11.7221675,0.0414525568 C12.6510296,0.0416186993 13.5800014,0.042726316 14.5088635,0.04034494 C14.584538,0.0401234167 14.6347319,0.0617773242 14.6848711,0.119539537 C15.4673707,1.02130571 16.2521718,1.92113356 17.0363701,2.82145983 C17.4046052,3.24418176 17.7716348,3.66801131 18.142281,4.08857339 C18.1939544,4.14716632 18.217024,4.20409781 18.2168596,4.28268322 C18.2146129,5.35009348 18.2153252,6.41755914 18.2152705,7.48508016 L18.2152705,7.67924538 L18.5530385,7.67924538 C18.561258,7.96080156 18.5557783,8.23299834 18.5562715,8.51604984 L15.9236096,8.51604984 C16.0061338,9.92216928 14.8903046,11.1509039 13.486463,11.1854062 C12.7579384,11.2032942 12.1306784,10.9489854 11.6209029,10.4238643 C11.1111274,9.89879856 10.8805421,9.25782072 10.9052555,8.51854194 L6.79987236,8.51854194 C6.81943482,9.35518026 6.52923048,10.0538649 5.89999778,10.5938281 C5.40167485,11.0215343 4.81633445,11.2174163 4.16414184,11.1830802 C3.47666004,11.1469165 2.89570339,10.8660249 2.43283405,10.3503739 C1.96958112,9.83433528 1.76442156,9.2195526 1.78376486,8.51532984 L0.0222639772,8.51532984 L0.0222639772,7.68666642 L0.354442735,7.68666642 C0.359922425,7.14116514 0.354168751,6.6043587 0.357730549,6.05271018 C1.0251019,6.04933194 1.68732233,6.05176872 2.34954277,6.051381 C3.01696891,6.05099334 3.68444985,6.05077182 4.351876,6.05077182 C5.01590473,6.05077182 5.67993346,6.05121486 6.34396218,6.05132562 C7.01144316,6.05143638 7.6788693,6.05132562 8.34629544,6.05132562 L10.3439709,6.05132562 Z\" id=\"Fill-1\" fill=\"#151616\" fill-rule=\"nonzero\" mask=\"url(#mask-3)\"></path>\n                                                </g>\n                                            </g>\n                                            <g id=\"Group-6\" transform=\"translate(0.000000, 0.030570)\" fill-rule=\"nonzero\" fill=\"#151616\">\n                                                <path d=\"M4.18350706,3.36649588 C4.16093075,3.5779953 4.17106817,6.15337038 4.19375408,6.2260854 L4.81317815,6.2260854 L4.81317815,3.36649588 L4.18350706,3.36649588 Z M6.6664638,6.22614078 C6.68969772,6.11338542 6.68542356,3.18473597 6.66306642,3.11058103 C6.48645606,3.09308069 6.10994658,3.09989253 6.04051896,3.12176796 C6.01898376,3.39761991 6.02977872,6.14639238 6.05323182,6.22614078 L6.6664638,6.22614078 Z M7.89977748,6.22575312 L8.53580502,6.22575312 L8.53580502,2.85189714 L7.89977748,2.85189714 L7.89977748,6.22575312 Z M9.75974838,2.59487467 L9.75974838,6.22519932 L10.3875563,6.22519932 C10.4106806,6.1038045 10.4050366,2.67357084 10.3816383,2.59487467 L9.75974838,2.59487467 Z M-1.64390675e-05,4.09802136 C0.212650298,3.76202582 0.420220924,3.43433741 0.627517566,3.10642747 C0.842266584,2.76666603 1.05745398,2.42712611 1.27061389,2.08642321 C1.30590309,2.02993475 1.34426091,2.00169052 1.41604484,1.9936603 C1.96921946,1.931523 2.52151733,1.86118934 3.07430838,1.7953969 C3.56906951,1.73641631 4.06426903,1.68086933 4.55908496,1.62216565 C4.99581619,1.5702738 5.43227343,1.51522525 5.86900466,1.46311188 C6.1931283,1.42445606 6.51769026,1.38923384 6.84181386,1.35068878 C7.21711782,1.30599644 7.59220254,1.25864583 7.96756122,1.21373197 C8.23025754,1.18227565 8.4932826,1.15358838 8.7560337,1.12229821 C9.0187848,1.09095265 9.28115232,1.05705958 9.54384864,1.02571403 C9.80659974,0.994479234 10.0696796,0.965625816 10.3324307,0.934612548 C10.5951818,0.90348852 10.8577137,0.870592302 11.1204648,0.839246748 C11.325186,0.814879176 11.5299071,0.79056699 11.7349024,0.768359274 C11.8335367,0.757670772 11.8343039,0.759996768 11.8620311,0.666070872 C11.9161705,0.483147963 11.9695974,0.299948153 12.0236819,0.116969867 C12.0323947,0.0873411186 12.0432992,0.0583215598 12.0545874,0.0248161532 L15.4000472,0.0248161532 C15.4069517,0.325589481 15.4019104,0.622320006 15.4027323,0.929129844 L13.6735068,0.929129844 C13.2557353,2.9930629 12.8394981,5.04946415 12.421617,7.11406176 L12.1788119,7.11406176 C9.10963806,7.11384024 6.04046412,7.11323106 2.97129022,7.11550164 C2.8940814,7.11555702 2.84421623,7.08991572 2.7935839,7.03675014 C1.88028411,6.07688946 0.965669184,5.11835791 0.0515474362,4.15932795 C0.0351083686,4.14210451 0.020751583,4.12288736 -1.64390675e-05,4.09802136 L-1.64390675e-05,4.09802136 Z\" id=\"Fill-4\"></path>\n                                            </g>\n                                        </g>\n                                        <rect id=\"Rectangle\" x=\"0\" y=\"1.77635684e-15\" width=\"62\" height=\"62\"></rect>\n                                    </g>\n                                </g>\n                            </svg>\n                    \n                     "
        });
    };

    return IconGenerator;
}();

var InteractionFilters = function () {
    function InteractionFilters(map, config, contentLayer, interactionPopup) {
        _classCallCheck(this, InteractionFilters);

        this._map = map;
        this._config = config;
        this._contentLayer = contentLayer;
        this._interactionPopup = interactionPopup;
        this.filters = document.getElementById("filter-container");
        this.filterArrayForJs = ['blog', 'project', 'poi'];
        if (this.filters) {
            this.blogFilter = this.filters.querySelector("#blog");
            this.projectFilter = this.filters.querySelector("#project");
            this.poiFilter = this.filters.querySelector("#poi");
        }
    }

    InteractionFilters.prototype.init = function init() {

        var self = this;

        if (self.filters) {
            self.blogFilter.addEventListener("click", function (e) {
                self.filterLayer(self._map, 'icons', 'blog');
            }, false);
            self.projectFilter.addEventListener("click", function (e) {
                self.filterLayer(self._map, 'icons', 'project');
            }, false);

            if (self.poiFilter) {
                self.poiFilter.addEventListener("click", function (e) {
                    self.filterLayer(self._map, 'poi');
                }, false);
            }
        }
    };

    InteractionFilters.prototype.filterLayer = function filterLayer(map, layer, filter) {

        var self = this;

        if (webgl_detect()) {
            self._GL_filterLayer(map, layer, filter);
        } else {
            self._JS_filterLayer(map, layer, filter);
        }
    };

    InteractionFilters.prototype._GL_filterLayer = function _GL_filterLayer(map, layer, filter) {

        var self = this;

        var currentFilter = map.getFilter(layer),
            newFilter = ['any'],
            exists = void 0;

        if (layer === 'icons' || layer === 'icons-active') {

            // check if filter is in array
            exists = currentFilter.filter(function (i) {
                return i[2] === filter;
            });

            if (exists.length > 0) {
                // remove
                currentFilter.forEach(function (f) {
                    if (Array.isArray(f)) {
                        if (f[2] !== filter) {
                            newFilter.push(f);
                        }
                    }
                });

                self.filters.querySelector("#" + filter).classList.add('inactive');
            } else {
                // add
                newFilter = currentFilter;
                newFilter.push(['==', 'type', filter]);

                self.filters.querySelector("#" + filter).classList.remove('inactive');
            }
            self._map.setFilter(layer, newFilter);

            self._map.setFilter('icons-active', ['==', 'type', '']);
            self._interactionPopup.emptyArray();
        }

        if (layer === 'poi') {

            if (self._map.getFilter(layer)[0] === 'has') {
                self._map.setFilter(layer, ['!has', 'name']);
                self.filters.querySelector("#poi").classList.add('inactive');
            } else {
                self._map.setFilter(layer, ['has', 'name']);
                self.filters.querySelector("#poi").classList.remove('inactive');
            }
        }
    };

    InteractionFilters.prototype._JS_filterLayer = function _JS_filterLayer(map, layer, filter) {

        if (layer === 'poi') {
            filter = 'poi';
        }

        var self = this,
            filteredContent = void 0;

        //remove popups
        self._map.closePopup();

        // remove all icons
        self._map.eachLayer(function (l) {
            if (l._icon) {
                l.remove();
            }
        });

        // adapt array with filters
        var inOptionArray = false;

        var index;
        self.filterArrayForJs.forEach(function (filterOption) {
            if (filterOption === filter) {
                inOptionArray = true;
            }
        });

        // adapt array
        if (inOptionArray) {
            index = self.filterArrayForJs.indexOf(filter);
            self.filterArrayForJs.splice(index, 1);
            self.filters.querySelector("#" + filter).classList.add('inactive');
        } else {
            self.filterArrayForJs.push(filter);
            console.log(filter);
            self.filters.querySelector("#" + filter).classList.remove('inactive');
        }

        // check if poi is still in array
        var hasPoi = false;
        self.filterArrayForJs.forEach(function (filterOption) {
            if (filterOption === 'poi') {
                hasPoi = true;
            }
        });

        if (hasPoi) {
            self._poi = new PoiLayer(self._map, self._config);
            self._poi.draw();
        }

        // new features for icon layer
        filteredContent = self._config.dataset.content.features.filter(function (feature) {
            var inFiltersArray = false;
            self.filterArrayForJs.forEach(function (filterOption) {
                if (feature.properties.type === filterOption) {
                    inFiltersArray = true;
                }
            });

            if (inFiltersArray) {
                return feature;
            };
        });

        // if features redraw icon layer
        if (filteredContent.length > 0) {

            var filteredFeatureCollection = {
                type: "FeatureCollection",
                features: filteredContent
            };
        }

        // this._contentLayer = new ContentLayer(self._map, self._config);
        this._contentLayer.draw(filteredFeatureCollection);
    };

    return InteractionFilters;
}();

var InteractionPage = function () {
    function InteractionPage(map, config, popup) {
        _classCallCheck(this, InteractionPage);

        this._map = map;
        this._config = config;
        this.interactionPopup = popup;

        this._hostContainer = document.getElementById('kaart');
        this._explanationContainer = document.getElementById('kaart-explanation');

        this._allLocations = document.getElementById('all_locations');
        this._relevantLocations = document.getElementById('relevant_locations');
        this._selectedLocations = document.getElementById('selected_locations');

        this._tabAlles = document.getElementById('tab_alles');
        this._tabActueel = document.getElementById('tab_actueel');
        this._tabSelection = document.getElementById('tab_selectie');
    }

    InteractionPage.prototype.init = function init() {

        var self = this;

        var hideButtons = [].slice.call(document.getElementsByClassName('hide-explanation'));

        if (hideButtons) {
            hideButtons.forEach(function (b) {
                b.addEventListener("click", function () {
                    self.hideExplanation();
                }, false);
            });
        }

        var showButtons = [].slice.call(document.getElementsByClassName('show-explanation'));

        if (showButtons) {
            showButtons.forEach(function (b) {
                b.addEventListener("click", function () {
                    self.showExplanation();
                }, false);
            });
        }

        self._map.on('click', 'labels', function (e) {
            self._showLocationInfo(e.features[0].properties.slug);
        });

        this._tabAlles.addEventListener("click", function () {
            self._switchInfo('alles');
        }, false);

        this._tabActueel.addEventListener("click", function () {
            self._switchInfo('actueel');
        }, false);

        this._tabSelection.addEventListener("click", function () {
            self._switchInfo('selectie');
        }, false);
    };

    InteractionPage.prototype._showLocationInfo = function _showLocationInfo(slug) {

        var self = this;
        this._selectedLocations.innerHTML = '';
        self._switchInfo('selectie');
        var locationElement = [].slice.call(document.querySelectorAll('.location.' + slug))[0];
        var div = document.createElement("div");
        div.classList.add("location");
        div.classList.add(slug);
        div.innerHTML = locationElement.innerHTML;
        this._selectedLocations.appendChild(div);
    };

    InteractionPage.prototype.showExplanation = function showExplanation() {

        this._explanationContainer.style.display = 'block';
        localStorage.setItem('map-explanation', true);
    };

    InteractionPage.prototype.hideExplanation = function hideExplanation() {

        this._explanationContainer.style.display = 'none';
        localStorage.setItem('map-explanation', false);
    };

    InteractionPage.prototype._switchInfo = function _switchInfo(keuze) {

        this._keuze = keuze;

        if (this._keuze === 'alles') {

            this._allLocations.style.display = 'block';
            this._relevantLocations.style.display = 'none';
            this._selectedLocations.style.display = 'none';

            this._tabAlles.classList.add('active');
            this._tabActueel.classList.remove('active');
            this._tabSelection.classList.remove('active');
        } else if (this._keuze === 'actueel') {

            this._allLocations.style.display = 'none';
            this._selectedLocations.style.display = 'none';
            this._relevantLocations.style.display = 'block';

            this._tabAlles.classList.remove('active');
            this._tabActueel.classList.add('active');
            this._tabSelection.classList.remove('active');
        } else if (this._keuze === 'selectie') {

            this._allLocations.style.display = 'none';
            this._selectedLocations.style.display = 'block';
            this._relevantLocations.style.display = 'none';

            this._tabAlles.classList.remove('active');
            this._tabActueel.classList.remove('active');
            this._tabSelection.classList.add('active');
        }
    };

    return InteractionPage;
}();

var Interaction3D = function () {
    function Interaction3D(map, config) {
        _classCallCheck(this, Interaction3D);

        this._map = map;
        this._config = config;
        this.button_2d = null;
        this.button_3d = null;
        // this.button_three_d = document.getElementById("three-d-button");
        // this.button_two_d = document.getElementById("two-d-button");
        // this.dimensionSelector = document.getElementById("dimension-selector");
    }

    Interaction3D.prototype.init = function init(open) {

        var self = this,
            buildings = {},
            xhr = new XMLHttpRequest();
        // enable dimension toggle buttons
        self._createButtons();

        xhr.open('GET', 'https://api.mapbox.com/datasets/v1/wijnemenjemee/cj056h8w200c033o0mcnvk5nt/features?access_token=pk.eyJ1Ijoid2lqbmVtZW5qZW1lZSIsImEiOiJjaWgwZjB4ZGwwMGdza3FseW02MWNxcmttIn0.l-4VI25pfA5GKukRQTXnWA');
        xhr.send();

        xhr.onreadystatechange = function () {
            var DONE = 4;var OK = 200;
            if (xhr.readyState === DONE) {
                if (xhr.status === OK) {

                    var threeDStructures = JSON.parse(xhr.response);
                    buildings.type = "FeatureCollection";
                    buildings.features = threeDStructures.features;
                    // self.mergeContent(customfeatures);
                    self._drawEssentials(buildings);

                    if (open) {
                        self.shiftPitch(self._map, 75);
                    }
                } else {
                    console.log('kan features niet ophalen bij mapboxxx'); // dan weer eruit halen // An error occurred during the request.
                }
            }
        };
    };

    Interaction3D.prototype.shiftPitch = function shiftPitch(map, pitch) {

        var self = this;

        self.button_3d.classList.remove('visible');
        self.button_2d.classList.add('visible');

        var center = map.getCenter();
        var zoom = map.getZoom() + .5;
        var bearing = map.getBearing();

        self._show();

        map.flyTo({
            center: center,
            zoom: zoom,
            pitch: pitch || 75,
            bearing: bearing,
            speed: 0.2, // make the flying slow
            curve: .75, // change the speed at which it zooms out
            easing: function easing(t) {
                return t;
            }
        });
    };

    Interaction3D.prototype.resetPitch = function resetPitch(map) {

        var self = this;

        self.button_2d.classList.remove('visible');
        self.button_3d.classList.add('visible');

        var center = map.getCenter();
        var zoom = map.getZoom() - .5;
        var bearing = map.getBearing();

        self._hide(2000);

        map.flyTo({
            center: center,
            zoom: zoom,
            pitch: 0,
            bearing: bearing,
            speed: 0.2, // make the flying slow
            curve: .75, // change the speed at which it zooms out
            easing: function easing(t) {
                return t;
            }
        });
    };

    Interaction3D.prototype._createButtons = function _createButtons() {

        var self = this;

        self.dimensionSelector = document.createElement('div');
        self.dimensionSelector.id = 'dimension-selector';

        self.button_2d = document.createElement('div');
        self.button_2d.id = 'two-d-button';
        self.button_2d.innerHTML = '2D';
        self.dimensionSelector.appendChild(self.button_2d);

        self.button_3d = document.createElement('div');
        self.button_3d.id = 'three-d-button';
        self.button_3d.innerHTML = '3D';
        self.dimensionSelector.appendChild(self.button_3d);

        self.button_3d.classList.add('visible');
        self.button_3d.addEventListener("click", function () {
            self.shiftPitch(self._map);
        }, false);
        self.button_2d.addEventListener("click", function () {
            self.resetPitch(self._map);
        }, false);

        document.getElementById(self._config.hostContainer).appendChild(self.dimensionSelector);
    };

    Interaction3D.prototype._drawEssentials = function _drawEssentials(data) {

        var self = this;

        // if (self._map.getSource("buildings") === undefined) {

        self._map.addSource("buildings", {
            "type": "geojson",
            "data": data
        });
        // }

        self._map.addLayer({
            "id": "buildings",
            "source": "buildings",
            "filter": ["all", ["!has", 'class'], ["has", 'base'], ["has", 'height']], //  ,["has",'colour']
            "type": "fill-extrusion",
            "paint": {

                "fill-extrusion-base": {
                    "type": "identity",
                    "property": "base"
                },
                "fill-extrusion-color": "rgb(216,216,216)",
                // "fill-extrusion-color": {
                //     "type": "identity",
                //     "property": "colour"  // colour
                // },
                "fill-extrusion-height": {
                    "type": "identity",
                    "property": "height"
                },
                "fill-extrusion-opacity": .5
            }

        }, 'poi');

        self._hide(0);
    };

    Interaction3D.prototype._show = function _show() {
        var self = this;
        setTimeout(function () {
            self._map.setPaintProperty('buildings', 'fill-extrusion-opacity', 1);
        }, 0);
    };

    Interaction3D.prototype._hide = function _hide(time) {

        var self = this;
        setTimeout(function () {
            self._map.setPaintProperty('buildings', 'fill-extrusion-opacity', 0);
        }, time);
    };

    return Interaction3D;
}();

var InteractionPopup = function () {
    function InteractionPopup() {
        _classCallCheck(this, InteractionPopup);

        // this._map = map;
        // this._config = config;
        this.popup = null;
        this.popups = [];
    }

    InteractionPopup.prototype.createPopup = function createPopup(item) {

        var url = void 0;

        if (item.properties.slug === 'zuidasdok') {
            url = 'zuidasdok';
        } else {
            url = item.properties.url;
        }

        if (item.properties.third_line) {
            return "<a href=\"" + url + "\">\n                        <span class=\"multiline\">\n                            " + item.properties.first_line + "\n                        </span><br/>\n                        <span class=\"multiline\">\n                            " + item.properties.second_line + "\n                        </span><br/>\n                        <span class=\"multiline\">\n                            " + item.properties.third_line + "\n                        </span>\n                    </a>\n                         ";
        } else if (item.properties.second_line) {
            return "<a href=\"" + url + "\">\n                        <span class=\"multiline\">\n                            " + item.properties.first_line + "\n                        </span><br/>\n                        <span class=\"multiline\">\n                            " + item.properties.second_line + "\n                        </span>\n                     </a>\n                         ";
        } else {

            return "<a href=\"" + url + "\">\n                        <span class=\"multiline\">\n                            " + item.properties.title + "\n                        </span>\n                   </a>";
        }
    };

    InteractionPopup.prototype.openPopup = function openPopup(map, html, lngLat, type, offset, closeOthers) {

        var self = this;
        if (closeOthers && self.popup) {
            self.popup.remove();
        }
        self.popup = new mapboxgl.Popup({ offset: offset, anchor: 'top-left', closeButton: false }).setLngLat(lngLat).setHTML(html).addTo(map);
        self.popup._container.classList.add(type);

        self.popups.push(self.popup);
    };

    InteractionPopup.prototype.closePopup = function closePopup() {

        var self = this;
        if (self.popup) {
            self.popup.remove();
        }
    };

    // closeAllPopups(map) {
    //
    //
    //     // loop door lagen
    //     // verzamel iconen
    //     // verzamel open popups
    //
    //     let popup,
    //         activeIcons = map.queryRenderedFeatures({ layers: ['icons-active'] });
    //
    //     activeIcons.forEach( function(icon) {
    //
    //      //   popup = icon.getPopup();
    //         console.log(icon);
    //     })
    //
    // }


    InteractionPopup.prototype.addToArray = function addToArray(popup) {

        var self = this;
        self.popups.push(self.popup);
    };

    InteractionPopup.prototype.emptyArray = function emptyArray(map) {

        var self = this;

        if (webgl_detect() && !isIE11()) {

            self.popups.forEach(function (popup) {

                popup.remove();
            });
        } else {

            map.closePopup();
        }
    };

    return InteractionPopup;
}();

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

    Lines.prototype.draw = function draw() {
        var _layout;

        var self = this;

        self._map.addLayer({
            "id": "bus-old",
            "type": "line",
            "source": "originData",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": {
                    property: 'routeVersion',
                    type: 'categorical',
                    stops: [['prio', black], ['alt', '#999']]
                },
                "line-width": 4,
                "line-dasharray": [1, 0]
                // "line-translate": [-4,-4]
            },
            "filter": ['all', ["==", "trajectId", ""], ["==", "isNieuw", false], ["==", "transport_type", "bus"]]
        }, 'origins');

        self._map.addLayer({
            "id": "bus-old-icon",
            "type": "symbol",
            "source": "originData",
            "layout": {
                "visibility": "visible",
                "icon-image": "bus-15",
                "icon-padding": 0,
                // "icon-text-fit": 'both',
                "icon-size": 1,
                "icon-offset": [20, 0],
                // "icon-text-fit-padding": [5,10,2,10],
                "icon-allow-overlap": true,
                "text-field": "{transport_nrs}",
                "symbol-placement": "line",
                "icon-rotation-alignment": "viewport",
                "text-rotation-alignment": "viewport",
                "text-size": 15,
                "text-anchor": "left",
                "text-offset": [2, 0.1],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform": "uppercase",
                "text-allow-overlap": true
            },
            "paint": {
                'text-color': "#000"
            },
            "filter": ['all', ["==", "trajectId", ""], ["==", "isNieuw", false], ["==", "transport_type", "bus"]]
        }, 'origins');

        self._map.addLayer({
            "id": "bus-new",
            "type": "line",
            "source": "originData",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": {
                    property: 'routeVersion',
                    type: 'categorical',
                    stops: [['prio', yellow], ['alt', pink]]
                },
                "line-width": 4,

                "line-dasharray": [1, 1]
            },
            "filter": ['all', ["==", "trajectId", ""], ["==", "isNieuw", true], ["==", "transport_type", "bus"]]
        }, 'origins');

        self._map.addLayer({
            "id": "metro-old",
            "type": "line",
            "source": "originData",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": black,
                "line-width": 4,
                "line-dasharray": [.25, .25]
            },
            "filter": ['all', ["==", "trajectId", ""], ["==", "isNieuw", false], ["==", "transport_type", "metro"]]
        }, 'origins');

        self._map.addLayer({
            "id": "metro-old-icon",
            "type": "symbol",
            "source": "originData",
            "layout": {
                "visibility": "visible",
                "icon-image": "rail-15",
                "icon-padding": 0,
                "icon-size": 1,
                "icon-offset": [20, 0],
                "icon-allow-overlap": true,
                "text-field": "{transport_nrs}",
                "symbol-placement": "line",
                "icon-rotation-alignment": "viewport",
                "text-rotation-alignment": "viewport",
                "text-size": 15,
                "text-anchor": "left",
                "text-offset": [2, 0.1],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform": "uppercase",
                "text-allow-overlap": true
            },
            "paint": {
                'text-color': "#000"
            },
            "filter": ['all', ["==", "trajectId", ""], ["==", "isNieuw", false], ["==", "transport_type", "metro"]]
        }, 'origins');

        self._map.addLayer({
            "id": "metro-new",
            "type": "line",
            "source": "originData",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": pink,
                "line-width": 4
                // "line-dasharray": [.25,.25]
            },
            "filter": ['all', ["==", "trajectId", ""], ["==", "isNieuw", true], ["==", "transport_type", "metro"]]
        }, 'origins');

        self._map.addLayer({
            "id": "tram-old",
            "type": "line",
            "source": "originData",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": black,
                "line-width": 4
            },
            "filter": ['all', ["==", "trajectId", ""], ["==", "isNieuw", false], ["==", "transport_type", "tram"]]
        }, 'origins');

        self._map.addLayer({
            "id": "tram-old-icon",
            "type": "symbol",
            "source": "originData",
            "layout": {
                "visibility": "visible",
                "icon-image": "rail-light-15",
                "icon-padding": 0,
                "icon-size": 1,
                "icon-offset": [20, 0],
                "icon-allow-overlap": true,
                "text-field": "{transport_nrs}",
                "symbol-placement": "line",
                "icon-rotation-alignment": "viewport",
                "text-rotation-alignment": "viewport",
                "text-size": 15,
                "text-anchor": "left",
                "text-offset": [2, 0.1],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform": "uppercase",
                "text-allow-overlap": true
            },
            "paint": {
                'text-color': "#000"
            },
            "filter": ['all', ["==", "trajectId", ""], ["==", "isNieuw", false], ["==", "transport_type", "tram"]]
        }, 'origins');

        self._map.addLayer({
            "id": "tram-new",
            "type": "line",
            "source": "originData",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": yellow,
                "line-width": 4
            },
            "filter": ['all', ["==", "trajectId", ""], ["==", "isNieuw", true], ["==", "transport_type", "tram"]]
        }, 'origins');

        self._map.addLayer({
            "id": "train-old",
            "type": "line",
            "source": "originData",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": black,
                "line-width": 4
                // "line-dasharray": [2,2]
            },
            "filter": ['all', ["==", "trajectId", ""], ["==", "isNieuw", false], ["==", "transport_type", "trein"]]
        }, 'origins');

        self._map.addLayer({
            "id": "train-new",
            "type": "line",
            "source": "originData",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": pink,
                "line-width": 4,
                "line-dasharray": [2, 2]
            },
            "filter": ['all', ["==", "trajectId", ""], ["==", "isNieuw", true], ["==", "transport_type", "trein"]]
        }, 'origins');

        self._map.addLayer({
            "id": "caption",
            "type": "symbol",
            "source": "originData",
            "layout": (_layout = {
                "visibility": "visible",
                "icon-image": "rect_purple",
                "icon-padding": 0,
                "icon-text-fit": 'both',
                "icon-text-fit-padding": [10, 5, 0, 5],
                "icon-allow-overlap": true
            }, _defineProperty(_layout, "icon-padding", 20), _defineProperty(_layout, "icon-anchor", "right"), _layout),
            'paint': {
                "text-color": "#fff"
            },
            'filter': ['all', ['has', 'trajectNaam'], ["==", "trajectId", ""]]
        }, 'origins');
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

var ListReference = function () {
    function ListReference(popup) {
        _classCallCheck(this, ListReference);

        this.interactionPopup = popup;
    }

    ListReference.prototype.generateHTML = function generateHTML(features) {

        var self = this,
            ul = void 0,
            li = void 0;

        ul = document.createElement('ul');

        self.features = features;

        self.features.forEach(function (feature) {
            li = document.createElement('li');
            if (feature.properties.slug === 'zuidasdok') {
                li.innerHTML = "\n                        <span class=\"evensmallerfont\" data-slug=\"zuidasdok\">" + feature.properties.title + "</span>\n                ";
            } else {
                li.innerHTML = " \n                        <span class=\"evensmallerfont\" data-slug=\"" + feature.properties.slug + "\">" + feature.properties.title + "</span>\n                ";
            }
            ul.appendChild(li);
        });
        return ul;
    };

    ListReference.prototype.generateTabs = function generateTabs() {

        var self = this,
            ul = void 0,
            tab_map = void 0,
            tab_list = void 0;

        ul = document.createElement('ul');

        tab_map = document.createElement('li');
        tab_map.innerHTML = 'Kaart';
        tab_map.id = "tab_map";
        tab_map.classList.add('active');
        ul.appendChild(tab_map);

        tab_list = document.createElement('li');
        tab_list.innerHTML = 'Lijst';
        tab_list.id = "tab_list";
        ul.appendChild(tab_list);

        return ul;
    };

    ListReference.prototype.addEventListeners = function addEventListeners(map, container) {

        var self = this,
            slug = void 0,
            linkList = [].slice.call(container.querySelectorAll('ul>li>span'));

        linkList.forEach(function (link) {
            link.addEventListener('click', function (event) {

                if (event && event.target.attributes['data-slug']) {

                    self.focus(map, event.target.attributes['data-slug'].nodeValue);
                }
            }, false);
        });

        // self.interactionPopup = new InteractionPopup(map,'');
    };

    ListReference.prototype.addEventListenersMobile = function addEventListenersMobile() {

        var projects_map = void 0,
            map_list_container = void 0;

        projects_map = document.getElementById('projects-map');
        map_list_container = document.getElementById('map-list-container');

        setTimeout(function () {
            var tm = document.getElementById('tab_map');
            var tl = document.getElementById('tab_list');
            if (tm) {
                tm.addEventListener('click', function (event) {
                    if (projects_map) {
                        projects_map.style.visibility = 'visible';projects_map.style.height = '100%';
                    }
                    if (map_list_container) {
                        map_list_container.style.visibility = 'hidden';
                    }
                    tm.classList.add('active');
                    tl.classList.remove('active');
                });
            }

            if (tl) {
                tl.addEventListener('click', function (event) {
                    if (projects_map) {
                        projects_map.style.visibility = 'hidden';projects_map.style.height = '0px';
                    }
                    if (map_list_container) {
                        map_list_container.style.visibility = 'visible';
                    }
                    tm.classList.remove('active');
                    tl.classList.add('active');
                });
            }
        }, 500);
    };

    ListReference.prototype.focus = function focus(map, slug) {
        if (webgl_detect() && !isIE11()) {
            this._GL_Focus(map, slug);
        } else {
            this._JS_Focus(map, slug);
        }
    };

    // focusOff(map,slug) {
    //     if (webgl_detect() && !isIE11()) {
    //         this._GL_UnFocus(map,slug);
    //     } else {
    //         this._JS_UnFocus(map,slug);
    //     }
    // }

    ListReference.prototype._GL_Focus = function _GL_Focus(map, slug) {

        var self = this,
            html = void 0,
            offset = void 0,
            lngLat = void 0,
            type = void 0,
            features = map.queryRenderedFeatures({ filter: ['==', 'slug', slug], layers: ['icons'] });

        if (features[0]) {

            if (window.innerWidth <= 760) {
                var projects_map = document.getElementById('projects-map');
                if (projects_map) {
                    projects_map.style.visibility = 'visible';projects_map.style.height = '100%';
                }
                var map_list_container = document.getElementById('map-list-container');
                if (map_list_container) {
                    map_list_container.style.visibility = 'hidden';
                }
                var tm = document.getElementById('tab_map');
                var tl = document.getElementById('tab_list');
                tm.classList.add('active');
                tl.classList.remove('active');
            }

            html = self.interactionPopup.createPopup(features[0]);
            offset = [-2, -14];
            lngLat = features[0].geometry.coordinates;
            type = features[0].properties.type;

            self.interactionPopup.openPopup(map, html, lngLat, type, offset, true);

            map.easeTo({

                center: [lngLat[0] + 0.001, lngLat[1] - 0.0005],
                zoom: 14,
                speed: 0.2,
                curve: 1
            });
        }
    };

    ListReference.prototype._JS_Focus = function _JS_Focus(map, slug) {

        var self = this,
            html = void 0,
            latLng = void 0,
            highlightedMarker = void 0,
            highlightedFeature = void 0;

        // all features
        // filter by slug ?
        highlightedFeature = self.features.filter(function (f) {
            return f.properties.slug === slug;
        });

        // highlightedMarker = document.querySelector('.marker.' + slug);
        // console.log(highlightedMarker);
        // highlightedMarker.style.backgroundImage = 'url("/assets/svg/highlight-icon-construction-project.svg")';

        html = self.interactionPopup.createPopup(highlightedFeature[0]);
        latLng = new L.LatLng(highlightedFeature[0].geometry.coordinates[1], highlightedFeature[0].geometry.coordinates[0]);
        console.log(latLng);
        //open popup;
        var popup = L.popup({
            className: highlightedFeature[0].properties.type,
            offset: [0, 36]
        }).setLatLng(latLng).setContent(html).openOn(map);
    };

    // _GL_UnFocus(map,slug) {
    //
    //     let self = this;
    //
    //     self.interactionPopup.closePopup();
    // }
    //
    // _JS_UnFocus(map,slug) {
    //
    //     let allMarkers = document.querySelectorAll('.marker');
    //
    //     [].forEach.call(allMarkers, function(marker) {
    //         marker.style.backgroundImage = 'url("/assets/svg/icon-construction-project.svg")';
    //     });
    // }


    return ListReference;
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

var PoiLayer = function () {
    function PoiLayer(map, config) {
        _classCallCheck(this, PoiLayer);

        this._map = map;
    }

    PoiLayer.prototype.draw = function draw() {

        var self = this;

        if (webgl_detect()) {
            var _layout2;

            self._map.addSource("poi", {
                "type": "geojson",
                "data": "./assets/geojson/poi.geojson"
            });

            self._map.addLayer({
                "id": "poi",
                "type": "symbol",
                "source": "poi",
                "layout": (_layout2 = {
                    "visibility": "visible",
                    "icon-image": "rect_purple",
                    "icon-padding": 0,
                    "icon-text-fit": 'both',
                    "icon-text-fit-padding": [10, 5, 0, 5],
                    "icon-allow-overlap": true
                }, _defineProperty(_layout2, "icon-padding", 20), _defineProperty(_layout2, "text-field", "{name}"), _defineProperty(_layout2, "text-font", ["BC Falster Grotesk Bold"]), _defineProperty(_layout2, "text-size", 20), _defineProperty(_layout2, "text-offset", [0, 0]), _defineProperty(_layout2, "text-anchor", "center"), _layout2),
                'paint': {
                    "text-color": "rgb(51,51,51)"
                },
                'filter': ['has', 'name']
            }, 'projects');
        } else {

            var markers = [];

            var poi = L.mapbox.featureLayer().loadURL('./assets/geojson/poi.geojson').on('ready', function (e) {

                e.target._geojson.features.forEach(function (feature) {

                    var label = L.divIcon({

                        iconSize: (25, 200),
                        className: 'poi label',
                        iconAnchor: (50, 50),
                        popupAnchor: (0, 0),
                        html: "\n                                <span class=\"js-label\">" + feature.properties.name + "</span>\n                            "
                    });

                    var marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], { icon: label }); // .bindPopup(item.title);
                    markers.push(marker);
                });

                this.markers = new L.featureGroup(markers);
                this.markers.addTo(self._map);
            });
        }
    };

    return PoiLayer;
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

        // self._map.addSource("points", {
        //     "type": "geojson",
        //     "data": self._config.dataset
        // });

        self._map.addLayer({
            "id": "origins",
            "type": "circle",
            "source": "origins",
            "paint": {
                "circle-color": white,
                "circle-radius": 4,
                "circle-opacity": 1,
                "circle-stroke-width": 4,
                "circle-stroke-color": purple,
                "circle-stroke-opacity": 1
            },
            "filter": ['all', ["==", "function", "herkomst"]]
        });

        self._map.addLayer({
            "id": "origin-labels",
            "type": "symbol",
            "source": "origins",
            "layout": {
                "visibility": "visible",
                "icon-image": "rect_purple",
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
                'text-color': "#fff"
            },
            "filter": ['all', ["==", "function", "herkomst"], ["==", "naam", "none"]]
        });

        self._map.addLayer({
            "id": "origin-labels-connector",
            "type": "symbol",
            "source": "origins",
            "layout": {

                "icon-image": "connector_purple",
                "icon-padding": 0,
                "icon-allow-overlap": true,
                "symbol-placement": "point",
                "icon-size": 1,
                "icon-offset": [16, 0]

            },
            "filter": ['all', ["==", "function", "herkomst"], ["==", "naam", "none"]]
        }, 'origins');
    };

    Points.prototype.drawDestinations = function drawDestinations(filter) {

        var self = this;

        self._map.addLayer({
            "id": "destinations",
            "type": "circle",
            "source": "originData",
            "paint": {
                "circle-color": pink,
                "circle-radius": 4,
                "circle-opacity": 1,
                "circle-stroke-width": 4,
                "circle-stroke-color": pink,
                "circle-stroke-opacity": 1
            },
            "filter": ['all', ["==", "function", "bestemming"], ["==", "isNieuw", true], ["==", "routeVersion", "prio"]]
        });

        self._map.addLayer({
            "id": "destination-labels",
            "type": "symbol",
            "source": "originData",
            "layout": {
                "visibility": "visible",
                "icon-image": "rect_pink",
                "icon-padding": 0,
                "icon-text-fit": 'both',
                "icon-text-fit-padding": [5, 10, 2, 10],
                "icon-allow-overlap": true,
                "text-field": "{naam}",
                "symbol-placement": "point",
                "text-size": 15,
                "text-anchor": "left",
                "text-offset": [1.6, 0],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform": "uppercase",
                "text-allow-overlap": true
            },
            "paint": {
                'text-color': "#fff"
            },
            "filter": ['all', ["==", "function", "bestemming"], ["==", "isNieuw", true], ["==", "id", "0"], ["==", "routeVersion", "prio"]]
        });

        self._map.addLayer({
            "id": "destination-labels-connector",
            "type": "symbol",
            "source": "originData",
            "layout": {

                "icon-image": "connector_pink",
                "icon-padding": 0,
                "icon-allow-overlap": true,
                "symbol-placement": "point",
                "icon-size": 1,
                "icon-offset": [16, 0]

            },
            "filter": ['all', ["==", "function", "bestemming"], ["==", "isNieuw", true], ["==", "id", "0"], ["==", "routeVersion", "prio"]]
        }, 'destination-labels');
    };

    Points.prototype.drawTransfers = function drawTransfers(filter) {

        var self = this;

        self._map.addLayer({
            "id": "transfers",
            "type": "circle",
            "source": "originData",
            "paint": {
                "circle-color": "#fff",
                "circle-radius": 4,
                "circle-opacity": 1,
                "circle-stroke-width": 4,
                "circle-stroke-color": pink,
                "circle-stroke-opacity": 1
            },
            "filter": ['all', ["==", "function", "overstap"], ["==", "trajectId", "0"]]
        });

        self._map.addLayer({
            "id": "transfer-labels",
            "type": "symbol",
            "source": "originData",
            "layout": {
                "visibility": "visible",
                "icon-image": "rect_pink",
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
            "filter": ['all', ["==", "function", "none"]]
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

        var self = this,
            activeItems = [];

        this.nightview = false;

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

        this.options = {
            filters: true,
            referenceList: true
        };

        this.session = {
            origin: null,
            destination: null

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
        this._viewSelect = document.getElementById('view-select');
        this._newOrigin = document.getElementById('new-origin');
        this._newDestination = document.getElementById('new-destination');

        this.interactionPopup = new InteractionPopup();
    }

    Map.prototype.init = function init() {

        var self = this;

        var mapWebGL = new MapWebGL(self.config);
        self._map = mapWebGL.create();

        self._background = new Background(self._map, self.config);
        self._origin = new Origin(self._map, self.config);
        self._points = new Points(self._map, self.config);
        self._lines = new Lines(self._map, self.config);

        self._map.on('style.load', function () {
            self._points.addOrigins();
            self._initMap();
        });
    };

    Map.prototype._initMap = function _initMap() {

        var self = this;

        if (self._map.getLayer('destinations') != undefined) {
            self._map.removeLayer('destinations');
        }
        if (self._map.getLayer('destination-labels') != undefined) {
            self._map.removeLayer('destination-labels');
        }
        if (self._map.getLayer('destination-labels-connector') != undefined) {
            self._map.removeLayer('destination-labels-connector');
        }

        if (self._map.getSource('originData') != undefined) {
            self._map.removeSource('originData');
        }

        self._points.drawOrigins();
        self._originList();

        self._map.on("mouseover", "origins", function (e) {
            self._highlightOrigin(e.features[0].properties.naam);
        });
        self._map.on("click", "origin-labels", function (e) {
            self.session.origin = e.features[0].properties.id;
            self._selectOrigin(e.features[0].properties);
        });

        self._viewSelect.addEventListener("click", function () {
            self._switchView();
        }, false);
        self._newOrigin.addEventListener("click", function () {
            self._clearOrigin();
        }, false);
        self._newDestination.addEventListener("click", function () {
            self._clearDestination();
        }, false);
    };

    Map.prototype._originList = function _originList() {

        var self = this;
        self._callToAction.innerHTML = '<span>Kies</span> een <span>herkomst</span>';

        var ul = document.createElement('ul');

        self.config.origins.features.reverse().forEach(function (o) {

            var li = document.createElement('li');
            li.innerHTML = o.properties.naam;
            li.addEventListener('mouseover', function () {
                self._highlightOrigin(o.properties.naam);
            }, false);
            li.addEventListener('click', function () {
                self.session.origin = o.properties.id;
                self._selectOrigin(o.properties);
            }, false);

            ul.appendChild(li);
        });

        self._listContainer.appendChild(ul);
    };

    Map.prototype._highlightOrigin = function _highlightOrigin(naam) {

        this._map.setFilter('origin-labels', ['all', ["==", "function", "herkomst"], ["==", "naam", naam]]);
        this._map.setFilter('origin-labels-connector', ['all', ["==", "function", "herkomst"], ["==", "naam", naam]]);
    };

    Map.prototype._selectOrigin = function _selectOrigin(origin) {
        var self = this;

        // hide other origins

        // hide other destinations
        var originsFilter = self._map.getFilter('origins');
        var originsSelectedFilter = ["==", "id", self.session.origin];
        originsFilter.push(originsSelectedFilter);
        self._map.setFilter('origins', originsFilter);

        var filename = '';

        // Hoofddorp, Station
        if (origin.originId === '34294') {
            filename = 'features_Amstelland_Station_Hoofddorp';
            // Uithoorn, Busstation
        } else if (origin.originId === '10220') {
            filename = 'features_Amstelland_Uithoorn_Busstation';
            // Purmerend, Korenstraat
        } else if (origin.originId === '13412') {
            filename = 'features_Waterland_Korenstraat';
            // Volendam Stadskantoor
        } else if (origin.originId === '13527') {
            filename = 'features_Waterland_Stadskantoor';
            // Zaandam, Morgensterstraat
        } else if (origin.originId === '35250') {
            filename = 'features_Zaanstreek_Morgensterstraat';
            // Zaandam, Barkstraat
        } else if (origin.originId === '36003') {
            //
            filename = 'features_Zaanstreek_Noordwachter';
        }

        this._map.addSource('originData', {
            type: 'geojson',
            data: 'features/' + filename + '.json'
        });

        self._points.drawDestinations();
        self._lines.draw();
        self._points.drawTransfers();

        function onSourceData(e) {
            if (e.isSourceLoaded) {
                self._map.off('sourcedata', onSourceData);
                setTimeout(function () {
                    self._showDestinations();
                    self._destinationList();
                }, 1000);
            }
        };

        self._map.on('sourcedata', onSourceData);
    };

    Map.prototype._highlightDestination = function _highlightDestination(id) {

        console.log(id);

        this._map.setFilter('destination-labels', ['all', ["==", "function", "bestemming"], ["==", "id", id], ["==", "isNieuw", true]]);
        this._map.setFilter('destination-labels-connector', ['all', ["==", "function", "bestemming"], ["==", "id", id], ["==", "isNieuw", true]]);
    };

    Map.prototype._destinationList = function _destinationList() {

        var self = this;
        self._listContainer.innerHTML = '';
        self._callToAction.innerHTML = '<span>Kies</span> een <span>bestemming</span>';

        var ul = document.createElement('ul');

        self.config.destinations = self._removeAdam(self.config.destinations);

        self.config.destinations.sort(function (a, b) {
            return a.properties.naam > b.properties.naam ? 1 : b.properties.naam > a.properties.naam ? -1 : 0;
        });

        self.config.destinations.forEach(function (o) {

            var li = document.createElement('li');
            li.innerHTML = o.properties.naam;
            li.addEventListener('mouseover', function () {
                self._highlightDestination(o.properties.id);
            }, false);
            li.addEventListener('click', function () {
                console.log(o.properties);
                // moet dit wel de id zijn?
                // evt het tweede deel van
                self._initRoute(o.properties.trajectId.split('_')[1]);
            }, false);

            ul.appendChild(li);
        });

        self._listContainer.appendChild(ul);
    };

    Map.prototype._removeAdam = function _removeAdam(destinations) {

        destinations.forEach(function (dest) {

            if (dest.properties.naam.indexOf('Amsterdam') > -1) {
                dest.properties.naam = dest.properties.naam.slice(11, dest.properties.naam.length);
            }
        });
        return destinations;
    };

    Map.prototype._initRoute = function _initRoute(destination) {

        var self = this;

        // add selected destination to session
        self.session.destination = destination;
        self.session.traject = self.session.origin + '_' + destination;

        // hide other destinations
        var destinationsFilter = self._map.getFilter('destinations');
        var destinationSelectedFilter = ["==", "id", self.session.destination];
        destinationsFilter.push(destinationSelectedFilter);
        self._map.setFilter('destinations', destinationsFilter);
        self._map.setPaintProperty('destinations', 'circle-color', '#fff');
        self._map.setPaintProperty('destinations', 'circle-stroke-color', '#000');
        self._map.setLayoutProperty('destination-labels', 'icon-image', 'rect_black');
        self._map.setLayoutProperty('destination-labels-connector', 'icon-image', 'connector_black');
        self._highlightDestination(destination);

        // show routes
        self._showOld(self.session.traject, self._map);
        self._showNew(self.session.traject, self._map);
        self._setRouteInfo(self.session.traject);

        // self._oldRoute.style.opacity = 1;

        // self._map.setFilter('bus-old',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        // self._map.setFilter('bus-old-icon',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        // self._map.setFilter('metro-old',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        // self._map.setFilter('metro-old-icon',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        // self._map.setFilter('tram-old',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        // self._map.setFilter('tram-old-icon',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        // self._map.setFilter('transfers',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",false]]);
        // self._map.setFilter('transfer-labels',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",false]]);
        //
        // self._setRouteInfo(false,self.session.traject);
        // self._setBoundingBox();

        // self._oldRoute.addEventListener("click",function() { self._showOld(self.session.traject,self._map) },false);
        // self._newRoute.addEventListener("click",function() { self._showNew(self.session.traject,self._map) },false);
    };

    Map.prototype._showDestinations = function _showDestinations() {

        var self = this;
        var params = {};
        params.layers = ['destinations'];
        self.config.destinations = self._filterDestinations(self._map.queryRenderedFeatures(params));
    };

    Map.prototype._showNew = function _showNew(traject, map) {

        var self = this;

        self._map.setFilter('bus-new', ['all', ["==", "transport_type", "bus"], ["==", "isNieuw", true], ["==", "trajectId", traject]]);
        self._map.setFilter('metro-new', ['all', ["==", "transport_type", "metro"], ["==", "isNieuw", true], ["==", "trajectId", traject]]);
        self._map.setFilter('tram-new', ['all', ["==", "transport_type", "tram"], ["==", "isNieuw", false], ["==", "trajectId", traject]]);
        self._map.setFilter('train-new', ['all', ["==", "transport_type", "trein"], ["==", "isNieuw", false], ["==", "trajectId", traject]]);

        self._map.setFilter('transfers', ['all', ["==", "function", "overstap"], ["==", "trajectId", self.session.traject], ["==", "isNieuw", true]]);
        self._map.setFilter('transfer-labels', ['all', ["==", "function", "overstap"], ["==", "trajectId", self.session.traject], ["==", "isNieuw", true]]);
    };

    Map.prototype._showOld = function _showOld(traject, map) {

        var self = this;

        map.setFilter('bus-old', ['all', ["==", "transport_type", "bus"], ["==", "isNieuw", false], ["==", "trajectId", traject]]);
        map.setFilter('metro-old', ['all', ["==", "transport_type", "metro"], ["==", "isNieuw", false], ["==", "trajectId", traject]]);
        map.setFilter('tram-old', ['all', ["==", "transport_type", "tram"], ["==", "isNieuw", false], ["==", "trajectId", traject]]);
        map.setFilter('train-old', ['all', ["==", "transport_type", "trein"], ["==", "isNieuw", false], ["==", "trajectId", traject]]);

        map.setFilter('transfers', ['all', ["==", "function", "overstap"], ["==", "trajectId", self.session.traject], ["==", "isNieuw", false]]);
        map.setFilter('transfer-labels', ['all', ["==", "function", "overstap"], ["==", "trajectId", self.session.traject], ["==", "isNieuw", false]]);
    };

    Map.prototype._setRouteInfo = function _setRouteInfo(traject) {

        var self = this;

        self._routeBlock.innerHTML = '';
        var routes = self._map.querySourceFeatures(['originData'], { filter: ['all', ["!has", "function"], ["==", "trajectId", traject]] }); ///

        console.log(routes);

        var array = [];
        routes.forEach(function (r) {
            array.push(r.properties);
        });
        var grouped = self._groupBy(array, 'routeId');

        for (var g in grouped) {
            grouped[g] = self._filterRoutes(grouped[g]);
        }

        var header = document.createElement('h3');

        var routesInArray = grouped[Object.keys(grouped)[0]];

        console.log(routesInArray);

        header.innerHTML = routesInArray[0].trajectNaam;
        var ul = document.createElement('ul');

        for (var s in grouped) {
            var q = void 0;
            if (grouped[s][0].isNieuw === true) {
                q = 'Nieuwe route';
            } else {
                q = 'Huidige route';
            }
            if (grouped[s][0].routeVersion === 'firstAlt' || grouped[s][0].routeVersion === 'secondAlt') {
                q = q + ' ' + '(alternatief)';
            }

            var li = document.createElement('li');
            var input = document.createElement('input');
            input.type = "checkbox";
            input.name = grouped[s][0].routeId;
            input.checked = true;
            li.appendChild(input);
            var label = document.createElement('label');
            label.innerHTML = q;
            li.appendChild(label);
            li.addEventListener("click", function (e) {
                self._toggleRoute(e);
            }, false);
            ul.appendChild(li);
        }

        self._routeBlock.appendChild(header);
        self._routeBlock.appendChild(ul);
    };

    Map.prototype._toggleRoute = function _toggleRoute(route) {

        var self = this;

        var checkbox = route.target.parentElement.querySelector('input[type=checkbox]');
        var extraFilter = ["!=", "routeId", checkbox.name];
        var metro_new = self._map.getFilter('metro-new');
        var bus_new = self._map.getFilter('bus-new');
        var tram_new = self._map.getFilter('tram-old');
        var train_new = self._map.getFilter('train-new');
        var metro_old = self._map.getFilter('metro-old');
        var bus_old = self._map.getFilter('bus-old');
        var tram_old = self._map.getFilter('tram-old');
        var train_old = self._map.getFilter('train-old');
        if (checkbox.checked === false) {
            // console.log(extraFilter);
            metro_new.push(extraFilter);
            bus_new.push(extraFilter);
            tram_new.push(extraFilter);
            train_new.push(extraFilter);
            metro_old.push(extraFilter);
            bus_old.push(extraFilter);
            tram_old.push(extraFilter);
            train_old.push(extraFilter);
        } else {
            // let i = metro_new.findIndex( (f) => {
            //     console.log(f[0]);
            //     f[0] == '!='; // && f[2] === checkbox.name;
            // });
            // console.log(i);
            // if (i > -1) {
            //     metro_new = metro_new.splice(i,1);
            //     console.log(metro_new);
            // }
            metro_new.pop();
            bus_new.pop();
            tram_new.pop();
            train_new.pop();
            metro_old.pop();
            bus_old.pop();
            tram_old.pop();
            train_old.pop();
        }

        self._map.setFilter('metro-new', metro_new);
        self._map.setFilter('bus-new', bus_new);
        self._map.setFilter('tram-new', tram_new);
        self._map.setFilter('train-new', train_new);

        self._map.setFilter('metro-old', metro_old);
        self._map.setFilter('bus-old', bus_old);
        self._map.setFilter('tram-old', tram_old);
        self._map.setFilter('train-old', train_old);
    };

    Map.prototype._setBoundingBox = function _setBoundingBox() {

        var self = this;
        var features = self._map.queryRenderedFeatures({ layers: ['origins', 'destinations', 'transfers'] });

        var collection = {
            "type": "FeatureCollection",
            "features": features
        };
        var bbox = turf.bbox(collection);

        self._map.fitBounds(bbox, {
            padding: { top: 100, bottom: 100, left: 100, right: 100 },
            linear: true
        });
    };

    Map.prototype._switchView = function _switchView() {
        var self = this;

        if (this.nightview) {

            this.nightview = false;
            self._map.setStyle('mapbox://styles/wijnemenjemee/cjcywszq502re2sobjc8d1e0z');
            self._viewSelect.innerHTML = 'nacht';
            self._map.setPaintProperty('bus-old', 'line-color', black);
            self._map.setPaintProperty('bus-new', 'line-color', black);
            self._map.setPaintProperty('tram-old', 'line-color', black);
            self._map.setPaintProperty('tram-new', 'line-color', black);
            self._map.setPaintProperty('metro-old', 'line-color', black);
            self._map.setPaintProperty('metro-new', 'line-color', black);
        } else {
            this.nightview = true;
            self._map.setStyle('mapbox://styles/wijnemenjemee/cjdvrcqvn6dy32smopkqhd9q3');
            self._viewSelect.innerHTML = 'dag';
            self._map.setPaintProperty('bus-old', 'line-color', white);
            self._map.setPaintProperty('bus-new', 'line-color', white);
            self._map.setPaintProperty('tram-old', 'line-color', white);
            self._map.setPaintProperty('tram-new', 'line-color', white);
            self._map.setPaintProperty('metro-old', 'line-color', white);
            self._map.setPaintProperty('metro-new', 'line-color', white);
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
        self._initMap();
    };

    Map.prototype._clearDestination = function _clearDestination() {
        var self = this;
        this.session.destination = null;
        this._listContainer.innerHTML = '';
        // self._clearRoutes()
        self._showDestinations();
        self._destinationList();
    };

    Map.prototype._clearRoutes = function _clearRoutes() {

        var self = this;

        this._newRoute.innerHTML = '';
        this._oldRoute.innerHTML = '';

        self._map.setFilter('bus-new', ['all', ["==", "transport_type", "bus"], ["==", "isNieuw", true], ["==", "trajectId", ""]]);
        self._map.setFilter('metro-new', ['all', ["==", "transport_type", "metro"], ["==", "isNieuw", true], ["==", "trajectId", ""]]);
        self._map.setFilter('tram-new', ['all', ["==", "transport_type", "tram"], ["==", "isNieuw", false], ["==", "trajectId", ""]]);

        self._map.setFilter('bus-old', ['all', ["==", "transport_type", "bus"], ["==", "isNieuw", false], ["==", "trajectId", ""]]);
        self._map.setFilter('metro-old', ['all', ["==", "transport_type", "metro"], ["==", "isNieuw", false], ["==", "trajectId", ""]]);
        self._map.setFilter('tram-old', ['all', ["==", "transport_type", "tram"], ["==", "isNieuw", false], ["==", "trajectId", ""]]);

        self._map.setFilter('bus-old-icon', ['all', ["==", "transport_type", "bus"], ["==", "isNieuw", false], ["==", "trajectId", ""]]);
        self._map.setFilter('metro-old-icon', ['all', ["==", "transport_type", "metro"], ["==", "isNieuw", false], ["==", "trajectId", ""]]);
        self._map.setFilter('tram-old-icon', ['all', ["==", "transport_type", "tram"], ["==", "isNieuw", false], ["==", "trajectId", ""]]);

        self._map.setFilter('transfers', ['all', ["==", "function", "overstap"], ["==", "trajectId", ""], ["==", "isNieuw", true]]);
        self._map.setFilter('transfer-labels', ['all', ["==", "function", "overstap"], ["==", "trajectId", ""], ["==", "isNieuw", true]]);
    };

    Map.prototype._groupBy = function _groupBy(xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    return Map;
}();