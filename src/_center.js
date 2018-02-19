class Center {

    constructor(map, config) {

        this._map = map;
        this._config = config;
    }

    setGL() {

        let self = this,
            activeFeatures = self._map.queryRenderedFeatures({ layers: ['icons-active'] });

        if (activeFeatures && activeFeatures.length === 1) {
            let latLng = [activeFeatures[0].geometry.coordinates[0],activeFeatures[0].geometry.coordinates[1]];
            self._map.setCenter(latLng);
            self._map.setZoom(self._config.zoom);
        } else if (activeFeatures && activeFeatures.length > 1) {

            let collection = activeFeatures.map(function(f){
                return f.geometry.coordinates;
            })
            // self._map.fitBounds(collection, {
            //     padding: {top: 10, bottom:10, left: 10, right: 10}
            // });
        }
    }

    setJS(content,activeItems) {

        let self = this,
            latLng,
            activeMarkers;

        // console.log(activeItems);

        if (activeItems && activeItems.length < 2) {

            activeMarkers = content.features.filter(function(f){
                return f.properties.slug === activeItems[0];
            });

            // console.log(activeMarkers);

            if (activeMarkers[0]) {
                latLng = new L.LatLng(parseFloat(activeMarkers[0].geometry.coordinates[1]) + 0, parseFloat(activeMarkers[0].geometry.coordinates[0]) - 0);
                setTimeout( function() {
                    self._map.setView(latLng, self._config.zoom);
                },500);
            }
        } else {
            // self._map.fitBounds(activeMarkers.getBounds().pad(2.5));
        }
    }

}