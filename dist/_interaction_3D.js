"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),Interaction3D=function(){function e(t,n){_classCallCheck(this,e),this._map=t,this._config=n,this.button_2d=null,this.button_3d=null}return _createClass(e,[{key:"init",value:function(e){var t=this,n={},i=new XMLHttpRequest;t._createButtons(),i.open("GET","https://api.mapbox.com/datasets/v1/wijnemenjemee/cj056h8w200c033o0mcnvk5nt/features?access_token=pk.eyJ1Ijoid2lqbmVtZW5qZW1lZSIsImEiOiJjaWgwZjB4ZGwwMGdza3FseW02MWNxcmttIn0.l-4VI25pfA5GKukRQTXnWA"),i.send(),i.onreadystatechange=function(){if(4===i.readyState)if(200===i.status){var o=JSON.parse(i.response);n.type="FeatureCollection",n.features=o.features,t._drawEssentials(n),e&&t.shiftPitch(t._map,75)}else console.log("kan features niet ophalen bij mapboxxx")}}},{key:"shiftPitch",value:function(e,t){var n=this;n.button_3d.classList.remove("visible"),n.button_2d.classList.add("visible");var i=e.getCenter(),o=e.getZoom()+.5,s=e.getBearing();n._show(),e.flyTo({center:i,zoom:o,pitch:t||75,bearing:s,speed:.2,curve:.75,easing:function(e){return e}})}},{key:"resetPitch",value:function(e){var t=this;t.button_2d.classList.remove("visible"),t.button_3d.classList.add("visible");var n=e.getCenter(),i=e.getZoom()-.5,o=e.getBearing();t._hide(2e3),e.flyTo({center:n,zoom:i,pitch:0,bearing:o,speed:.2,curve:.75,easing:function(e){return e}})}},{key:"_createButtons",value:function(){var e=this;e.dimensionSelector=document.createElement("div"),e.dimensionSelector.id="dimension-selector",e.button_2d=document.createElement("div"),e.button_2d.id="two-d-button",e.button_2d.innerHTML="2D",e.dimensionSelector.appendChild(e.button_2d),e.button_3d=document.createElement("div"),e.button_3d.id="three-d-button",e.button_3d.innerHTML="3D",e.dimensionSelector.appendChild(e.button_3d),e.button_3d.classList.add("visible"),e.button_3d.addEventListener("click",function(){e.shiftPitch(e._map)},!1),e.button_2d.addEventListener("click",function(){e.resetPitch(e._map)},!1),document.getElementById(e._config.hostContainer).appendChild(e.dimensionSelector)}},{key:"_drawEssentials",value:function(e){var t=this;t._map.addSource("buildings",{type:"geojson",data:e}),t._map.addLayer({id:"buildings",source:"buildings",filter:["all",["!has","class"],["has","base"],["has","height"]],type:"fill-extrusion",paint:{"fill-extrusion-base":{type:"identity",property:"base"},"fill-extrusion-color":"rgb(216,216,216)","fill-extrusion-height":{type:"identity",property:"height"},"fill-extrusion-opacity":.5}},"poi"),t._hide(0)}},{key:"_show",value:function(){var e=this;setTimeout(function(){e._map.setPaintProperty("buildings","fill-extrusion-opacity",1)},0)}},{key:"_hide",value:function(e){var t=this;setTimeout(function(){t._map.setPaintProperty("buildings","fill-extrusion-opacity",0)},e)}}]),e}();