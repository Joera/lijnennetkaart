class InteractionFilters {

    constructor(map, config, contentLayer,interactionPopup) {
        this._map = map;
        this._config = config;
        this._contentLayer = contentLayer;
        this._interactionPopup = interactionPopup;
        this.filters = document.getElementById("filter-container");
        this.filterArrayForJs = ['blog', 'project', 'poi'];
        if(this.filters) {
            this.blogFilter = this.filters.querySelector("#blog");
            this.projectFilter = this.filters.querySelector("#project");
            this.poiFilter = this.filters.querySelector("#poi");
        }
    }

    init() {

        let self = this;

        if (self.filters) {
            self.blogFilter.addEventListener("click", function (e) {
                self.filterLayer(self._map, 'icons', 'blog');
            }, false);
            self.projectFilter.addEventListener("click", function (e) {
                self.filterLayer(self._map, 'icons', 'project');
            }, false);

            if (self.poiFilter) {
                self.poiFilter.addEventListener("click", function (e) {
                    self.filterLayer(self._map, 'poi');
                }, false);
            }
        }
    }

    filterLayer(map,layer,filter) {

        let self = this;

        if (webgl_detect()) {
            self._GL_filterLayer(map,layer,filter);
        } else {
            self._JS_filterLayer(map, layer, filter);
        }
    }

    _GL_filterLayer(map, layer, filter) {

        let self = this;

            let currentFilter = map.getFilter(layer),
                newFilter = ['any'],
                exists;

            if (layer === 'icons' || layer === 'icons-active') {

                // check if filter is in array
                exists = currentFilter.filter(function (i) {
                    return i[2] === filter;
                });

                if (exists.length > 0) {
                    // remove
                    currentFilter.forEach(function (f) {
                        if (Array.isArray(f)) {
                            if (f[2] !== filter) {
                                newFilter.push(f);
                            }
                        }
                    });

                    self.filters.querySelector("#" + filter).classList.add('inactive');

                } else {
                    // add
                    newFilter = currentFilter;
                    newFilter.push(['==', 'type', filter]);

                    self.filters.querySelector("#" + filter).classList.remove('inactive');
                }
                self._map.setFilter(layer, newFilter);

                self._map.setFilter('icons-active', ['==','type','']);
                self._interactionPopup.emptyArray();
            }

            if (layer === 'poi') {

                if (self._map.getFilter(layer)[0] === 'has') {
                    self._map.setFilter(layer, ['!has', 'name']);
                    self.filters.querySelector("#poi").classList.add('inactive');
                } else {
                    self._map.setFilter(layer, ['has', 'name']);
                    self.filters.querySelector("#poi").classList.remove('inactive');
                }
            }
    }

    _JS_filterLayer(map, layer, filter) {

        if (layer === 'poi') { filter = 'poi'; }

        let self = this,
            filteredContent;

        //remove popups
        self._map.closePopup();

        // remove all icons
        self._map.eachLayer(function (l) {
            if (l._icon) {
                l.remove();
            }
        });

        // adapt array with filters
        var inOptionArray = false;

        var index;
        self.filterArrayForJs.forEach(function (filterOption) {
            if (filterOption === filter) {
                inOptionArray = true;
            }
        });

        // adapt array
        if (inOptionArray) {
            index = self.filterArrayForJs.indexOf(filter);
            self.filterArrayForJs.splice(index, 1);
            self.filters.querySelector("#" + filter).classList.add('inactive');

        } else {
            self.filterArrayForJs.push(filter);
            console.log(filter);
            self.filters.querySelector("#" + filter).classList.remove('inactive');
        }

        // check if poi is still in array
        var hasPoi = false;
        self.filterArrayForJs.forEach(function (filterOption) {
            if (filterOption === 'poi') {
                hasPoi = true;
            }
        });

        if (hasPoi) {
            self._poi = new PoiLayer(self._map, self._config);
            self._poi.draw();
        }

        // new features for icon layer
        filteredContent = self._config.dataset.content.features.filter(function (feature) {
            var inFiltersArray = false;
            self.filterArrayForJs.forEach(function (filterOption) {
                if (feature.properties.type === filterOption) {
                    inFiltersArray = true
                }
            });

            if (inFiltersArray) {
                return feature;
            };
        });

        // if features redraw icon layer
        if (filteredContent.length > 0) {

            var filteredFeatureCollection = {
                type: "FeatureCollection",
                features: filteredContent
            }
        }

        // this._contentLayer = new ContentLayer(self._map, self._config);
        this._contentLayer.draw(filteredFeatureCollection);
    }
}
