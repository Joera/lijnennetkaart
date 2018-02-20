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
            let d =
            this.config.dataset = JSON.parse(data);
        } else {
            this.config.dataset = {};
        }

        this._callToAction = document.getElementById('call-to-action');
        this._newRoute = document.getElementById('new-route');
        this._oldRoute = document.getElementById('old-route');

        this.interactionPopup = new InteractionPopup();

    }

    init() {

        let self = this;

        const mapWebGL = new MapWebGL(self.config);
        self._map = mapWebGL.create();

        self._background = new Background(self._map, self.config);
        self._lines = new Lines(self._map, self.config);
        self._points = new Points(self._map, self.config);

        // self._background.init();

        self._map.on('style.load', function () {

            
            self._lines.draw();
            self._points.drawOrigins();
            self._points.drawDestinations();
            self._points.drawTransfers();

            self._callToAction.innerHTML = 'Kies een herkomst in uw buurt';


            self._map.on("click", "origins", function (e) {

                self._callToAction.innerHTML = 'Kies een bestemming in de stad';
                self._callToAction.style.background = rood;

                self.session.origin = e.features[0].properties.id;

                let originFilter = self._map.getFilter('origins');
                let originSelectedFilter = ["==", "id", self.session.origin];
                originFilter.push(originSelectedFilter);
                self._map.setFilter('origins',originFilter);

                self._map.setFilter('destinations',['all',["==","function","bestemming"]]);
            });

            self._map.on("click", "destinations", function (e) {

                self.session.destination = e.features[0].properties.id;
                self.session.traject = self.session.origin + '_' + self.session.destination;

                self._oldRoute.style.opacity = 1;

                console.log(self.session);

                let destinationsFilter = self._map.getFilter('destinations');
                let destinationSelectedFilter = ["==", "id", self.session.destination];
                destinationsFilter.push(destinationSelectedFilter);
                self._map.setFilter('destinations',destinationsFilter);

                self._map.setFilter('bus-old',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
                self._map.setFilter('metro-old',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
                self._map.setFilter('tram-old',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",self.session.traject]]);
                self._map.setFilter('transfers',['all',["==", "function", "overstap"],["==", "trajectId", self.session.traject]]);

                self._setRouteInfo(false,self.session.traject);
                self._setBoundingBox();

                setTimeout( function() {
                    self._newRoute.style.opacity = 1;
                    self._showNew(self.session.traject,self._map);
                    self._setRouteInfo(true,self.session.traject);
                },2000);

                self._oldRoute.addEventListener("click",function() { self._showOld(self.session.traject,self._map) },false);
                self._newRoute.addEventListener("click",function() { self._showNew(self.session.traject,self._map) },false);
            });
        });
    }

    _showNew(traject,map) {

        let self = this;

        map.setFilter('bus-new',['all',["==","transport_type","bus"],["==","isNieuw",true],["==","trajectId",traject]]);
        map.setFilter('metro-new',['all',["==","transport_type","metro"],["==","isNieuw",true],["==","trajectId",traject]]);
        map.setFilter('tram-new',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",traject]]);

        map.setFilter('bus-old',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",""]]);
        map.setFilter('metro-old',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",""]]);
        map.setFilter('tram-old',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",""]]);
    }

    _showOld(traject,map) {

        let self = this;

        map.setFilter('bus-new',['all',["==","transport_type","bus"],["==","isNieuw",true],["==","trajectId",""]]);
        map.setFilter('metro-new',['all',["==","transport_type","metro"],["==","isNieuw",true],["==","trajectId",""]]);
        map.setFilter('tram-new',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",""]]);

        map.setFilter('bus-old',['all',["==","transport_type","bus"],["==","isNieuw",false],["==","trajectId",traject]]);
        map.setFilter('metro-old',['all',["==","transport_type","metro"],["==","isNieuw",false],["==","trajectId",traject]]);
        map.setFilter('tram-old',['all',["==","transport_type","tram"],["==","isNieuw",false],["==","trajectId",traject]]);
    }

    _setRouteInfo(isNew,traject) {

        let self = this;

        let routes = self._map.querySourceFeatures('lines', { filter : ['all',["!has","function"],["==","isNieuw",isNew],["==","trajectId",traject]]});
        let ul = document.createElement('ul');
        let li = null;

        routes.forEach( function(f) {
            console.log(f.properties);
            li = document.createElement('li');
            li.innerHTML = '<div class="title">' + f.properties.transport_type
                + ' ' + f.properties.transport_nrs + '</div> <div class="start">' + f.properties.start_naam + '</div><div class="end">' + f.properties.end_naam + '</div><div class="time">' + f.properties.reistijd
            ul.appendChild(li);
        });

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

}
