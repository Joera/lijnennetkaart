class Background {

    constructor(map, config) {

        this._map = map;
        this._config = config;
    }

    init() {

        let self = this;

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
                "circle-stroke-opacity": 1,
            },
            "filter": ['any',
                ["==", "name", "overstap"],
                ["==", "name", "0"],
            ]
        });
    }
}