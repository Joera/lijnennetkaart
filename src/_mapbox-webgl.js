class MapWebGL {

    constructor(config) {

        this._config = config;
    }

    create(){

        let self = this;

        mapboxgl.accessToken= self._config.accessToken;

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

        let nav = new mapboxgl.NavigationControl();
        self._map.addControl(nav,'top-right')
            .addControl(new mapboxgl.AttributionControl({
                        compact: true
                    }));

        if (self._map.scrollZoom && self._config.scrollzoom === false) {
            self._map.scrollZoom.disable();
        }

        return this._map;
    }

    _drawContentFromTemplate() {

        let self = this;
        self._map.on('load', function() {
            self._addIcons(self.templateContent);
        });
    }

    _drawPoints() {

        let self = this;

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
                        stops: [
                            ['omleiding', '#4C9630'],
                            ['beperking', '#DC3D50'],
                            ['geluidsmeter', '#4C9630']
                        ]
                    },
                    "circle-radius": {
                        property: 'class',
                        type: 'categorical',
                        stops: [
                            ['omleiding', 20],
                            ['beperking', 20],
                            ['geluidsmeter', 2],
                        ]
                    },
                    "circle-opacity" : {
                        property: 'class',
                        type: 'categorical',
                        stops: [
                            ['omleiding', 1],
                            ['beperking', 1],
                            ['geluidsmeter', 1],
                        ]

                    },
                    "circle-stroke-width" : {
                        property: 'class',
                        type: 'categorical',
                        stops: [
                            ['omleiding', 0],
                            ['beperking', 0],
                            ['geluidsmeter', 18],
                        ]

                    },
                    "circle-stroke-color": {
                        property: 'class',
                        type: 'categorical',
                        stops: [
                            ['omleiding', '#4C9630'],
                            ['beperking', '#DC3D50'],
                            ['geluidsmeter', '#4C9630']
                        ]
                    },
                    "circle-stroke-opacity" : {
                        property: 'class',
                        type: 'categorical',
                        stops: [
                            ['omleiding', 1],
                            ['beperking', 1],
                            ['geluidsmeter', .7],
                        ]

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
    }

    _initPopup() {

        let self = this;

        self._map.on('style.load', function () {
            // Create a popup, but don't add it to the map yet.
            var popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
        });
    }

}
