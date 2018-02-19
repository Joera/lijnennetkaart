
class Points {

    constructor(map,config) {

        this._map = map;
        this._config = config;
    }

    drawOrigins(filter) {

        let self = this;

        console.log(self._config.dataset);

        self._map.addSource("points", {
            "type": "geojson",
            "data": self._config.dataset
        });

        self._map.addLayer({
            "id": "origins",
            "type": "circle",
            "source": "points",
            "paint": {
                "circle-color": "#fff",
                "circle-radius": 6,
                "circle-opacity": 1,
                "circle-stroke-width": 6,
                "circle-stroke-color": blauw,
                "circle-stroke-opacity": 1,
            },
            "filter": ['all',
                ["==", "function", "herkomst"],
            ]
        });

        self._map.addLayer({
            "id": "origin-labels",
            "type": "symbol",
            "source": "points",
            "layout": {
                "visibility": "visible",
                "icon-image": "rect_white",
                "icon-padding": 0,
                "icon-text-fit": 'both',
                "icon-text-fit-padding": [5,5,0,5],
                "icon-allow-overlap": true,
                "text-field": "{naam}",
                "symbol-placement": "point",
                "text-size": 16,
                "text-anchor": "left",
                "text-offset": [1.5,0],
                "text-max-width": 30
            },
            "paint": {
                'text-color': blauw
            },
            "filter": ['all',
                ["==", "function", "herkomst"],
            ]
        });
    }

    drawDestinations(filter) {

        let self = this;

        self._map.addLayer({
            "id": "destinations",
            "type": "circle",
            "source": "points",
            "paint": {
                "circle-color": "#fff",
                "circle-radius": 6,
                "circle-opacity": 1,
                "circle-stroke-width": 6,
                "circle-stroke-color": rood,
                // {
                //             property: 'stopType',
                //             type: 'categorical',
                //             stops: [
                //                 ['remove', donkerrood],
                //                 ['inherit', donkergeel],
                //                 ['merge', navy]
                //             ]
                //         },
                "circle-stroke-opacity": 1,
            },
            "filter": ['all',
                ["==", "function", "none"],
            ]
        });
    }

    drawTransfers(filter) {

        let self = this;

        self._map.addLayer({
            "id": "transfers",
            "type": "circle",
            "source": "points",
            "paint": {
                "circle-color": "#fff",
                "circle-radius": 6,
                "circle-opacity": 1,
                "circle-stroke-width": 6,
                "circle-stroke-color": donkergeel,
                "circle-stroke-opacity": 1,
            },
            "filter": ['all',
                ["==", "function", "overstap"],
                ["==", "trajectId", "0"],
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
