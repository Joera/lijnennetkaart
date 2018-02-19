class ListReference {

    constructor(popup){

        this.interactionPopup = popup;
    }

    generateHTML(features) {

        let self = this,
            ul,
            li;

        ul = document.createElement('ul');

        self.features = features;

        self.features.forEach(function(feature) {
            li = document.createElement('li');
            if (feature.properties.slug === 'zuidasdok') {
                li.innerHTML =`
                        <span class="evensmallerfont" data-slug="zuidasdok">${feature.properties.title}</span>
                `;
            } else {
                li.innerHTML =` 
                        <span class="evensmallerfont" data-slug="${feature.properties.slug}">${feature.properties.title}</span>
                `;
            }
            ul.appendChild(li);
        });
        return ul;
    }

    generateTabs() {

        let self = this,
            ul,
            tab_map,
            tab_list;


        ul = document.createElement('ul');

        tab_map = document.createElement('li');
        tab_map.innerHTML = 'Kaart';
        tab_map.id = "tab_map";
        tab_map.classList.add('active');
        ul.appendChild(tab_map);



        tab_list = document.createElement('li');
        tab_list.innerHTML = 'Lijst';
        tab_list.id = "tab_list";
        ul.appendChild(tab_list);

        return ul;
    }

    addEventListeners(map,container){

        let self = this,
            slug,
            linkList = [].slice.call(container.querySelectorAll('ul>li>span'));

        linkList.forEach( function(link){
            link.addEventListener('click',function(event){

                if(event && event.target.attributes['data-slug']) {

                    self.focus(map,event.target.attributes['data-slug'].nodeValue)
                }
            },false);
        });

        // self.interactionPopup = new InteractionPopup(map,'');
        
    }

    addEventListenersMobile() {

        let projects_map,
            map_list_container;

        projects_map = document.getElementById('projects-map');
        map_list_container = document.getElementById('map-list-container');

        setTimeout( function(){
            let tm = document.getElementById('tab_map');
            let tl = document.getElementById('tab_list');
            if (tm) {
                tm.addEventListener('click',function(event) {
                    if(projects_map) { projects_map.style.visibility = 'visible'; projects_map.style.height = '100%'; }
                    if(map_list_container) { map_list_container.style.visibility = 'hidden'; }
                    tm.classList.add('active');
                    tl.classList.remove('active');
                });
            }


            if (tl) {
                tl.addEventListener('click',function(event) {
                    if (projects_map) { projects_map.style.visibility = 'hidden'; projects_map.style.height = '0px'; }
                    if (map_list_container) { map_list_container.style.visibility = 'visible'; }
                    tm.classList.remove('active');
                    tl.classList.add('active');
                });
            }

        },500);
    }

    focus(map,slug) {
        if (webgl_detect() && !isIE11()) {
            this._GL_Focus(map,slug);
        } else {
            this._JS_Focus(map,slug);
        }
    }

    // focusOff(map,slug) {
    //     if (webgl_detect() && !isIE11()) {
    //         this._GL_UnFocus(map,slug);
    //     } else {
    //         this._JS_UnFocus(map,slug);
    //     }
    // }

    _GL_Focus(map,slug) {

        let self = this,
            html,
            offset,
            lngLat,
            type,
            features = map.queryRenderedFeatures({ filter: ['==', 'slug', slug], layers: ['icons'] });

        if(features[0]) {

            if (window.innerWidth <= 760) {
                let projects_map = document.getElementById('projects-map');
                if (projects_map) { projects_map.style.visibility = 'visible'; projects_map.style.height = '100%'; }
                let map_list_container = document.getElementById('map-list-container');
                if (map_list_container) { map_list_container.style.visibility = 'hidden'; }
                let tm = document.getElementById('tab_map');
                let tl = document.getElementById('tab_list');
                tm.classList.add('active');
                tl.classList.remove('active');
            }

            html = self.interactionPopup.createPopup(features[0]);
            offset = [-2, -14];
            lngLat = features[0].geometry.coordinates;
            type = features[0].properties.type;

            self.interactionPopup.openPopup(map, html, lngLat, type, offset, true);

            map.easeTo({

                center: [lngLat[0] + 0.001, lngLat[1] - 0.0005],
                zoom: 14,
                speed: 0.2,
                curve: 1,
            });
        }

    }

    _JS_Focus(map,slug) {

        let self = this,
            html,
            latLng,
            highlightedMarker,
            highlightedFeature;

        // all features
        // filter by slug ?
        highlightedFeature = self.features.filter(function(f){
            return f.properties.slug === slug;
        });


        // highlightedMarker = document.querySelector('.marker.' + slug);
        // console.log(highlightedMarker);
        // highlightedMarker.style.backgroundImage = 'url("/assets/svg/highlight-icon-construction-project.svg")';

        html = self.interactionPopup.createPopup(highlightedFeature[0]);
        latLng = new L.LatLng(highlightedFeature[0].geometry.coordinates[1],highlightedFeature[0].geometry.coordinates[0]);
        console.log(latLng);
        //open popup;
        var popup = L.popup({
            className : highlightedFeature[0].properties.type,
            offset : [0,36]
        })
        .setLatLng(latLng)
        .setContent(html)
        .openOn(map);
    }

    // _GL_UnFocus(map,slug) {
    //
    //     let self = this;
    //
    //     self.interactionPopup.closePopup();
    // }
    //
    // _JS_UnFocus(map,slug) {
    //
    //     let allMarkers = document.querySelectorAll('.marker');
    //
    //     [].forEach.call(allMarkers, function(marker) {
    //         marker.style.backgroundImage = 'url("/assets/svg/icon-construction-project.svg")';
    //     });
    // }
}