"use strict";function _defineProperty(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var o=0;o<t.length;o++){var r=t[o];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,o,r){return o&&e(t.prototype,o),r&&e(t,r),t}}(),PoiLayer=function(){function e(t,o){_classCallCheck(this,e),this._map=t}return _createClass(e,[{key:"draw",value:function(){var e=this;if(webgl_detect()&&!isIE11()){var t;e._map.addSource("poi",{type:"geojson",data:"./assets/geojson/poi.geojson"}),e._map.addLayer({id:"poi",type:"symbol",source:"poi",layout:(t={visibility:"visible","icon-image":"rect_white","icon-padding":0,"icon-text-fit":"both","icon-text-fit-padding":[10,5,0,5],"icon-allow-overlap":!0},_defineProperty(t,"icon-padding",20),_defineProperty(t,"text-field","{name}"),_defineProperty(t,"text-font",["BC Falster Grotesk Bold"]),_defineProperty(t,"text-size",20),_defineProperty(t,"text-offset",[0,0]),_defineProperty(t,"text-anchor","center"),t),paint:{"text-color":"rgb(51,51,51)"},filter:["has","name"]},"projects")}else{var o=[];L.mapbox.featureLayer().loadURL("./assets/geojson/poi.geojson").on("ready",function(t){t.target._geojson.features.forEach(function(e){var t=L.divIcon({iconSize:200,className:"poi label",iconAnchor:50,popupAnchor:0,html:'\n                                <span class="js-label">'+e.properties.name+"</span>\n                            "}),r=L.marker([e.geometry.coordinates[1],e.geometry.coordinates[0]],{icon:t});o.push(r)}),this.markers=new L.featureGroup(o),this.markers.addTo(e._map)})}}}]),e}();