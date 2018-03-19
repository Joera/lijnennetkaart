class Map {

    constructor(element, data, interaction) {

        this.element = document.getElementById(element);

        try {
            let dataConfig = this.element.getAttribute('data-config');
            this.customConfig = JSON.parse(dataConfig);
        } catch(err) {
            this.customConfig = [];
            console.log(err);
        }

        let self = this,
            activeItems = [];

        this.nightview = false;

        this.config = {
            accessToken: 'pk.eyJ1Ijoid2lqbmVtZW5qZW1lZSIsImEiOiJjaWgwZjB4ZGwwMGdza3FseW02MWNxcmttIn0.l-4VI25pfA5GKukRQTXnWA',
            style: 'mapbox://styles/wijnemenjemee/cjcywszq502re2sobjc8d1e0z',
            hostContainer: element,
            center: [4.9, 52.37],
            zoom: 10.2,
            pitch: 0,
            bearing: 0,
            scrollZoom: false
        }

        this.options = {
            filters : true,
            referenceList : true
        };

        this.session = {
            origin : null,
            destination : null
        }

        //data from argument in footer scripts (datasets)
        if (data) {
            this.config.origins = JSON.parse(data);
        } else {
            this.config.origins = {};
        }

        this.config.origins = JSON.parse(data);

        this._callToAction = document.getElementById('call-to-action');
        this._listContainer = document.getElementById('list-container');
        this._routeBlock = document.getElementById('route-block');
        this._routeSelect = document.getElementById('route-select');
        this._newOrigin = document.getElementById('new-origin');
        // this._newDestination = document.getElementById('new-destination');

        this.interactionPopup = new InteractionPopup();

    }

    init() {

        let self = this;

        const mapWebGL = new MapWebGL(self.config);
        self._map = mapWebGL.create();
        self._route = 'oud';

        self._background = new Background(self._map, self.config);
        self._origin = new Origin(self._map, self.config);
        self._points = new Points(self._map, self.config);
        self._lines = new Lines(self._map, self.config);

        self._map.on('style.load', function () {
            self._points.addOrigins();
            self._initMap();
        });

        self._newOrigin.addEventListener("click",function() { self._clearOrigin() },false);
    }

    _initMap() {

        let self = this;

        self._points.drawOrigins();
        self._originList();

        self._map.on("mouseover", "origins", function (e) {
            self._highlightOrigin(e.features[0].properties.naam);
        });
        self._map.on("click", "origin-labels", function (e) {
            self._selectOrigin(e.features[0].properties);
        });

    }

    _originList() {

        let self = this;
        self._callToAction.innerHTML = '<span>Kies</span> een <span>herkomst</span>';

        let ul = document.createElement('ul');

        self.config.origins.features.reverse().forEach( (o) => {

            let li = document.createElement('li');
            li.innerHTML = o.properties.naam;
            li.addEventListener('mouseover', function () {
                self._highlightOrigin(o.properties.naam);
            }, false);
            li.addEventListener('click', function () {
                self._selectOrigin(o.properties);
            }, false);

            ul.appendChild(li);
        });

        self._listContainer.appendChild(ul);

    }

    _highlightOrigin(naam) {

        this._map.setFilter('origin-labels',['all', ["==", "function", "herkomst"],["==", "naam",naam]]);
        this._map.setFilter('origin-labels-connector',['all', ["==", "function", "herkomst"], ["==", "naam",naam]]);
    }

    _selectOrigin(origin) {
            let self = this;
            self.session.origin = origin.id;

            // hide other destinations
            let originsFilter = self._map.getFilter('origins');
            let originsSelectedFilter = ["==", "id", self.session.origin];
            originsFilter.push(originsSelectedFilter);
            self._map.setFilter('origins',originsFilter);

            let filename = '';

            // Hoofddorp, Station
            if(origin.originId === '34294') {
                filename = 'features_Amstelland_Station_Hoofddorp';
            // Uithoorn, Busstation
            } else if(origin.originId === '10220') {
                filename = 'features_Amstelland_Uithoorn_Busstation';
            // Purmerend, Korenstraat
            } else if(origin.originId === '13412') {
                filename = 'features_Waterland_Korenstraat';
            // Volendam Stadskantoor
            } else if(origin.originId === '13527') {
                filename = 'features_Waterland_Stadskantoor';
            // Zaandam, Morgensterstraat
            } else if(origin.originId === '35250') {
                filename = 'features_Zaanstreek_Morgensterstraat';
            // Zaandam, Barkstraat
            } else if(origin.originId === '36003') { //
                filename = 'features_Zaanstreek_Noordwachter';
            }

            let url = 'features/' + filename + '.json';

            axios.get(url)
                .then(function(response) {
                    if (response.status !== 200) {
                        console.log('foutje bedankt')
                    }
                    self._data = {};
                    self._data.originData = response.data;

                    console.log(self._data.originData);

                    self._data.destinations = self._data.originData.find( (item) => {

                        return item.name === 'destinations';
                    })

                    if (self._map.getSource('destinations') === undefined) {
                        self._map.addSource("destinations", {
                            "type": "geojson",
                            "data": self._data.destinations
                        });
                    } else {
                        self._map.getSource('destinations').setData(self._data.destinations);
                    }

                    self._points.drawDestinations();
                    self._destinationList();

                    self._map.on("mouseover", "destinations", function (e) {
                        self._highlightDestination(e.features[0].properties.id);
                    });
                    self._map.on("click", "destination-labels", function (e) {
                        self._initRoute(e.features[0].properties.id);
                    });
                });
    }

    _highlightDestination(id) {

        let self = this;
        self._data.destinations.features.forEach( function(d) {
            d.properties.state = 'inactive';
            if (d.properties.id === id) {
                d.properties.state = 'highlighted';
            }
        });
        this._map.getSource('destinations').setData(self._data.destinations);
    }

    _activateDestination(id) {

        let self = this;
        self._data.destinations.features.forEach( function(d) {
            d.properties.state = 'inactive';
            if (d.properties.id === id) {
                d.properties.state = 'active';
            }
        });
        this._map.getSource('destinations').setData(self._data.destinations);
    }

    _destinationList() {

        let self = this;
        self._listContainer.innerHTML = '';
        self._callToAction.innerHTML = '<span>Kies</span> een <span>bestemming</span>';

        let ul = document.createElement('ul');

        self._data.destinations.features.sort(function(a,b) {
            return (a.properties.naam > b.properties.naam) ? 1 : ((b.properties.naam > a.properties.naam) ? -1 : 0);
        });

        self._data.destinations.features.forEach( (o) => {

            let li = document.createElement('li');
            li.innerHTML = o.properties.naam;
            li.addEventListener('mouseover', function () {
                self._highlightDestination(o.properties.id);
            }, false);
            li.addEventListener('click', function () {
                self._initRoute(o.properties.id);
            }, false);

            ul.appendChild(li);
        });

        self._listContainer.appendChild(ul);

    }

    _initRoute(destination) {



        let self = this;

        // remove previous route layers
        self._map.getStyle().layers.forEach( (l) => {
            if(l.id.indexOf('route-') > -1 || l.id.indexOf('transfer') > -1) {
                self._map.removeLayer(l.id);
            }
        });

        // add selected destination to session
        self.session.destination = destination;
        self.session.traject = self.session.origin + '_' + destination;

        self._activateDestination(destination);

        self._data.traject = self._data.originData.find( (route) => {

            if(route[0] && route[0] && route[0].features && route[0].features.length > 0) {
                return route[0].features[0].properties.trajectId.split('_')[1] === destination;
            }
        });

        self._setRouteInfo(self._data.traject);

        self._data.traject.forEach( (r) => {

            if (self._map.getSource('route-' + r.features[0].properties.routeId) === undefined) {
                self._map.addSource('route-' + r.features[0].properties.routeId, {
                    "type": "geojson",
                    "data": r
                });
            } else {
                self._map.getSource('route-' + r.features[0].properties.routeId).setData(r);
            }
        });

        self._data.traject.forEach( (r) => {

            self._map.addLayer({
                "id": 'route-' + r.features[0].properties.routeId + '-bus_old',
                "type": "line",
                "source": 'route-' + r.features[0].properties.routeId,
                "layout": {
                    "line-join": "miter",
                    "line-cap": "square",
                    "visibility": "visible"
                },
                "paint": {
                    "line-color": {
                        property: 'routeVersion',
                        type: 'categorical',
                        stops: [
                            ['prio', black],
                            ['alt', '#999']
                        ]
                    },
                    "line-width": 4,
                    "line-dasharray": [1,0]
                    // "line-translate": [-4,-4]
                },
                "filter": ['all',
                    ["==","isNieuw",false],
                    ["==","transport_type","bus"]
                ]
            },'origins');

            self._map.addLayer({
                "id": 'route-' + r.features[0].properties.routeId + '-bus_new',
                "type": "line",
                "source": 'route-' + r.features[0].properties.routeId,
                "layout": {
                    "line-join": "miter",
                    "line-cap": "square",
                    "visibility": "visible"
                },
                "paint": {
                    "line-color": {
                        property: 'routeVersion',
                        type: 'categorical',
                        stops: [
                            ['prio', purple],
                            ['alt', pink]
                        ]
                    },
                    "line-width": 4,
                    "line-dasharray": [4,4],

                },
                "filter": ['all',
                    ["==","isNieuw",true],
                    ["==","transport_type","bus"]
                ]
            },'origins');

            self._map.addLayer({
                "id": 'route-' + r.features[0].properties.routeId + '-tram_old',
                "type": "line",
                "source": 'route-' + r.features[0].properties.routeId,
                "layout": {
                    "line-join": "miter",
                    "line-cap": "square",
                    "visibility": "visible"
                },
                "paint": {
                    "line-color": {
                        property: 'routeVersion',
                        type: 'categorical',
                        stops: [
                            ['prio', black],
                            ['alt', '#999']
                        ]
                    },
                    "line-width": 4,
                    "line-dasharray": [1,0],

                    // "line-translate": [-4,-4]
                },
                "filter": ['all',
                    ["==","isNieuw",false],
                    ["==","transport_type","tram"]
                ]
            },'origins');

            self._map.addLayer({
                "id": 'route-' + r.features[0].properties.routeId + '-tram_new',
                "type": "line",
                "source": 'route-' + r.features[0].properties.routeId,
                "layout": {
                    "line-join": "miter",
                    "line-cap": "square",
                    "visibility": "visible"
                },
                "paint": {
                    "line-color": {
                        property: 'routeVersion',
                        type: 'categorical',
                        stops: [
                            ['prio', purple],
                            ['alt', pink]
                        ]
                    },
                    "line-width": 4,
                    "line-dasharray": [1,1],

                },
                "filter": ['all',
                    ["==","isNieuw",true],
                    ["==","transport_type","tram"]
                ]
            },'origins');


            self._map.addLayer({
                "id": 'route-' + r.features[0].properties.routeId + '-metro_old',
                "type": "line",
                "source": 'route-' + r.features[0].properties.routeId,
                "layout": {
                    "line-join": "miter",
                    "line-cap": "square",
                    "visibility": "visible"
                },
                "paint": {
                    "line-color": {
                        property: 'routeVersion',
                        type: 'categorical',
                        stops: [
                            ['prio', purple],
                            ['alt', pink]
                        ]
                    },
                    "line-width": 4,
                    "line-dasharray": [1,1],

                },
                "filter": ['all',
                    ["==","isNieuw",false],
                    ["==","transport_type","metro"],
                ]
            },'origins');

            self._map.addLayer({
                "id": 'route-' + r.features[0].properties.routeId + '-metro_new',
                "type": "line",
                "source": 'route-' + r.features[0].properties.routeId,
                "layout": {
                    "line-join": "miter",
                    "line-cap": "square",
                    "visibility": "visible"
                },
                "paint": {
                    "line-color": {
                        property: 'routeVersion',
                        type: 'categorical',
                        stops: [
                            ['prio', purple],
                            ['alt', '#999']
                        ]
                    },
                    "line-width": 4,
                    "line-dasharray": [.5,.5],

                    // "line-translate": [-4,-4]
                },
                "filter": ['all',
                    ["==","isNieuw",true],
                    ["==","transport_type","metro"]
                ]
            },'origins');

            self._map.addLayer({
                "id": 'route-' + r.features[0].properties.routeId + '-train_old',
                "type": "line",
                "source": 'route-' + r.features[0].properties.routeId,
                "layout": {
                    "line-join": "miter",
                    "line-cap": "square",
                    "visibility": "visible"
                },
                "paint": {
                    "line-color": {
                        property: 'routeVersion',
                        type: 'categorical',
                        stops: [
                            ['prio', purple],
                            ['alt', pink]
                        ]
                    },
                    "line-width": 4,
                    "line-dasharray": [1,1],

                },
                "filter": ['all',
                    ["==","isNieuw",true],
                    ["==","transport_type","trein"]
                ]
            },'origins');

            self._map.addLayer({
                "id": 'route-' + r.features[0].properties.routeId + '-train_new',
                "type": "line",
                "source": 'route-' + r.features[0].properties.routeId,
                "layout": {
                    "line-join": "miter",
                    "line-cap": "square",
                    "visibility": "visible"
                },
                "paint": {
                    "line-color": {
                        property: 'routeVersion',
                        type: 'categorical',
                        stops: [
                            ['prio', purple],
                            ['alt', pink]
                        ]
                    },
                    "line-width": 4,
                    "line-dasharray": [1,1],

                },
                "filter": ['all',
                    ["==","isNieuw",true],
                    ["==","transport_type","trein"]
                ]
            },'origins');

            self._points.drawTransfers(r.features[0].properties.routeId);

            // setTimeout( function() {
            //
            //     if (self._route === 'oud') {
            //             self._showOld(r.features[0].properties.routeId);
            //         } else {
            //             self._showNew(r.features[0].properties.routeId);
            //         }
            //     },3000);

        });

    }

    _showDestinations() {

        let self = this;
        let params = {};
        params.layers = ['destinations'];
        self.config.destinations = self._filterDestinations(self._map.queryRenderedFeatures(params));
    }


    _setRouteInfo(traject) {

        let self = this;

        self._routeBlock.innerHTML = '';
        let header = document.createElement('h3');
        header.innerHTML = traject[0].features[0].properties.trajectNaam;
        let ul = document.createElement('ul');

        let routeSelect = document.createElement('div');
        routeSelect.id = "route-select";
        let switchHTML = ` <div id=>
            <label class="switch">
            <input id="route-switch" type="checkbox">
            <span class="slider round"></span>
            <span class="label checked">Nieuw</span>
            <span class="label unchecked">Huidig</span>
            </label>`;

        routeSelect.innerHTML = switchHTML;
        if (self._route === 'nieuw') {
            // checkbox op checked zetten
        }

        let routeIds = [];

            traject.forEach( (r) => {

            let q;

            if (r.features && r.features[0].properties.isNieuw === true) {
                q = 'Nieuwe route';
            } else {
                q = 'Huidige route';
            }
            // if (r.features[0].properties.routeVersion === 'firstAlt' || r.features[0].properties.routeVersion === 'secondAlt') {
            //     q = q + ' ' + '(alternatief)';
            // }

            let li = document.createElement('li');
            let input = document.createElement('input');
            input.type = "checkbox";
            input.name = r.features[0].properties.routeId;
            input.checked = true;
            li.appendChild(input);
            let label = document.createElement('label');
            label.innerHTML = q;
            li.appendChild(label);
            let segmentList = document.createElement('ul');
            r.features.forEach ((f) => {

                console.log(f);

                if(f.geometry.type === 'LineString') {

                    let nrs;
                    if(f.properties.transport_type !== 'trein') {
                        nrs = f.properties.transport_nrs.join(' ');
                    } else {
                        nrs = '';
                    }

                    let segment = document.createElement('li');
                    let segmentContent = '<span>' + f.properties.transport_type
                        + '</span> <span>' + nrs
                        + '</span><span> : </span><span>' + f.properties.start_naam
                        + '</span><span> - </span></span><span>' + f.properties.end_naam
                        + '</span>';
                    segment.innerHTML = segmentContent;
                    segmentList.appendChild(segment);
                }
            });
            li.appendChild(segmentList);
            li.addEventListener("click", function (e) {
                self._toggleRoute(e,r.features[0].properties.routeId);
            }, false);
            ul.appendChild(li);

            routeIds.push(r.features[0].properties.routeId);

        });
        console.log('hwswi');
        // routeSelect.addEventListener("click",function() {  self._routeSwitch(routeIds) },false)
        self._routeBlock.appendChild(routeSelect);
        self._routeBlock.appendChild(header);
        self._routeBlock.appendChild(ul);

    }

    // _toggleRoute(e,routeId) {
    //
    //     let self = this;
    //
    //     let checkbox = e.target.parentElement.querySelector('input[type=checkbox]');
    //     let extraFilter = ["!=","routeId",checkbox.name];
    //     let metro_new = self._map.getFilter('route-' + routeId + '-metro_new');
    //     let bus_new = self._map.getFilter('route-' + routeId + '-bus_new');
    //     let tram_new = self._map.getFilter('route-' + routeId + '-tram_new');
    //     let train_new = self._map.getFilter('route-' + routeId +'-train_new');
    //
    //     let metro_old = self._map.getFilter('route-' + routeId + '-metro_old');
    //     let bus_old = self._map.getFilter('route-' + routeId + '-bus_old');
    //     let tram_old = self._map.getFilter('route-' + routeId + '-tram_old');
    //     let train_old = self._map.getFilter('route-' + routeId + '-train_old');
    //
    //     let transfers = self._map.getFilter('transfers-' + routeId);
    //
    //
    //     if(checkbox.checked === false) {
    //         // console.log(extraFilter);
    //         metro_new.push(extraFilter);
    //         bus_new.push(extraFilter);
    //         tram_new.push(extraFilter);
    //         train_new.push(extraFilter);
    //         metro_old.push(extraFilter);
    //         bus_old.push(extraFilter);
    //         tram_old.push(extraFilter);
    //         train_old.push(extraFilter);
    //         transfers.push(extraFilter);
    //
    //     } else {
    //         // let i = metro_new.findIndex( (f) => {
    //         //     console.log(f[0]);
    //         //     f[0] == '!='; // && f[2] === checkbox.name;
    //         // });
    //         // console.log(i);
    //         // if (i > -1) {
    //         //     metro_new = metro_new.splice(i,1);
    //         //     console.log(metro_new);
    //         // }
    //         metro_new.pop();
    //         bus_new.pop();
    //         tram_new.pop();
    //         train_new.pop();
    //         metro_old.pop();
    //         bus_old.pop();
    //         tram_old.pop();
    //         train_old.pop();
    //         transfers.pop();
    //
    //     }
    //
    //     self._map.setFilter('route-' + routeId + '-metro_new',metro_new);
    //     self._map.setFilter('route-' + routeId + '-bus_new',bus_new);
    //     self._map.setFilter('route-' + routeId + '-tram_new',tram_new);
    //     self._map.setFilter('route-' + routeId + '-train_new',train_new);
    //
    //
    //     self._map.setFilter('route-' + routeId + '-metro_old',metro_old);
    //     self._map.setFilter('route-' + routeId + '-bus_old',bus_old);
    //     self._map.setFilter('route-' + routeId + '-tram_old',tram_old);
    //     self._map.setFilter('route-' + routeId + '-train_old',train_old);
    //     console.log(transfers);
    //     self._map.setFilter('transfers-' + routeId, transfers);
    // }

    _showNew(routeId) {

        let self = this;

        console.log('show new');

        self._map.setLayoutProperty('route-' + routeId + '-bus_new', 'visibility', 'visible');
        self._map.setLayoutProperty('route-' + routeId + '-metro_new', 'visibility', 'visible');
        self._map.setLayoutProperty('route-' + routeId + '-tram_new', 'visibility', 'visible');
        self._map.setLayoutProperty('route-' + routeId + '-train_new', 'visibility', 'visible');

        self._map.setLayoutProperty('route-' + routeId + '-bus_old', 'visibility', 'none');
        self._map.setLayoutProperty('route-' + routeId + '-metro_old', 'visibility', 'none');
        self._map.setLayoutProperty('route-' + routeId + '-tram_old', 'visibility', 'none');
        self._map.setLayoutProperty('route-' + routeId + '-train_old', 'visibility', 'none');

        self._map.setLayoutProperty('transfers-' + routeId + '-new', 'visibility', 'visible');
        self._map.setLayoutProperty('transfers-' + routeId + '-old', 'visibility', 'none');
    }

    _showOld(routeId) {

        let self = this;

        console.log('show old');

        self._map.setLayoutProperty('route-' + routeId + '-bus_new', 'visibility', 'none');
        self._map.setLayoutProperty('route-' + routeId + '-metro_new', 'visibility', 'none');
        self._map.setLayoutProperty('route-' + routeId + '-tram_new', 'visibility', 'none');
        self._map.setLayoutProperty('route-' + routeId + '-train_new', 'visibility', 'none');

        self._map.setLayoutProperty('route-' + routeId + '-bus_old', 'visibility', 'visible');
        self._map.setLayoutProperty('route-' + routeId + '-metro_old', 'visibility', 'visible');
        self._map.setLayoutProperty('route-' + routeId + '-tram_old', 'visibility', 'visible');
        self._map.setLayoutProperty('route-' + routeId + '-train_old', 'visibility', 'visible');

        self._map.setLayoutProperty('transfers-' + routeId + '-new', 'visibility', 'visible');
        self._map.setLayoutProperty('transfers-' + routeId + '-old', 'visibility', 'none');

    }

    _setBoundingBox() {

        let self = this;
        let features = self._map.queryRenderedFeatures({ layers: ['origins','destinations','transfers'] });

        let collection = {
            "type": "FeatureCollection",
            "features": features
        }
        let bbox = turf.bbox(collection);

        self._map.fitBounds(
            bbox, {
            padding: {top: 100, bottom:100, left: 100, right: 100},
            linear: true
        });
    }

    _routeSwitch(routeIds) {

        console.log('once please');

        let self = this;

        if(this._route === 'old') {
            this._route = 'nieuw';
        } else {
            this._route = 'old';
        }

        routeIds.forEach ( (rid) => {

            if(this._route === 'old') {
                self._showNew(rid);
            } else {
                self._showOld(rid);
            }
        });
    }

    _filterOrigins(dataset) {
        let features = dataset.features.filter( (obj, pos, arr) => {
            return (arr.map(mapObj => mapObj.properties.naam).indexOf(obj.properties.naam) === pos) && obj.properties.function == 'herkomst';
        });
        let collection = {
            "type": "FeatureCollection",
            "features": features
        }
        return collection;
    }

    _filterDestinations(features) {
        let unique = [];
        return features.filter( (obj) => {
            if(unique.indexOf(obj.properties.naam) > -1) {
                return false
            } else {
                unique.push(obj.properties.naam);
                return true;
            }
        });
    }

    _filterRoutes(routes) {

        let unique = [];
        return routes.filter( (obj) => {
            if(unique.indexOf(obj.start_id) > -1) {
                return false
            } else {
                unique.push(obj.start_id);
                return true;
            }
        });
    }

    _clearOrigin() {
        let self = this;
        this.session = {
            origin : null,
            destination : null
        }
        this._listContainer.innerHTML = '';

        // remove previous route layers
        self._map.getStyle().layers.forEach( (l) => {
            if(l.id.indexOf('route-') > -1 || l.id.indexOf('origin') > -1 || l.id.indexOf('destination') > -1 ) {
                self._map.removeLayer(l.id);
            }
        });

        self._initMap();
    }
}
