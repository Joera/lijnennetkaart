
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

    draw() {

        let self = this;

        console.log(self._config.dataset);

        // self.lines = lines;

        self._map.addSource("lines", {
            "type": "geojson",
            "data": self._config.dataset
        });

        self._map.addLayer({
            "id": "bus-old",
            "type": "line",
            "source": "lines",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": "#000",
                "line-width": 6,
                "line-dasharray": [1,0]
            },
            "filter": ['all',
                ["==","trajectId",""],
                ["==","isNieuw",false],
                ["==","transport_type","bus"]
            ]
        });

        self._map.addLayer({
            "id": "bus-new",
            "type": "line",
            "source": "lines",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": donkergeel,
                "line-width": 6,
                "line-dasharray": [1,0]
            },
            "filter": ['all',
                ["==","trajectId",""],
                ["==","isNieuw",true],
                ["==","transport_type","bus"]
            ]
        });

        self._map.addLayer({
            "id": "metro-old",
            "type": "line",
            "source": "lines",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": "#000",
                "line-width": 12,
                "line-dasharray": [.25,.25]
            },
            "filter": ['all',
                ["==","trajectId",""],
                ["==","isNieuw",false],
                ["==","transport_type","metro"]
            ]
        });

        self._map.addLayer({
            "id": "metro-new",
            "type": "line",
            "source": "lines",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": donkergeel,
                "line-width": 12,
                "line-dasharray": [.25,.25]
            },
            "filter": ['all',
                ["==","trajectId",""],
                ["==","isNieuw",true],
                ["==","transport_type","metro"]
            ]
        });

        self._map.addLayer({
            "id": "tram-old",
            "type": "line",
            "source": "lines",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": "#000",
                "line-gap-width": 4,
                "line-width": 4,
            },
            "filter": ['all',
                ["==","trajectId",""],
                ["==","isNieuw",false],
                ["==","transport_type","tram"]
            ]
        });

        self._map.addLayer({
            "id": "tram-new",
            "type": "line",
            "source": "lines",
            "layout": {
                "line-join": "miter",
                "line-cap": "square"
            },
            "paint": {
                "line-color": donkergeel,
                "line-gap-width": 4,
                "line-width": 4,
            },
            "filter": ['all',
                ["==","trajectId",""],
                ["==","isNieuw",true],
                ["==","transport_type","tram"]
            ]
        });

        self._map.addLayer({
            "id": "caption",
            "type": "symbol",
            "source": "lines",
            "layout": {
                "visibility": "visible",
                "icon-image": "rect_white",
                "icon-padding": 0,
                "icon-text-fit": 'both',
                "icon-text-fit-padding": [10,5,0,5],
                "icon-allow-overlap": true,
                "icon-padding": 20,
                "icon-anchor": "right",
                "text-field": "{trajectNaam}",
              //   "text-font": ["BC Falster Grotesk Bold"], // "Cabrito Sans W01 Norm Bold",
                "text-size": 20,
                "text-offset": [0,0],
                "text-anchor": "center",
            },
            'paint': {
                "text-color": "rgb(51,51,51)"
            },
            'filter': ['all',
                ['has','trajectNaam'],
                ["==","trajectId",""]
            ]
        });
    }


    _animateLine(timestamp) {

        let self = this;

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
    }
}
