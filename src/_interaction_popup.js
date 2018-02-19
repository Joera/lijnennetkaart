class InteractionPopup {

    constructor() {
        // this._map = map;
        // this._config = config;
        this.popup = null;
        this.popups = [];
    }

    createPopup(item) {

        let url;

        if (item.properties.slug === 'zuidasdok') {
            url = 'zuidasdok'
        } else {
            url = item.properties.url
        }

        if (item.properties.third_line) {
            return `<a href="` + url + `">
                        <span class="multiline">
                            ` + item.properties.first_line + `
                        </span><br/>
                        <span class="multiline">
                            ` + item.properties.second_line + `
                        </span><br/>
                        <span class="multiline">
                            ` + item.properties.third_line + `
                        </span>
                    </a>
                         `;
        }
        else if (item.properties.second_line) {
            return `<a href="` + url + `">
                        <span class="multiline">
                            ` + item.properties.first_line + `
                        </span><br/>
                        <span class="multiline">
                            ` + item.properties.second_line + `
                        </span>
                     </a>
                         `;
        } else {

            return `<a href="` + url + `">
                        <span class="multiline">
                            ` + item.properties.title + `
                        </span>
                   </a>`;
        }
    }

    openPopup(map,html,lngLat,type,offset,closeOthers) {

        let self = this;
        if (closeOthers && self.popup) { self.popup.remove(); }
        self.popup = new mapboxgl.Popup({offset:offset,anchor:'top-left',closeButton:false})
            .setLngLat(lngLat)
            .setHTML(html)
            .addTo(map);
        self.popup._container.classList.add(type);

        self.popups.push(self.popup);
    }

    closePopup() {

        let self = this;
        if (self.popup) {
            self.popup.remove();
        }
    }

    // closeAllPopups(map) {
    //
    //
    //     // loop door lagen
    //     // verzamel iconen
    //     // verzamel open popups
    //
    //     let popup,
    //         activeIcons = map.queryRenderedFeatures({ layers: ['icons-active'] });
    //
    //     activeIcons.forEach( function(icon) {
    //
    //      //   popup = icon.getPopup();
    //         console.log(icon);
    //     })
    //
    // }


    addToArray(popup) {

        let self = this;
        self.popups.push(self.popup);
    }

    emptyArray(map) {

        let self = this;

        if (webgl_detect() && !isIE11()) {

            self.popups.forEach(function (popup) {

                popup.remove();
            });

        }

        else {

            map.closePopup();

        }
    }

}
