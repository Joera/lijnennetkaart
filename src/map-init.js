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
            style: 'mapbox://styles/wijnemenjemee/cjcywszq502re2sobjc8d1e0z', // ',
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
            let d =
            this.config.dataset = JSON.parse(data);
        } else {
            this.config.dataset = {};
        }

        this.config.origins = self._filterOrigins(this.config.dataset);

        this._callToAction = document.getElementById('call-to-action');
        this._listContainer = document.getElementById('list-container');
        this._newRoute = document.getElementById('new-route');
        this._oldRoute = document.getElementById('old-route');
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
        self._lines = new Lines(self._map, self.config);
        self._points = new Points(self._map, self.config);

        self._map.on('style.load', function () {

            self._lines.draw();
            self._points.drawOrigins();
            self._points.drawDestinations();
            self._points.drawTransfers();

            self._originList();

            self._map.on("mouseover", "origins", function (e) {
                self._highlightOrigin(e.features[0].properties.naam);
            });

            self._map.on("click", "origins", function (e) {
                    self.session.origin = e.features[0].properties.id;
                    self._showDestinations();
            });

            self._map.on("click", "origin-labels", function (e) {
                self.session.origin = e.features[0].properties.id;
                self._showDestinations();
            });

            self._map.on("mouseover", "destinations", function (e) {
                self._highlightDestination(e.features[0].properties.naam);
            });

            self._map.on("click", "destinations", function (e) {
                self.session.destination = e.features[0].properties.id;
                self.session.traject = self.session.origin + '_' + self.session.destination;
                self._initRoute();
            });

            self._viewSelect.addEventListener("click",function() { self._switchView() },false);
            self._newOrigin.addEventListener("click",function() { self._clearOrigin() },false);
            self._newDestination.addEventListener("click",function() { self._clearDestination() },false);
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
                self.session.origin = o.properties.id;
                self._showDestinations();
            }, false);

            ul.appendChild(li);
        });

        self._listContainer.appendChild(ul);

    }

    _highlightOrigin(naam) {

        this._map.setFilter('origin-labels',['all', ["==", "function", "herkomst"],["==", "naam",naam]]);
        this._map.setFilter('origin-labels-connector',['all', ["==", "function", "herkomst"], ["==", "naam",naam]]);
    }

    _highlightDestination(naam) {

        this._map.setFilter('destination-labels',['all',["==","naam",naam],["==","isNieuw",false]]);
        this._map.setFilter('destination-labels-connector',['all',["==","naam",naam],["==","isNieuw",false]]);
    }

    _destinationList() {

        let self = this;
        self._listContainer.innerHTML = '';
        self._callToAction.innerHTML = '<span>Kies</span> een <span>bestemming</span>';

        let ul = document.createElement('ul');

        self.config.destinations.features.reverse().forEach( (o) => {

            let li = document.createElement('li');
            li.innerHTML = o.properties.naam;
            li.addEventListener('mouseover', function () {
                self._highlightDestination(o.properties.naam);
            }, false);
            li.addEventListener('click', function () {
                self.session.destination = o.properties.id;
                self.session.traject = self.session.origin + '_' + self.session.destination;
                self._initRoute();
            }, false);

            ul.appendChild(li);
        });

        self._listContainer.appendChild(ul);

    }

    _initRoute() {

        let self = this;

        self._map.flyTo({
            zoom: 10.2
        });

        self._oldRoute.style.opacity = 1;

        let destinationsFilter = self._map.getFilter('destinations');
        let destinationSelectedFilter = ["==", "id", self.session.destination];
        destinationsFilter.push(destinationSelectedFilter);
        self._map.setFilter('destinations',destinationsFilter);

        self._map.setFilter('bus-old',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        self._map.setFilter('bus-old-icon',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        self._map.setFilter('metro-old',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        self._map.setFilter('metro-old-icon',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        self._map.setFilter('tram-old',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        self._map.setFilter('tram-old-icon',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
        self._map.setFilter('transfers',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",false]]);
        self._map.setFilter('transfer-labels',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",false]]);

        self._setRouteInfo(false,self.session.traject);
        // self._setBoundingBox();

        self._oldRoute.addEventListener("click",function() { self._showOld(self.session.traject,self._map) },false);
        self._newRoute.addEventListener("click",function() { self._showNew(self.session.traject,self._map) },false);
    }

    _showDestinations() {

        let self = this;

        self.config.destinations = self._filterDestinations(self.config.dataset,self.session.origin);

        console.log(self.config.destinations.features.length);

        self._callToAction.style.background = purple;

        let originFilter = self._map.getFilter('origins');
        let originSelectedFilter = ["==", "id", self.session.origin];
        originFilter.push(originSelectedFilter);
        self._map.setFilter('origins',originFilter);
        self._map.setFilter('origin-labels',originFilter);
        self._map.setFilter('origin-labels-connector',originFilter);

        console.log(self.session.origin);

        self._map.setFilter('destinations',['all',["==","function","bestemming"],["==","originId",self.session.origin],["==","isNieuw",false]]); //
        self._map.flyTo({
            zoom: 12
        });

        self._destinationList();
    }

    _showNew(traject,map) {

        let self = this;

        self._map.setFilter('bus-new',['all',["==","transport_type","bus"],["==","isNieuw",true],["==","trajectId",traject]]);
        self._map.setFilter('metro-new',['all',["==","transport_type","metro"],["==","isNieuw",true],["==","trajectId",traject]]);
        self._map.setFilter('tram-new',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",traject]]);

        self._map.setFilter('bus-old',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",""]]);
        self._map.setFilter('metro-old',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",""]]);
        self._map.setFilter('tram-old',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",""]]);

        self._map.setFilter('transfers',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",true]]);
        self._map.setFilter('transfer-labels',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",true]]);

    }

    _showOld(traject,map) {

        let self = this;

        map.setFilter('bus-new',['all',["==","transport_type","bus"],["==","isNieuw",true],["==","trajectId",""]]);
        map.setFilter('metro-new',['all',["==","transport_type","metro"],["==","isNieuw",true],["==","trajectId",""]]);
        map.setFilter('tram-new',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",""]]);

        map.setFilter('bus-old',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",traject]]);
        map.setFilter('metro-old',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",traject]]);
        map.setFilter('tram-old',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",traject]]);

        map.setFilter('transfers',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",false]]);
        map.setFilter('transfer-labels',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject],["==","isNieuw",false]]);
    }

    _setRouteInfo(isNew,traject) {

        let self = this;

        self._listContainer.innerHTML = '';
        let routes = self._map.querySourceFeatures('lines', { filter : ['all',["!has","function"],["==","isNieuw",isNew],["==","trajectId",traject]]});

        routes = routes.filter( (obj, pos, arr) => {
            return (arr.map(mapObj => mapObj.properties.traject_name).indexOf(obj.properties.traject_name) === pos);
        });

        let ul = document.createElement('ul');
        let li = null;

        routes.forEach( function(f) {
            li = document.createElement('li');
            li.innerHTML = '<div class="title">' + f.properties.transport_type
                + ' ' + f.properties.transport_nrs + '</div> <div class="start">' + f.properties.start_naam + '</div> - <div class="end">' + f.properties.end_naam + '</div><div class="time">' + f.properties.reistijd + ' minuten</div>'
            ul.appendChild(li);
        });

        if(!isNew) {

            let button = document.createElement('li');
            button.classList.add('button');
            button.innerHTML = 'Toon nieuwe reis';
            button.addEventListener('click', function () {
                self._newRoute.style.opacity = 1;
                self._setRouteInfo(true, self.session.traject);
                self._showNew(self.session.traject,self._map);
            }, false);
            ul.appendChild(button);
        } else {
            document.getElementsByClassName('button').remove();
        }



        if(isNew) {
            self._newRoute.appendChild(ul);
        } else {
            self._oldRoute.appendChild(ul);
        }
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

    _filterDestinations(dataset,originID) {

        //console.log(originID);

        let unique = [];

        let features = dataset.features.filter( (obj, pos, arr) => {
            unique.push(obj.properties.naam);
            return obj.properties.originId === originID && obj.properties.function === 'bestemming' && obj.properties.isNieuw === false && unique.indexOf(obj.properties.naam < 0);  //
        });
        let collection = {
            "type": "FeatureCollection",
            "features": features
        }
        //console.log(collection);
        return collection;
    }

    _clearOrigin() {
        let self = this;
        this.session = {
            origin : null,
            destination : null
        }

        this._listContainer.innerHTML = '';
        self._clearRoutes();

        self._map.setFilter('origins',['all', ["==", "function", "herkomst"]]);
        self._map.setFilter('origin-labels',['all', ["==", "function", "herkomst"],["==","naam",""]]);
        self._map.setFilter('origin-labels-connector',['all', ["==", "function","herkomst"],["==","naam",""]]);

        self._map.setFilter('destinations',['all',["==","function",""]]);
        self._map.setFilter('destination-labels',['all',["==","function",""]]);
        self._map.setFilter('destination-labels-connector',['all',["==","function",""]]);

        self._originList();

    }

    _clearDestination() {
        let self = this;
        this.session.destination = null;
        this._listContainer.innerHTML = '';
        self._clearRoutes()
        self._showDestinations();
        self._destinationListList();
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

}
