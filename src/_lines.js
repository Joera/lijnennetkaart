
class Lines {

    constructor(map,config) {

        this._map = map;
        this._config = config;

        this.speedFactor = 30; // number of frames per longitude degree
        this.animation = ''; // to store and cancel the animation
        this.startTime = 0;
        this.progress = 0; // progress = timestamp - startTime
        this.resetTime = false; // indicator of whether time reset is needed for the animation
        this.layerId = 'cjc4zc40d13wa2wqskv9bk020';
    }

    init() {

        let self = this;
        self._draw();
    }

    // er zijn per route twee sources, een voor oud, een voor nieuw

    drawOldLayers(routesId) {

        console.log('drawing old layers');

        let self = this;

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
                "line-dasharray": [1,0]
            },
            "filter": ['all',
                ["==","isNieuw",false],
                ["==","transport_type","bus"]
            ]
        },'origins');

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
                "line-dasharray": [.5,.5],
            },
            "filter": ['all',
                ["==","isNieuw",false],
                ["==","transport_type","tram"]
            ]
        },'origins');

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
                "line-dasharray": [1,.5],

            },
            "filter": ['all',
                ["==","isNieuw",false],
                ["==","transport_type","metro"],
            ]
        },'origins');

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
                "line-dasharray": [1,2],

            },
            "filter": ['all',
                ["==","isNieuw",true],
                ["==","transport_type","trein"]
            ]
        },'origins');


    }

    drawNewLayers(routesId) {

        let self = this;

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
                "line-dasharray": [1,0],

            },
            "filter": ['all',
                ["==","isNieuw",true],
                ["==","transport_type","bus"]
            ]
        },'origins');



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
                "line-dasharray": [.5,.5],

            },
            "filter": ['all',
                ["==","isNieuw",true],
                ["==","transport_type","tram"]
            ]
        },'origins');




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
                "line-dasharray": [1,.5],
            },
            "filter": ['all',
                ["==","isNieuw",true],
                ["==","transport_type","metro"]
            ]
        },'origins');



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
                "line-dasharray": [1,2],

            },
            "filter": ['all',
                ["==","isNieuw",true],
                ["==","transport_type","trein"]
            ]
        },'origins');

        self._map.addLayer({
            "id": "transport-mode-new",
            "type": "symbol",
            "source": "routes-nieuw",
            "layout": {
                "symbol-placement": "line",
                "icon-rotation-alignment": "viewport",
                "icon-image": {
                    property: 'transport_type',
                    type: 'categorical',
                    stops: [
                        ['trein', "trein"],
                        ['bus', "bus"],
                        ['tram', "tram"],
                        ['metro', "metro"],
                        ['wandel', "voetganger"]
                    ]
                },
                "icon-size": .7,
                "icon-padding": 20,
                "icon-allow-overlap": true,
                "icon-anchor": 'bottom',
                "icon-offset": [30,0],
                "visibility": "none",
                "text-field": "{transport_nrs}",
                "text-size": 15,
                "text-anchor": "bottom",
                "text-rotation-alignment": "viewport",
                "text-offset": [3.2,0],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform" : "uppercase",
                "text-allow-overlap":true
            },
            "paint": {
                "icon-opacity": 1,
                "text-color": black
            },
            "filter": ['all',
                ["==","isNieuw",true],
            ]
        },'origins');

        self._map.addLayer({
            "id": "transport-mode-old",
            "type": "symbol",
            "source": "routes-oud",
            "layout": {
                "symbol-placement": "line",
                "icon-rotation-alignment": "viewport",
                "icon-image": {
                    property: 'transport_type',
                    type: 'categorical',
                    stops: [
                        ['trein', "trein"],
                        ['bus', "bus"],
                        ['tram', "tram"],
                        ['metro', "metro"],
                        ['wandel', "voetganger"]
                    ]
                },
                "icon-size": .7,
                "icon-padding": 20,
                "icon-allow-overlap": true,
                "icon-anchor": 'bottom',
                "icon-offset": [30,0],
                "visibility": "none",
                "text-field": "{transport_nrs}",
                "text-size": 15,
                "text-anchor": "bottom",
                "text-rotation-alignment": "viewport",
                "text-offset": [3.2,0],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform" : "uppercase",
                "text-allow-overlap":true
            },
            "paint": {
                "icon-opacity": 1,
                "text-color": black
            },
            "filter": ['all',
                ["==","isNieuw",false],
            ]
        },'origins');
    }
}
