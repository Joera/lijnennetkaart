class MapJs {

    constructor(config) {
        this._config = config;
    }

    create() {

        let self = this;
        console.log(self._config);
        L.mapbox.accessToken = self._config.accessToken;
        this._map = L.mapbox.map(self._config.hostContainer)
            .setView([self._config.center[1],self._config.center[0]], self._config.zoom);
        var styleLayer = L.mapbox.styleLayer(self._config.style)
            .addTo(this._map);

        console.log(self._config.scrollzoom);
        console.log(self._map.scrollWheelZoom);
        if (self._map.scrollWheelZoom && self._config.scrollzoom === false) {
            console.log('disable');
            self._map.scrollWheelZoom.disable();
        }

        return this._map;
    }
}


