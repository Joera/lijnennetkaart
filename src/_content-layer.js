class ContentLayer {

    constructor(map,config,popup,activeItems) {

        this._map = map;
        this._config = config;
        this.interactionPopup = popup;
        this.activeItems = activeItems;
    }

    draw(content) {

        let self = this,
            html,
            lngLat,
            type,
            offset
            ;

        if (webgl_detect()) {

            self._map.addSource('markers', {
                'type': 'geojson',
                'data': content
            });

            self._map.addLayer({
                "id": "icons",
                "type": "symbol",
                "source": "markers",

                "layout": {
                    "icon-image": {
                        property: 'type',
                        type: 'categorical',
                        stops: [
                            ['project', "projectIcon"],
                            ['blog', "blogIcon"]
                        ]
                    },
                    "icon-padding": 0,
                    "icon-allow-overlap": true,
                    "icon-anchor": 'bottom',
                    "icon-offset": [20,10],
                    "visibility": "visible",

                    // "icon-rotate": 25
                },
                "paint": {
                    "icon-opacity": 1,
                },
                "filter": ['any',

                    ['==', 'type', 'project'],
                    ['==', 'type', 'blog']
                ]
            });

            if (self._config.highlights) {

                self._map.addLayer({
                    "id": "icons-active",
                    "type": "symbol",
                    "source": "markers",

                    "layout": {
                        "icon-image": {
                            property: 'type',
                            type: 'categorical',
                            stops: [
                                ['project', "projectIconActive"],
                                ['blog', "blogIconActive"]
                            ]
                        },
                        "icon-padding": 0,
                        "icon-allow-overlap": true,
                        "icon-anchor": 'bottom',
                        "icon-offset": [15,10],
                        "visibility": "visible",
                        "icon-size": 1
                        // "icon-rotate": 25
                    },
                    "paint": {
                        "icon-color": "#000",

                    },
                    "filter": ['all',
                        ["==", 'slug', '']
                    ]
                });
            }

            self._map.on("click", "icons", function (e) {

                self._map.getCanvas().style.cursor = 'pointer';

                html = self.interactionPopup.createPopup(e.features[0]);
                offset = [18, -42];
                lngLat = e.features[0].geometry.coordinates;
                type = e.features[0].properties.type;

                self.interactionPopup.openPopup(self._map,html,lngLat,type,offset);
            });

            self._map.on("click", "icons-active", function (e) {

                self._map.getCanvas().style.cursor = 'pointer';

                html = self.interactionPopup.createPopup(e.features[0]);
                offset = [16, -34];
                lngLat = e.features[0].geometry.coordinates;
                type = e.features[0].properties.type;

                self.interactionPopup.openPopup(self._map,html,lngLat,type,offset);
            });

            self.activeItems.setGL(self._config.activeItems);

        } else {

            let marker,
                markers = [],
                html,
                latLng,
                popup,
                initialPopups,
                blogIcon;

            let iconGenerator = new IconGenerator();

            content.features.forEach(function(item) {

                if (item.properties.type === 'blog') {
                    blogIcon = iconGenerator.blogIcon(item);
                } else if (item.properties.type === 'project') {
                    blogIcon = iconGenerator.projectIcon(item);
                }

                marker = L.marker([item.geometry.coordinates[1],item.geometry.coordinates[0]],{icon: blogIcon}); // .bindPopup(item.title);

                // console.log(item);
                // console.log(marker);

                marker.on('click', function(e) {

                    html = self.interactionPopup.createPopup(item);
                    //open popup;
                    initialPopups = L.popup({
                            className : item.properties.type,
                            offset : [0,36]
                        })
                        .setLatLng(e.latlng)
                        .setContent(html)
                        .openOn(self._map);
                });
                markers.push(marker);
            });

            this.markers = new L.featureGroup(markers);
            this.markers.addTo(self._map);

            self.activeItems.setJS(content,self._config.activeItems);
            self._map.fitBounds(self.markers.getBounds().pad(1));
        }
    }



    // voor bereikbaarheid
    zoom() {

        let self = this,
            coordinates = self._config.dataset.lines.features[1].geometry.coordinates,
            bounds = coordinates.reduce(function(bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        self._map.fitBounds(bounds, {
            padding: 100
        });
    }

    // voor bereikbaarheid
    addLegend() {

        let legend = document.createElement('div');
        legend.classList.add('legend');
        self.hostContainer.appendChild(legend);
    }

    navigate(url){

        window.location.href = url;
    }
}
