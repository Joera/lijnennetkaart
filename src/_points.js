
class Points {

    constructor(map,config) {

        this._map = map;
        this._config = config;
    }

    drawOrigins(filter) {

        let self = this;

        console.log(self._config.origins);

        self._map.addSource("origins", {
            "type": "geojson",
            "data": self._config.origins
        });

        self._map.addSource("points", {
            "type": "geojson",
            "data": self._config.dataset
        });

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
                "circle-stroke-opacity": 1,
            },
            "filter": ['all',
                ["==", "function", "herkomst"],
            ]
        }   );

        self._map.addLayer({
            "id": "origin-labels",
            "type": "symbol",
            "source": "origins",
            "layout": {
                "visibility": "visible",
                "icon-image": "rect_purple",
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
                'text-color': "#fff"
            },
            "filter": ['all',
                ["==", "function", "herkomst"],
                ["==", "naam", "none"]
            ]
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
                "icon-offset": [16,0],

            },
            "filter": ['all',
                ["==", "function", "herkomst"],
                ["==", "naam", "none"]
            ]
        },'origins');
    }

    drawDestinations(filter) {

        let self = this;

        self._map.addLayer({
            "id": "destinations",
            "type": "circle",
            "source": "points",
            "paint": {
                "circle-color": pink,
                "circle-radius": 8,
                "circle-opacity": 1,
                // "circle-stroke-width": 4,
                // "circle-stroke-color": white,
                "circle-stroke-opacity": 1,
            },
            "filter": ['all',
                ["==", "function", "none"],
            ]
        });

        self._map.addLayer({
            "id": "destination-labels",
            "type": "symbol",
            "source": "points",
            "layout": {
                "visibility": "visible",
                "icon-image": "rect_pink",
                "icon-padding": 0,
                "icon-text-fit": 'both',
                "icon-text-fit-padding": [5,10,2,10],
                "icon-allow-overlap": true,
                "text-field": "{naam}",
                "symbol-placement": "point",
                "text-size": 15,
                "text-anchor": "left",
                "text-offset": [1.6,0],
                "text-max-width": 30,
                "text-font": ["Avenir LT Std 85 Heavy"],
                "text-transform" : "uppercase",
                "text-allow-overlap":true
            },
            "paint": {
                'text-color': "#fff"
            },
            "filter": ['all',
                ["==", "function", "none"],
            ]
        });

        self._map.addLayer({
            "id": "destination-labels-connector",
            "type": "symbol",
            "source": "points",
            "layout": {

                "icon-image": "connector_pink",
                "icon-padding": 0,
                "icon-allow-overlap": true,
                "symbol-placement": "point",
                "icon-size": 1,
                "icon-offset": [16,0],

            },
            "filter": ['all',
                ["==", "function", "none"],
            ]
        },'destination-labels');
    }

    drawTransfers(filter) {

        let self = this;

        self._map.addLayer({
            "id": "transfers",
            "type": "circle",
            "source": "points",
            "paint": {
                "circle-color": "#fff",
                "circle-radius": 4,
                "circle-opacity": 1,
                "circle-stroke-width": 4,
                "circle-stroke-color": black,
                "circle-stroke-opacity": 1,
            },
            "filter": ['all',
                ["==", "function", "overstap"],
                ["==", "trajectId", "0"],
            ]
        });

        self._map.addLayer({
            "id": "transfer-labels",
            "type": "symbol",
            "source": "points",
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
                ["==", "function", "none"],
            ]
        });
    }


        // self._map.addLayer({
        //     "id": "labels",
        //     "type": "symbol",
        //     "source": "stops",
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





}
