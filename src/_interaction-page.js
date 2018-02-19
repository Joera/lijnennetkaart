class InteractionPage {

    constructor(map, config,popup) {
        this._map = map;
        this._config = config;
        this.interactionPopup = popup;

        this._hostContainer = document.getElementById('kaart');
        this._explanationContainer = document.getElementById('kaart-explanation');

        this._allLocations = document.getElementById('all_locations');
        this._relevantLocations = document.getElementById('relevant_locations');
        this._selectedLocations = document.getElementById('selected_locations');

        this._tabAlles = document.getElementById('tab_alles');
        this._tabActueel = document.getElementById('tab_actueel');
        this._tabSelection = document.getElementById('tab_selectie');
    }

    init() {

        var self = this;

        var hideButtons = [].slice.call(document.getElementsByClassName('hide-explanation'));

        if(hideButtons) {
            hideButtons.forEach( (b) => {
                b.addEventListener("click", function () {
                    self.hideExplanation();
                }, false);
            });
        }

        var showButtons = [].slice.call(document.getElementsByClassName('show-explanation'));

        if(showButtons) {
            showButtons.forEach( (b) => {
                b.addEventListener("click", function () {
                    self.showExplanation();
                }, false);
            });
        }

        self._map.on('click', 'labels', function (e) {
            self._showLocationInfo(e.features[0].properties.slug);
        });

        this._tabAlles.addEventListener("click", function () {
            self._switchInfo('alles');
        }, false);

        this._tabActueel.addEventListener("click", function () {
            self._switchInfo('actueel');
        }, false);

        this._tabSelection.addEventListener("click", function () {
            self._switchInfo('selectie');
        }, false);
    }

    _showLocationInfo(slug) {

        let self = this;
        this._selectedLocations.innerHTML = '';
        self._switchInfo('selectie');
        var locationElement = [].slice.call(document.querySelectorAll('.location.' + slug))[0];
        var div = document.createElement("div");
        div.classList.add("location");
        div.classList.add(slug);
        div.innerHTML = locationElement.innerHTML;
        this._selectedLocations.appendChild(div);
    }

    showExplanation() {

        this._explanationContainer.style.display = 'block';
        localStorage.setItem('map-explanation',true);
    }

    hideExplanation() {

        this._explanationContainer.style.display = 'none';
        localStorage.setItem('map-explanation',false);
    }

    _switchInfo(keuze) {

        this._keuze = keuze;

        if (this._keuze === 'alles') {

            this._allLocations.style.display = 'block';
            this._relevantLocations.style.display = 'none';
            this._selectedLocations.style.display = 'none';

            this._tabAlles.classList.add('active');
            this._tabActueel.classList.remove('active');
            this._tabSelection.classList.remove('active');

        } else if (this._keuze === 'actueel') {

            this._allLocations.style.display = 'none';
            this._selectedLocations.style.display = 'none';
            this._relevantLocations.style.display = 'block';

            this._tabAlles.classList.remove('active');
            this._tabActueel.classList.add('active');
            this._tabSelection.classList.remove('active');

        } else if (this._keuze === 'selectie') {

            this._allLocations.style.display = 'none';
            this._selectedLocations.style.display = 'block';
            this._relevantLocations.style.display = 'none';

            this._tabAlles.classList.remove('active');
            this._tabActueel.classList.remove('active');
            this._tabSelection.classList.add('active');
        }
    }
}