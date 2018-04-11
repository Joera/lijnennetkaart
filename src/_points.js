

class Points {

    constructor(map,config) {

        this._map = map;
        this._config = config;


    }

    addOrigins() {

        this._map.addSource("origins", {
            "type": "geojson",
            "data": this._config.origins
        });
    }

    drawOrigins(filter) {

        let self = this;

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
                    stops: [
                        ['muted', grey],
                        ['inactive', purple],
                        ['highlighted', pink],
                        ['origin', black],
                        ['destination', black],
                    ]
                },
                "circle-stroke-opacity": 1,
            },
            "filter": ['all',
                // ["==", "function", "herkomst"],
            ]
        },'route-bus_old');

        self._map.addLayer({
            "id": "origin-labels",
            "type": "symbol",
            "source": "origins",
            "layout": {
                "visibility": "visible",
                "icon-image": {
                    property: 'state',
                    type: 'categorical',
                    stops: [
                        ['inactive', ''],
                        ['highlighted', 'rect_pink'],
                        ['origin', 'rect_black'],
                        ['destination', 'rect_black']
                    ]
                },
                "icon-padding": 0,
                "icon-text-fit": 'both',
                "icon-text-fit-padding": [5,10,2,10],
                "icon-allow-overlap": true,
                "text-field": "{naam}",
                "symbol-placement": "point",
                "text-size": 15,
                "text-anchor": "left",
                "text-offset": [2,0],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform" : "uppercase",
                 "text-allow-overlap":true
            },
            "paint": {
                'text-color': {
                    property: 'state',
                    type: 'categorical',
                    stops: [
                        ['inactive', '#fff'],
                        ['highlighted', '#fff'],
                        ['origin', yellow],
                        ['destination', yellow]
                    ]
                },
            },
            "filter": ['all',

                ["in", "state", "origin","destination","highlighted"]
            ]
        });

        self._map.addLayer({
            "id": "origin-labels-connector",
            "type": "symbol",
            "source": "origins",
            "layout": {

                "icon-image": {
                    property: 'state',
                    type: 'categorical',
                    stops: [
                        ['inactive', ''],
                        ['highlighted', 'connector_pink'],
                        ['origin', 'connector_black'],
                        ['destination', 'connector_black']
                    ]
                },
                "icon-padding": 0,
                "icon-allow-overlap": true,
                "symbol-placement": "point",
                "icon-size": 1,
                "icon-offset": [16,0],

            },
            "filter": ['all',

                ["in", "state", "origin","destination","highlighted"]
            ]
        },'origins');
    }

    drawTransfers(routesId) {

        let self = this;

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
                "circle-stroke-opacity": 1,
            },
            "filter": ['all',
                ["==", "function", "overstap"]
            ]
        },'route-bus_old');

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
                "circle-stroke-opacity": 1,
            },
            "filter": ['all',
                ["==", "function", "overstap"]
            ]
        },'route-bus_old');

        self._map.addLayer({
            "id": "transfer-labels-old",
            "type": "symbol",
            "source": "routes-oud",
            "layout": {
                "visibility": "visible",
                "icon-image": "rect_black",
                "icon-padding": 0,
                "icon-text-fit": 'both',
                "icon-text-fit-padding": [5,10,2,10],
                "icon-allow-overlap": true,
                "text-field": "{naam}",
                "symbol-placement": "point",
                "text-size": 15,
                "text-anchor": "right",
                "text-offset": [-1.6,0],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform" : "uppercase",
                "text-allow-overlap":true
            },
            "paint": {
                'text-color': "#fff"
            },
            "filter": ['all',
                ["==", "function", "overstap"],
                ["==", "isNieuw", false]
            ]
        },'route-bus_old');

        self._map.addLayer({
            "id": "transfer-labels-new",
            "type": "symbol",
            "source": "routes-nieuw",
            "layout": {
                "visibility": "visible",
                "icon-image": "rect_black",
                "icon-padding": 0,
                "icon-text-fit": 'both',
                "icon-text-fit-padding": [5,10,2,10],
                "icon-allow-overlap": true,
                "text-field": "{naam}",
                "symbol-placement": "point",
                "text-size": 15,
                "text-anchor": "right",
                "text-offset": [-1.6,0],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform" : "uppercase",
                "text-allow-overlap":true
            },
            "paint": {
                'text-color': "#fff"
            },
            "filter": ['all',
                ["==", "function", "overstap"],
                ["!in", "id","99999","99999","99998","99997","99996","99995","99994","99993","99992"],
                ["==", "isNieuw", true]
            ]
        },'route-bus_old');

        self._map.addLayer({
            "id": "transfer-labels-new-info",
            "type": "symbol",
            "source": "routes-nieuw",
            "layout": {
                "visibility": "visible",
                "icon-image": "rect_black",
                "icon-padding": 0,
                "icon-text-fit": 'both',
                "icon-text-fit-padding": [5,10,2,10],
                "icon-allow-overlap": true,
                "text-field": "{naam} (info)",
                "symbol-placement": "point",
                "text-size": 15,
                "text-anchor": "right",
                "text-offset": [-1.6,0],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform" : "uppercase",
                "text-allow-overlap":true
            },
            "paint": {
                'text-color': "#fff"
            },
            "filter": ['all',
                ["==", "function", "overstap"],
                ["in", "id","99999","99999","99998","99997","99996","99995","99994","99993","99992"],
                ["==", "isNieuw", true]
            ]
        },'route-bus_old');

        self._map.on("click", "transfer-labels-new-info", function (e) {

            let url = '';

            if (e.features[0].properties.id === '99999') {

                url = 'http://wijnemenjemee.nl/noordzuidlijn/station/station-noord';

            } else if (e.features[0].properties.id === '99998') {

                url = 'http://wijnemenjemee.nl/noordzuidlijn/station/station-noorderpark';

            } else if (e.features[0].properties.id === '99997') {

                url = 'http://wijnemenjemee.nl/noordzuidlijn/station/centraal-station';

            } else if (e.features[0].properties.id === '99996') {

                url = 'http://wijnemenjemee.nl/noordzuidlijn/station/rokin';

            } else if (e.features[0].properties.id === '99995') {

                url = 'http://wijnemenjemee.nl/noordzuidlijn/station/station-vijzelgracht';

            } else if (e.features[0].properties.id === '99994') {

                url = 'http://wijnemenjemee.nl/noordzuidlijn/station/station-de-pijp';

            } else if (e.features[0].properties.id === '99993') {
                url = 'http://wijnemenjemee.nl/noordzuidlijn/station/station-europaplein';

            } else if (e.features[0].properties.id === '99992') {

                url = 'http://wijnemenjemee.nl/noordzuidlijn/station/station-zuid';
            }

            window.open(url,'_blank');
        });
    }
}
