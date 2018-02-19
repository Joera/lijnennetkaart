class ActiveMarkers {

    constructor(map, config, popup,center) {

        this._map = map;
        this._config = config;
        this._interactionPopup = popup;
        this._center = center;
    }

    setGL(array) {

        let self = this,
            filter;

        if (array && array.length > 0 && array.length < 2) { // < 2 zorgt ervoor dat ie op homepage niet actief is
            filter = ['in', 'slug'];
            array.forEach(function (item) {
                filter.push(item);
            });
            // voor verzamelpagina's zoals homepage .. nu even niks
        } else if (array && array.length > 1) {
            filter = ["==", 'slug', ''];
            // als activeItems leeg is zoals bijv bij bouwprojecten
        } else {
            filter = ['has', 'slug'];
        }

        if (self._map.getLayer('icons-active')) {

            self._map.setFilter('icons-active', filter);

            setTimeout(function () {
                self._center.setGL();
            }, 2000);
        }
    }

    setJS(content, activeItems) {

        let self = this,
            m;

        if (activeItems && activeItems.length < 2) {

            activeItems.forEach(function (item) {
                m = document.querySelector('.leaflet-marker-icon.' + item);
                // console.log(m);
                if (m) {
                    m.classList.add('active');
                }
            });

            self._center.setJS(content, activeItems);
        }
    }
}