"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,r){for(var a=0;a<r.length;a++){var t=r[a];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(r,a,t){return a&&e(r.prototype,a),t&&e(r,t),r}}(),Background=function(){function e(r,a){_classCallCheck(this,e),this._map=r,this._config=a}return _createClass(e,[{key:"init",value:function(){var e=this;e._map.addSource("terrain",{type:"vector",url:"mapbox://mapbox.mapbox-terrain-v2"}),e._map.addLayer({id:"water",type:"fill",source:"terrain",paint:{"circle-color":"#fff","circle-radius":6,"circle-opacity":1,"circle-stroke-width":6,"circle-stroke-color":donkergeel,"circle-stroke-opacity":1},filter:["any",["==","name","overstap"],["==","name","0"]]})}}]),e}();