"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),Map=function(){function e(t,i,n){_classCallCheck(this,e),this.element=document.getElementById(t);try{var o=this.element.getAttribute("data-config");this.customConfig=JSON.parse(o)}catch(e){this.customConfig=[],console.log(e)}this.config={accessToken:"pk.eyJ1Ijoid2lqbmVtZW5qZW1lZSIsImEiOiJjaWgwZjB4ZGwwMGdza3FseW02MWNxcmttIn0.l-4VI25pfA5GKukRQTXnWA",style:"mapbox://styles/wijnemenjemee/cjcywszq502re2sobjc8d1e0z",hostContainer:t,center:[4.9,52.37],zoom:10.2,pitch:0,bearing:0,scrollZoom:!1},this.session={incarnation:"old",origin:null,destination:null,data:{},route:null,routeName:"",sidebar:!1,disclaimer:!0},this.config.origins=i?JSON.parse(i):{},this.config.origins=JSON.parse(i),this._callToAction=document.getElementById("call-to-action"),this._sidebar=document.getElementById("sidebar"),this._listContainer=document.getElementById("list-container"),this._toggleSideBarButton=document.getElementById("sidebar-button"),this._routeBlock=document.getElementById("route-block"),this._newOrigin=document.getElementById("new-origin"),this._disclaimerBlock=document.getElementById("disclaimer")}return _createClass(e,[{key:"init",value:function(){var e=this,t=new MapWebGL(e.config);e._map=t.create(),e._origin=new Origin(e._map,e.config),e._points=new Points(e._map,e.config),e._lines=new Lines(e._map,e.config),e._map.on("style.load",function(){e._points.addOrigins(),e._initMap()}),e._newOrigin.addEventListener("click",function(){e._clearOrigin()},!1),this._listEventHandlers(),e.session.sidebar&&e._sidebar.classList.add("open"),e._toggleSideBarButton.addEventListener("click",function(t){e._toggleSidebar()},!1),e._disclaimerBlock.addEventListener("click",function(t){e._toggleDisclaimer()},!1)}},{key:"_listEventHandlers",value:function(){var e=this;this._originList=document.getElementById("origin-list"),[].slice.call(e._originList.querySelectorAll("ul")).forEach(function(t){var i=t.getAttribute("data-concession");t.querySelector("span.concessiegebied").addEventListener("click",function(n){e._toggleConcession(t,i)},!1)})}},{key:"_toggleConcession",value:function(e,t){[].slice.call(e.querySelectorAll("li")).forEach(function(e){e.classList.contains("hidden")?e.classList.remove("hidden"):e.classList.add("hidden")})}},{key:"_initMap",value:function(){var e=this;e._points.drawOrigins(),e._adaptOriginList(),setTimeout(function(){e._setBoundingBoxForOrigins()},1500),e._map.on("mouseover","origins",function(t){e._highlightOrigin(t.features[0].properties.originId)}),e._map.on("mouseout","origins",function(t){e._unhighlightOrigin()}),e._map.on("click","origin-labels",function(t){e._selectOrigin(t.features[0].properties.originId,"")})}},{key:"_adaptOriginList",value:function(){var e=this;e._callToAction.innerHTML="\n\n            <h2><span>Kies</span> een <span>startpunt</span></h2>\n            <span>uit de lijst of klik op een punt op de kaart</span>\n\n        ",[].slice.call(e._listContainer.querySelectorAll("li")).forEach(function(t){var i=(t.getAttribute("data-name"),t.getAttribute("data-origin-id")),n=t.getAttribute("data-filename");t.addEventListener("mouseover",function(){e._highlightOrigin(i)},!1),t.addEventListener("mouseout",function(){e._unhighlightOrigin()},!1),t.addEventListener("click",function(){e._selectOrigin(i,n)},!1)})}},{key:"_highlightOrigin",value:function(e){self=this,self.config.origins.features.forEach(function(t){"origin"!==t.properties.state&&"destination"!==t.properties.state&&t.properties.originId===e&&(t.properties.state="highlighted")}),this._map.getSource("origins").setData(self.config.origins)}},{key:"_unhighlightOrigin",value:function(){self=this,self.config.origins.features.forEach(function(e){"muted"===e.properties.state&&"destination"!==e.properties.state?e.properties.state="muted":"origin"!==e.properties.state&&"destination"!==e.properties.state&&(e.properties.state="inactive")}),this._map.getSource("origins").setData(self.config.origins)}},{key:"_purgeOrigins",value:function(){self=this,self.config.origins.features=self.config.origins.features.filter(function(e){return!0===e.property.availabe_as_destination}),this._map.getSource("origins").setData(self.config.origins)}},{key:"_selectOrigin",value:function(e,t){var i=this;if(null===i.session.origin){i.session.origin=e,i.session.routeName=i._getPointName(e),i.config.origins.features.forEach(function(t){t.properties.state="inactive",t.properties.originId===e&&(t.properties.state="origin")}),this._map.getSource("origins").setData(i.config.origins);var n="http://lijnennetkaart.speldtenhooijbergh.nl/api/route/"+e;axios.get(n).then(function(e){200!==e.status&&console.log("foutje bedankt"),i.session.data={},i.session.data.originData=e.data,i._destinationList(),i._remapOriginsToDestinations()})}}},{key:"_remapOriginsToDestinations",value:function(){var e=this;e.config.origins.features=e.config.origins.features.filter(function(e){return e.properties.available_as_destination||"origin"===e.properties.state}),this._map.getSource("origins").setData(e.config.origins),e._adaptOriginList(),e._map.on("click","origins",function(t){e._initRoute(t.features[0].properties.originId)})}},{key:"_destinationList",value:function(){var e=this;e._callToAction.innerHTML="\n                <h2><span>Kies</span> een <span>bestemming</span></h2>\n                <span>uit de lijst of klik op een punt op de kaart</span>\n            ";var t=e._listContainer.querySelector("#origin-list"),i=t.cloneNode(!0);e._listContainer.appendChild(i);var n=[].slice.call(t.querySelectorAll("li[data-origin-id]")).find(function(t){return t.getAttribute("data-origin-id")===e.session.origin}),o=n.cloneNode(!0);o.classList.add("active-origin");var s=document.createElement("ul");s.id="selection-list",s.appendChild(o),e._listContainer.removeChild(t),e._listContainer.appendChild(s),e._listContainer.appendChild(i),["13412","13663","13431","13527","13378","36003","35250","41783","34294","10220","37224"].indexOf(e.session.origin)>-1&&([].slice.call(i.querySelectorAll("ul.buiten-amsterdam")).forEach(function(e){e.classList.add("hidden")}),[].slice.call(i.querySelectorAll("ul[data-concession]")).forEach(function(t){"amsterdam"===t.getAttribute("data-concession")&&e._toggleConcession(t,"amsterdam")}));var r=[].slice.call(e._listContainer.querySelectorAll("li"));r.forEach(function(t){var i=(t.getAttribute("data-name"),t.getAttribute("data-origin-id"));t.getAttribute("data-filename");t.addEventListener("mouseover",function(){},!1),t.addEventListener("mouseout",function(){},!1),t.addEventListener("click",function(){e._initRoute(i)},!1)}),r.find(function(t){return t.getAttribute("data-origin-id")==e.session.origin}).classList.add("active"),e._listEventHandlers()}},{key:"_initRoute",value:function(e){console.log(e);var t=this;t.session.destination=e,t.session.route=t.session.origin+"_"+e,t.session.routeName=t.session.routeName+" naar "+t._getPointName(e);var i=document.querySelector("#origin-list");[].slice.call(i.querySelectorAll("li[data-origin-id]")).forEach(function(e){e.classList.contains("active")&&e.classList.remove("active"),e.getAttribute("data-origin-id")===t.session.destination&&e.classList.add("active")}),t.config.origins.features.forEach(function(t){"origin"!==t.properties.state&&(t.properties.state="muted"),t.properties.originId===e&&(t.properties.state="destination")}),t._map.getSource("origins").setData(t.config.origins);var n=[],o=[];t.session.data.originData.forEach(function(i){(i.properties.routeId.split("_")[0]===t.session.origin&&i.properties.routeId.split("_")[1]===e||i.properties.routeId.split("_")[1]===t.session.origin&&i.properties.routeId.split("_")[0]===e)&&(i.properties.routeId.split("_")[2].indexOf("oud")>-1?o.push(i):i.properties.routeId.split("_")[2].indexOf("nieuw")>-1&&n.push(i))}),t.session.data.routes=[o,n],t.session.data.routes[0]&&t.session.data.routes[0].length>0?(t._setRouteInfo(t.session.data.routes),t.session.data.routes.forEach(function(e,i){var n=e[0].properties.routeId.split("_")[2],o={type:"FeatureCollection",features:e};void 0===t._map.getSource("routes-"+n)?(t._map.addSource("routes-"+n,{type:"geojson",data:o}),setTimeout(function(){0===i&&(t._lines.drawOldLayers(),t._lines.drawNewLayers()),t._points.drawTransfers(t.session.route),t._switchRouteBlockColor(),t._switchRouteLayers(t.session.route)},200)):(t._points.drawTransfers(t.session.route),t._switchRouteBlockColor(),t._switchRouteLayers(t.session.route),t._map.getSource("routes-"+n).setData(o))})):(console.log("routes object is leeg"),console.log(t.session)),window.innerWidth<=1400&&t._toggleSidebar(),setTimeout(function(){t._setBoundingBox()},500)}},{key:"_showDestinations",value:function(){var e=this,t={};t.layers=["destinations"],e.config.destinations=e._filterDestinations(e._map.queryRenderedFeatures(t))}},{key:"_setRouteInfo",value:function(e){var t=this;t._routeBlock.innerHTML="";var i=document.createElement("h3");i.innerHTML=t.session.routeName;var n=document.createElement("div");n.id="route-select",n.innerHTML='\n                    <label class="switch">\n                        <input id="route-switch" type="checkbox">\n                        <span class="slider round"></span>\n                        <span class="label checked">Toon oude route</span>\n                        <span class="label unchecked">Toon nieuwe route</span>\n                    </label>\n        ',n.addEventListener("click",function(e){t._routeSwitch(this,e,!0)},!1);var o=document.createElement("ul"),s=[];e.forEach(function(e){e=e.filter(function(e){return"LineString"===e.geometry.type}),e.sort(function(e,t){return e.properties.order_nr-t.properties.order_nr});var i=void 0;i=e[0]&&!0===e[0].properties.isNieuw?"Nieuwe route":"Huidige route";var n=document.createElement("li");n.addEventListener("click",function(e){t._routeSwitch(this,e,!1)},!1);var r=document.createElement("input");r.type="checkbox",r.name=e[0].properties.routeId,r.checked=!0,n.appendChild(r);var a=document.createElement("label");a.innerHTML=i,n.appendChild(a);var l=document.createElement("ul");e.forEach(function(e,t,i){if("LineString"===e.geometry.type){var n=void 0;n="trein"!==e.properties.transport_type?e.properties.transport_nrs.join("/"):"";var o="";"bus"===e.properties.transport_type?o='\n    \n                                <svg class="icon-bus" width="26px" height="32px" viewBox="0 0 26 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n                                    <polygon id="Path" fill="black" points="5.832 28.416 5.832 31.232 2.312 31.232 2.312 28.416 0.968 28.416 0.2 20.672 1.288 1.856 2.632 0.448 23.112 0.448 24.456 1.856 25.544 20.672 24.776 28.416 23.432 28.416 23.432 31.232 19.912 31.232 19.912 28.416"></polygon>\n                                    <polygon id="Path" fill="white" points="2.888 4.864 22.856 4.864 22.856 2.304 2.888 2.304"></polygon>\n                                    <path d="M2.312,23.296 C2.312,24.32 3.08,25.088 4.04,25.088 C5,25.088 5.832,24.32 5.832,23.296 C5.832,22.336 5,21.568 4.04,21.568 C3.08,21.568 2.312,22.336 2.312,23.296 Z" id="Path" fill="white"></path>\n                                    <path d="M19.912,23.296 C19.912,24.32 20.744,25.088 21.704,25.088 C22.664,25.088 23.432,24.32 23.432,23.296 C23.432,22.336 22.664,21.568 21.704,21.568 C20.744,21.568 19.912,22.336 19.912,23.296 Z" id="Path" fill="white"></path>\n                                    <polygon id="Path" fill="white" points="3.656 18.048 22.088 18.048 22.856 6.464 2.888 6.464"></polygon>\n                                </svg> \n                            ':"metro"===e.properties.transport_type?o='<svg class="icon-metro" width="34px" height="34px" viewBox="0 0 34 34" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n                                <polygon id="Path" fill="black" points="7.208 0.232 27.048 0.232 28.136 1.384 28.136 21.352 26.024 23.4 8.104 23.4 5.992 21.352 5.992 1.384"></polygon>\n                                <path d="M7.016,19.112 C7.016,20.008 7.72,20.712 8.616,20.712 C9.512,20.712 10.216,20.008 10.216,19.112 C10.216,18.216 9.512,17.512 8.616,17.512 C7.72,17.512 7.016,18.216 7.016,19.112 Z" id="Path" fill="white"></path>\n                                <polygon id="Path" fill="black" points="29.864 33.32 22.248 25.128 23.592 25.128 33.768 33.32"></polygon>\n                                <polygon id="Path" fill="black" points="12.328 25.128 4.776 33.32 0.872 33.32 11.048 25.128"></polygon>\n                                <path d="M23.528,19.112 C23.528,20.008 24.296,20.712 25.192,20.712 C26.024,20.712 26.792,20.008 26.792,19.112 C26.792,18.216 26.024,17.512 25.192,17.512 C24.296,17.512 23.528,18.216 23.528,19.112 Z" id="Path" fill="white"></path>\n                                <polygon id="Path" fill="white" points="13.352 6.504 13.352 14.696 26.792 14.696 26.792 6.504"></polygon>\n                                <polygon id="Path" fill="white" points="7.464 1.64 7.464 5.352 12.328 5.352 12.328 1.64"></polygon>\n                            </svg>':"tram"===e.properties.transport_type?o='<svg class="icon-tram" width="19px" height="36px" viewBox="0 0 19 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n                                <polygon id="Path" fill="black" points="0.976 30.904 0.976 8.184 5.776 8.184 5.776 4.344 14.16 4.344 14.16 8.184 18.96 8.184 18.96 30.904 16.272 33.592 16.272 35.896 14.928 35.832 14.928 33.592 5.008 33.592 5.008 35.832 3.6 35.896 3.6 33.592"></polygon>\n                                <polygon id="Path" fill="white" points="17.04 11.192 2.896 11.192 4.56 24.184 15.376 24.184"></polygon>\n                                <path d="M8.4,28.152 C8.4,28.984 9.104,29.688 9.936,29.688 C10.832,29.688 11.536,28.984 11.536,28.152 C11.536,27.256 10.832,26.616 9.936,26.616 C9.104,26.616 8.4,27.256 8.4,28.152 Z" id="Path" fill="#000"></path>\n                                <polygon id="Path" fill="white" points="7.12 9.592 12.752 9.592 12.752 5.688 7.12 5.688"></polygon>\n                                <polygon id="Path" fill="black" points="2.384 2.04 2.384 0.76 17.552 0.76 17.552 2.04"></polygon>\n                            </svg>':"walk"===e.properties.transport_type&&(o='\n                                <svg class="icon-walk" width="38px" height="36px" viewBox="0 0 38 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n                                    <path d="M5.112,9.976 C5.112,9.144 5.816,8.376 6.712,8.376 C7.608,8.376 8.312,9.144 8.312,9.976 C8.312,10.872 7.608,11.576 6.712,11.576 C5.816,11.576 5.112,10.872 5.112,9.976 Z" id="Path"></path>\n                                    <polygon id="Path" points="29.496 7.416 32.76 13.304 37.752 17.336 36.664 19.384 30.648 15.672 29.496 13.432 29.496 18.232 32.568 24.248 34.488 35.064 31.288 35.832 29.24 26.488 26.808 22.456 23.928 28.28 19.256 34.168 17.08 32.184 21.176 25.592 23.736 18.04 23.736 11.704 21.048 14.328 18.424 19.128 16.44 17.976 19.256 11.896 23.736 7.416"></polygon>\n                                    <path d="M23.928,3.448 C23.928,1.976 25.144,0.76 26.616,0.76 C28.088,0.76 29.304,1.976 29.304,3.448 C29.304,4.92 28.088,6.072 26.616,6.072 C25.144,6.072 23.928,4.92 23.928,3.448 Z" id="Path"></path>\n                                    <polygon id="Path" points="4.984 12.408 8.44 12.408 11.128 15.096 12.856 18.744 11.64 19.384 10.104 16.568 8.44 14.968 8.44 18.744 9.976 23.288 12.472 27.256 11.128 28.408 8.376 24.952 6.648 21.432 5.112 23.864 3.896 29.432 1.976 28.984 3.192 22.456 4.984 18.872 4.984 15.992 4.28 17.336 0.696 19.576 0.056 18.36 3.064 15.928"></polygon>\n                                </svg>\n                                ');var s=document.createElement("li"),r=o+'<div class="'+e.properties.transport_type+'"><span class="halte"></span><div class="start">'+e.properties.start_naam+'</div><span class="modaliteit">'+e.properties.transport_type+" "+n+"</span></div>";if(s.innerHTML=r,l.appendChild(s),t===i.length-1){var a=document.createElement("div");a.classList.add("destination_halte");var u=document.createElement("span");u.classList.add("halte"),a.appendChild(u);var c=document.createElement("span");c.classList.add("haltenaam"),c.innerHTML=e.properties.end_naam,console.log(c),a.appendChild(c),l.appendChild(a)}}}),n.appendChild(l),o.appendChild(n),s.push(e[0].properties.routeId)}),t._routeBlock.appendChild(n),t._routeBlock.appendChild(i),t._routeBlock.appendChild(o);var r=document.getElementById("route-switch");"new"===t.session.incarnation&&(r.checked=!0),window.innerWidth<700&&document.getElementById("routes").classList.add("hidden")}},{key:"_switchRouteLayers",value:function(e){self=this,"old"===self.session.incarnation?self._showOld(e):self._showNew(e)}},{key:"_switchRouteBlockColor",value:function(){self=this,"old"===self.session.incarnation?(self._routeBlock.querySelector("#route-block > ul > li:nth-child(1)").style.background=lightpink,self._routeBlock.querySelector("#route-block > ul > li:nth-child(2)").style.background=grey):(self._routeBlock.querySelector("#route-block > ul > li:nth-child(1)").style.background=grey,self._routeBlock.querySelector("#route-block > ul > li:nth-child(2)").style.background=lightpink),window.innerWidth<=1400&&("old"===self.session.incarnation?(self._routeBlock.querySelector("#route-block > ul > li:nth-child(1)").style.display="block",self._routeBlock.querySelector("#route-block > ul > li:nth-child(2)").style.display="none"):(self._routeBlock.querySelector("#route-block > ul > li:nth-child(1)").style.display="none",self._routeBlock.querySelector("#route-block > ul > li:nth-child(2)").style.display="block"))}},{key:"_showNew",value:function(){var e=this;e._map.setLayoutProperty("route-bus_new","visibility","visible"),e._map.setLayoutProperty("route-metro_new","visibility","visible"),e._map.setLayoutProperty("route-tram_new","visibility","visible"),e._map.setLayoutProperty("route-train_new","visibility","visible"),e._map.setLayoutProperty("route-bus_old","visibility","none"),e._map.setLayoutProperty("route-metro_old","visibility","none"),e._map.setLayoutProperty("route-tram_old","visibility","none"),e._map.setLayoutProperty("route-train_old","visibility","none"),e._map.setLayoutProperty("transfers-new","visibility","visible"),e._map.setLayoutProperty("transfer-labels-new","visibility","visible"),e._map.setLayoutProperty("transfer-labels-new-info","visibility","visible"),e._map.setLayoutProperty("transfers-old","visibility","none"),e._map.setLayoutProperty("transfer-labels-old","visibility","none"),e._map.setLayoutProperty("transport-mode-old","visibility","none"),e._map.setLayoutProperty("transport-mode-new","visibility","visible")}},{key:"_showOld",value:function(){var e=this;e._map.setLayoutProperty("route-bus_new","visibility","none"),e._map.setLayoutProperty("route-metro_new","visibility","none"),e._map.setLayoutProperty("route-tram_new","visibility","none"),e._map.setLayoutProperty("route-train_new","visibility","none"),e._map.setLayoutProperty("route-bus_old","visibility","visible"),e._map.setLayoutProperty("route-metro_old","visibility","visible"),e._map.setLayoutProperty("route-tram_old","visibility","visible"),e._map.setLayoutProperty("route-train_old","visibility","visible"),e._map.setLayoutProperty("transfers-new","visibility","none"),e._map.setLayoutProperty("transfer-labels-new","visibility","none"),e._map.setLayoutProperty("transfer-labels-new-info","visibility","none"),e._map.setLayoutProperty("transfers-old","visibility","visible"),e._map.setLayoutProperty("transfer-labels-old","visibility","visible"),e._map.setLayoutProperty("transport-mode-old","visibility","visible"),e._map.setLayoutProperty("transport-mode-new","visibility","none")}},{key:"_setBoundingBox",value:function(){var e=this,t=e._map.queryRenderedFeatures({layers:["route-bus_new","route-metro_new","route-tram_new","route-train_new","route-bus_old","route-metro_old","route-tram_old","route-train_old"]}),i={type:"FeatureCollection",features:t},n=turf.bbox(i);e._map.fitBounds(n,{padding:{top:200,bottom:200,left:200,right:200},linear:!0})}},{key:"_setBoundingBoxForOrigins",value:function(){var e=this,t=e._map.queryRenderedFeatures({layers:["origins"]}),i={type:"FeatureCollection",features:t},n=turf.bbox(i),o=0;o=e.session.sidebar?400:100,e._map.fitBounds(n,{padding:{top:100,bottom:100,left:o,right:100},linear:!0})}},{key:"_routeSwitch",value:function(e,t,i){if(!i||i&&("INPUT"===t.target.tagName||"DIV"===t.target.tagName)){var n=this;if("old"===this.session.incarnation){this.session.incarnation="new";var o=n.session.data.routes[1][0].properties.routeId;n._switchRouteLayers(o)}else{this.session.incarnation="old";var s=n.session.data.routes[0][0].properties.routeId;n._switchRouteLayers(s)}n._switchRouteBlockColor()}if(!i){var r=document.getElementById("route-switch");r.checked?r.checked=!1:(console.log("no"),r.checked=!0)}}},{key:"_filterOrigins",value:function(e){return{type:"FeatureCollection",features:e.features.filter(function(e,t,i){return i.map(function(e){return e.properties.naam}).indexOf(e.properties.naam)===t&&"herkomst"==e.properties.function})}}},{key:"_filterDestinations",value:function(e){var t=[];return e.filter(function(e){return!(t.indexOf(e.properties.naam)>-1)&&(t.push(e.properties.naam),!0)})}},{key:"_filterRoutes",value:function(e){var t=[];return e.filter(function(e){return!(t.indexOf(e.start_id)>-1)&&(t.push(e.start_id),!0)})}},{key:"_clearOrigin",value:function(){var e=this;this.session={origin:null,destination:null},this._listContainer.innerHTML="",e._map.getStyle().layers.forEach(function(e){console.log(e.id),e.id.indexOf("route-")>-1||e.id.indexOf("origin")>-1||e.id.indexOf("transfer")})}},{key:"_getPointName",value:function(e){return this.config.origins.features.find(function(t){return t.properties.originId===e}).properties.naam}},{key:"_toggleSidebar",value:function(){var e=this;e._sidebar.classList.contains("open")?(e.session.sidebar=!1,e._sidebar.classList.remove("open")):(e.session.sidebar=!0,e._sidebar.classList.add("open")),e._setBoundingBoxForOrigins()}},{key:"_toggleDisclaimer",value:function(){var e=this;e._disclaimerBlock.classList.contains("hidden")?(e.session.disclaimer=!0,e._disclaimerBlock.classList.remove("hidden")):(e.session.disclaimer=!1,e._disclaimerBlock.classList.add("hidden")),e._toggleSidebar()}}]),e}();