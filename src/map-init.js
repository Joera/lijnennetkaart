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
        this._viewSelect = document.getElementById('view-select');
        this._newOrigin = document.getElementById('new-origin');
        this._newDestination = document.getElementById('new-destination');

        this.interactionPopup = new InteractionPopup();

    }

    init() {

        let self = this;

        const mapWebGL = new MapWebGL(self.config);
        self._map = mapWebGL.create();

        self._background = new Background(self._map, self.config);
        self._origin = new Origin(self._map, self.config);
        self._points = new Points(self._map, self.config);
        self._lines = new Lines(self._map, self.config);

        self._map.on('style.load', function () {
            self._points.addOrigins();
            self._initMap();
        });
    }

    _initMap() {

        let self = this;

        if(self._map.getLayer('destinations') != undefined) {
            self._map.removeLayer('destinations');
        }
        if(self._map.getLayer('destination-labels') != undefined) {
            self._map.removeLayer('destination-labels');
        }
        if(self._map.getLayer('destination-labels-connector') != undefined) {
            self._map.removeLayer('destination-labels-connector');
        }

        if(self._map.getSource('originData') != undefined) {
            self._map.removeSource('originData');
        }

        self._points.drawOrigins();
        self._originList();

        self._map.on("mouseover", "origins", function (e) {
            self._highlightOrigin(e.features[0].properties.naam);
        });
        self._map.on("click", "origin-labels", function (e) {
            self.session.origin = e.features[0].properties.id;
            self._selectOrigin(e.features[0].properties);
        });

        self._viewSelect.addEventListener("click",function() { self._switchView() },false);
        self._newOrigin.addEventListener("click",function() { self._clearOrigin() },false);
        self._newDestination.addEventListener("click",function() { self._clearDestination() },false);
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
                self.session.origin = o.properties.id;
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


        // hide other origins

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

        this._map.addSource('originData', {
            type: 'geojson',
            data: 'features/' + filename + '.json'
        });

        self._points.drawDestinations();
        self._lines.draw();
        self._points.drawTransfers();

        function onSourceData(e){
            if(e.isSourceLoaded) {
                self._map.off('sourcedata', onSourceData);
                setTimeout( function () {
                    self._showDestinations();
                    self._destinationList();
                },1000);
            }
        };

        self._map.on('sourcedata', onSourceData)

    }

    _highlightDestination(id) {

        console.log(id);

        this._map.setFilter('destination-labels',['all',["==","function","bestemming"],["==","id",id],["==","isNieuw",true]]);
        this._map.setFilter('destination-labels-connector',['all',["==","function","bestemming"],["==","id",id],["==","isNieuw",true]]);
    }

    _destinationList() {

        let self = this;
        self._listContainer.innerHTML = '';
        self._callToAction.innerHTML = '<span>Kies</span> een <span>bestemming</span>';

        let ul = document.createElement('ul');

        self.config.destinations = self._removeAdam(self.config.destinations);

        self.config.destinations.sort(function(a,b) {
            return (a.properties.naam > b.properties.naam) ? 1 : ((b.properties.naam > a.properties.naam) ? -1 : 0);
        });

        self.config.destinations.forEach( (o) => {

            let li = document.createElement('li');
            li.innerHTML = o.properties.naam;
            li.addEventListener('mouseover', function () {
                self._highlightDestination(o.properties.id);
            }, false);
            li.addEventListener('click', function () {
                console.log(o.properties);
                // moet dit wel de id zijn?
                // evt het tweede deel van
                self._initRoute(o.properties.trajectId.split('_')[1]);
            }, false);

            ul.appendChild(li);
        });

        self._listContainer.appendChild(ul);

    }

    _removeAdam(destinations) {

        destinations.forEach( (dest) => {

            if(dest.properties.naam.indexOf('Amsterdam') > -1) {
                dest.properties.naam = dest.properties.naam.slice(11,dest.properties.naam.length);
            }
        });
        return destinations;
    }

    _initRoute(destination) {

        let self = this;

        // add selected destination to session
        self.session.destination = destination;
        self.session.traject = self.session.origin + '_' + destination;

        // hide other destinations
        let destinationsFilter = self._map.getFilter('destinations');
        let destinationSelectedFilter = ["==", "id", self.session.destination];
        destinationsFilter.push(destinationSelectedFilter);
        self._map.setFilter('destinations',destinationsFilter);
        self._map.setPaintProperty('destinations','circle-color', '#fff');
        self._map.setPaintProperty('destinations','circle-stroke-color','#000');
        self._map.setLayoutProperty('destination-labels','icon-image','rect_black');
        self._map.setLayoutProperty('destination-labels-connector','icon-image','connector_black');
        self._highlightDestination(destination);



        // show routes
        self._showOld(self.session.traject,self._map);
        self._showNew(self.session.traject,self._map);
        self._setRouteInfo(self.session.traject);


        // self._oldRoute.style.opacity = 1;

        // self._map.setFilter('bus-old',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        // self._map.setFilter('bus-old-icon',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        // self._map.setFilter('metro-old',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        // self._map.setFilter('metro-old-icon',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        // self._map.setFilter('tram-old',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        // self._map.setFilter('tram-old-icon',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        // self._map.setFilter('transfers',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",false]]);
        // self._map.setFilter('transfer-labels',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",false]]);
        //
        // self._setRouteInfo(false,self.session.traject);
        // self._setBoundingBox();

        // self._oldRoute.addEventListener("click",function() { self._showOld(self.session.traject,self._map) },false);
        // self._newRoute.addEventListener("click",function() { self._showNew(self.session.traject,self._map) },false);
    }



    _showDestinations() {

        let self = this;
        let params = {};
        params.layers = ['destinations'];
        self.config.destinations = self._filterDestinations(self._map.queryRenderedFeatures(params));
    }

    _showNew(traject,map) {

        let self = this;

        self._map.setFilter('bus-new',['all',["==","transport_type","bus"],["==","isNieuw",true],["==","trajectId",traject]]);
        self._map.setFilter('metro-new',['all',["==","transport_type","metro"],["==","isNieuw",true],["==","trajectId",traject]]);
        self._map.setFilter('tram-new',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",traject]]);
        self._map.setFilter('train-new',['all',["==","transport_type","trein"],["==","isNieuw",false],["==","trajectId",traject]]);

        self._map.setFilter('transfers',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",true]]);
        self._map.setFilter('transfer-labels',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",true]]);

    }

    _showOld(traject,map) {

        let self = this;

        map.setFilter('bus-old',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",traject]]);
        map.setFilter('metro-old',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",traject]]);
        map.setFilter('tram-old',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",traject]]);
        map.setFilter('train-old',['all',["==","transport_type","trein"],["==","isNieuw",false],["==","trajectId",traject]]);

        map.setFilter('transfers',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",false]]);
        map.setFilter('transfer-labels',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",false]]);
    }

    _setRouteInfo(traject) {

        let self = this;

        self._routeBlock.innerHTML = '';
        let routes = self._map.querySourceFeatures(['originData'], { filter : ['all',["!has","function"],["==","trajectId",traject]]});  ///

        console.log(routes);

        let array = [];
        routes.forEach( (r) => {
            array.push(r.properties);
        });
        let grouped = self._groupBy(array,'routeId');

        for (var g in grouped) {
            grouped[g] = self._filterRoutes(grouped[g]);
        }

        let header = document.createElement('h3');



        let routesInArray = grouped[Object.keys(grouped)[0]];

        console.log(routesInArray);

        header.innerHTML = routesInArray[0].trajectNaam;
        let ul = document.createElement('ul');

        for (var s in grouped) {
            let q;
            if (grouped[s][0].isNieuw === true) {
                q = 'Nieuwe route';
            } else {
                q = 'Huidige route';
            }
            if (grouped[s][0].routeVersion === 'firstAlt' || grouped[s][0].routeVersion === 'secondAlt') {
                q = q + ' ' + '(alternatief)';
            }

            let li = document.createElement('li');
            let input = document.createElement('input');
            input.type = "checkbox";
            input.name = grouped[s][0].routeId;
            input.checked = true;
            li.appendChild(input);
            let label = document.createElement('label');
            label.innerHTML = q;
            li.appendChild(label);
            li.addEventListener("click", function (e) {
                self._toggleRoute(e);
            }, false);
            ul.appendChild(li);
        }

        self._routeBlock.appendChild(header);
        self._routeBlock.appendChild(ul);

    }

    _toggleRoute(route) {

        let self = this;

        let checkbox = route.target.parentElement.querySelector('input[type=checkbox]');
        let extraFilter = ["!=","routeId",checkbox.name];
        let metro_new = self._map.getFilter('metro-new');
        let bus_new = self._map.getFilter('bus-new');
        let tram_new = self._map.getFilter('tram-old');
        let train_new = self._map.getFilter('train-new');
        let metro_old = self._map.getFilter('metro-old');
        let bus_old = self._map.getFilter('bus-old');
        let tram_old = self._map.getFilter('tram-old');
        let train_old = self._map.getFilter('train-old');
        if(checkbox.checked === false) {
            // console.log(extraFilter);
            metro_new.push(extraFilter);
            bus_new.push(extraFilter);
            tram_new.push(extraFilter);
            train_new.push(extraFilter);
            metro_old.push(extraFilter);
            bus_old.push(extraFilter);
            tram_old.push(extraFilter);
            train_old.push(extraFilter);
        } else {
            // let i = metro_new.findIndex( (f) => {
            //     console.log(f[0]);
            //     f[0] == '!='; // && f[2] === checkbox.name;
            // });
            // console.log(i);
            // if (i > -1) {
            //     metro_new = metro_new.splice(i,1);
            //     console.log(metro_new);
            // }
            metro_new.pop();
            bus_new.pop();
            tram_new.pop();
            train_new.pop();
            metro_old.pop();
            bus_old.pop();
            tram_old.pop();
            train_old.pop();

        }

        self._map.setFilter('metro-new',metro_new);
        self._map.setFilter('bus-new',bus_new);
        self._map.setFilter('tram-new',tram_new);
        self._map.setFilter('train-new',train_new);

        self._map.setFilter('metro-old',metro_old);
        self._map.setFilter('bus-old',bus_old);
        self._map.setFilter('tram-old',tram_old);
        self._map.setFilter('train-old',train_old);
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

    _switchView() {
        let self = this;

        if (this.nightview) {

            this.nightview = false;
            self._map.setStyle('mapbox://styles/wijnemenjemee/cjcywszq502re2sobjc8d1e0z');
            self._viewSelect.innerHTML = 'nacht';
            self._map.setPaintProperty('bus-old', 'line-color', black);
            self._map.setPaintProperty('bus-new', 'line-color', black);
            self._map.setPaintProperty('tram-old', 'line-color', black);
            self._map.setPaintProperty('tram-new', 'line-color', black);
            self._map.setPaintProperty('metro-old', 'line-color', black);
            self._map.setPaintProperty('metro-new', 'line-color', black);
        } else {
            this.nightview = true;
            self._map.setStyle('mapbox://styles/wijnemenjemee/cjdvrcqvn6dy32smopkqhd9q3');
            self._viewSelect.innerHTML = 'dag';
            self._map.setPaintProperty('bus-old', 'line-color', white);
            self._map.setPaintProperty('bus-new', 'line-color', white);
            self._map.setPaintProperty('tram-old', 'line-color', white);
            self._map.setPaintProperty('tram-new', 'line-color', white);
            self._map.setPaintProperty('metro-old', 'line-color', white);
            self._map.setPaintProperty('metro-new', 'line-color', white);
        }
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
        self._initMap();
    }

    _clearDestination() {
        let self = this;
        this.session.destination = null;
        this._listContainer.innerHTML = '';
        // self._clearRoutes()
        self._showDestinations();
        self._destinationList();
    }

    _clearRoutes() {

        let self = this;

        this._newRoute.innerHTML = '';
        this._oldRoute.innerHTML = '';

        self._map.setFilter('bus-new',['all',["==","transport_type","bus"],["==","isNieuw",true],["==","trajectId",""]]);
        self._map.setFilter('metro-new',['all',["==","transport_type","metro"],["==","isNieuw",true],["==","trajectId",""]]);
        self._map.setFilter('tram-new',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",""]]);

        self._map.setFilter('bus-old',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",""]]);
        self._map.setFilter('metro-old',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",""]]);
        self._map.setFilter('tram-old',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",""]]);

        self._map.setFilter('bus-old-icon',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",""]]);
        self._map.setFilter('metro-old-icon',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",""]]);
        self._map.setFilter('tram-old-icon',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",""]]);

        self._map.setFilter('transfers',['all',["==", "function", "overstap"],["==", "trajectId",""],["==","isNieuw",true]]);
        self._map.setFilter('transfer-labels',['all',["==", "function", "overstap"],["==", "trajectId",""],["==","isNieuw",true]]);
    }

    _groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

}
