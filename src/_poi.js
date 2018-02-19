class PoiLayer {

    constructor(map,config) {

        this._map = map;
    }

    draw() {

        let self = this;

        if (webgl_detect()) {

            self._map.addSource("poi", {
                "type": "geojson",
                "data": "./assets/geojson/poi.geojson"
            });

            self._map.addLayer({
                "id": "poi",
                "type": "symbol",
                "source": "poi",
                "layout": {
                    "visibility": "visible",
                    "icon-image": "rect_white",
                    "icon-padding": 0,
                    "icon-text-fit": 'both',
                    "icon-text-fit-padding": [10,5,0,5],
                    "icon-allow-overlap": true,
                    "icon-padding": 20,
                    "text-field": "{name}",
                    "text-font": ["BC Falster Grotesk Bold"], // "Cabrito Sans W01 Norm Bold",
                    "text-size": 20,
                    "text-offset": [0,0],
                    "text-anchor": "center",
                },
                'paint': {
                    "text-color": "rgb(51,51,51)"
                },
                'filter': ['has','name']
            },'projects');

        } else {

            let markers = [];

            let poi = L.mapbox.featureLayer()
                .loadURL('./assets/geojson/poi.geojson')
                .on('ready', function(e) {

                    e.target._geojson.features.forEach( function(feature) {

                        var label = L.divIcon({

                            iconSize: (25, 200),
                            className: 'poi label',
                            iconAnchor: (50, 50),
                            popupAnchor: (0, 0),
                            html: `
                                <span class="js-label">${feature.properties.name}</span>
                            `
                        });

                        var marker = L.marker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{icon: label}); // .bindPopup(item.title);
                        markers.push(marker);
                    });

                    this.markers = new L.featureGroup(markers);
                    this.markers.addTo(self._map);

                });

        }
    }


}