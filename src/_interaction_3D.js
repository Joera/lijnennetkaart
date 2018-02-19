class Interaction3D {

    constructor(map,config){
        this._map = map;
        this._config = config;
        this.button_2d = null;
        this.button_3d = null;
        // this.button_three_d = document.getElementById("three-d-button");
        // this.button_two_d = document.getElementById("two-d-button");
        // this.dimensionSelector = document.getElementById("dimension-selector");

    }

    init(open) {

        let self = this,
            buildings = {},
            xhr = new XMLHttpRequest();
        // enable dimension toggle buttons
        self._createButtons();

        xhr.open('GET', 'https://api.mapbox.com/datasets/v1/wijnemenjemee/cj056h8w200c033o0mcnvk5nt/features?access_token=pk.eyJ1Ijoid2lqbmVtZW5qZW1lZSIsImEiOiJjaWgwZjB4ZGwwMGdza3FseW02MWNxcmttIn0.l-4VI25pfA5GKukRQTXnWA');
        xhr.send();

        xhr.onreadystatechange = function () {
            var DONE = 4; var OK = 200;
            if (xhr.readyState === DONE) {
                if (xhr.status === OK) {

                    let threeDStructures = JSON.parse(xhr.response);
                    buildings.type = "FeatureCollection";
                    buildings.features = threeDStructures.features;
                    // self.mergeContent(customfeatures);
                    self._drawEssentials(buildings);

                    if(open) {
                        self.shiftPitch(self._map,75);
                    }

                } else {
                    console.log('kan features niet ophalen bij mapboxxx'); // dan weer eruit halen // An error occurred during the request.
                }
            }
        };
    }

    shiftPitch(map,pitch) {

        let self = this;

        self.button_3d.classList.remove('visible');
        self.button_2d.classList.add('visible');

        let center = map.getCenter();
        let zoom = map.getZoom() + .5;
        let bearing = map.getBearing();

        self._show();

        map.flyTo({
            center: center,
            zoom: zoom,
            pitch: pitch || 75,
            bearing: bearing,
            speed: 0.2, // make the flying slow
            curve: .75, // change the speed at which it zooms out
            easing: function (t) {
                return t;
            }
        });
    }

    resetPitch(map) {

        let self = this;

        self.button_2d.classList.remove('visible');
        self.button_3d.classList.add('visible');

        let center = map.getCenter();
        let zoom = map.getZoom() - .5;
        let bearing = map.getBearing();

        self._hide(2000);

        map.flyTo({
            center: center,
            zoom: zoom,
            pitch: 0,
            bearing: bearing,
            speed: 0.2, // make the flying slow
            curve: .75, // change the speed at which it zooms out
            easing: function (t) {
                return t;
            }
        });

    }

    _createButtons() {

        let self = this;

        self.dimensionSelector = document.createElement('div');
        self.dimensionSelector.id = 'dimension-selector';

        self.button_2d = document.createElement('div');
        self.button_2d.id = 'two-d-button';
        self.button_2d.innerHTML = '2D';
        self.dimensionSelector.appendChild(self.button_2d);

        self.button_3d = document.createElement('div');
        self.button_3d.id = 'three-d-button';
        self.button_3d.innerHTML = '3D';
        self.dimensionSelector.appendChild(self.button_3d);

        self.button_3d.classList.add('visible');
        self.button_3d.addEventListener("click", function () {
            self.shiftPitch(self._map);
        }, false);
        self.button_2d.addEventListener("click", function () {
            self.resetPitch(self._map);
        }, false);

        document.getElementById(self._config.hostContainer).appendChild(self.dimensionSelector);

    }

    _drawEssentials(data) {


        let self = this;

        // if (self._map.getSource("buildings") === undefined) {

            self._map.addSource("buildings", {
                "type": "geojson",
                "data": data
            });
        // }

        self._map.addLayer({
            "id": "buildings",
            "source": "buildings",
            "filter": ["all",["!has",'class'],["has",'base'],["has",'height']],  //  ,["has",'colour']
            "type": "fill-extrusion",
            "paint": {

                "fill-extrusion-base": {
                    "type": "identity",
                    "property": "base"
                },
                "fill-extrusion-color": "rgb(216,216,216)",
                // "fill-extrusion-color": {
                //     "type": "identity",
                //     "property": "colour"  // colour
                // },
                "fill-extrusion-height": {
                    "type": "identity",
                    "property": "height"
                },
                "fill-extrusion-opacity": .5
            }

        },'poi');

        self._hide(0);
    }

    _show() {
        let self = this;
        setTimeout( function() {
            self._map.setPaintProperty('buildings', 'fill-extrusion-opacity', 1);
        },0)
    }

    _hide(time) {

        let self = this;
        setTimeout( function() {
            self._map.setPaintProperty('buildings', 'fill-extrusion-opacity', 0);
        },time)

    }

}