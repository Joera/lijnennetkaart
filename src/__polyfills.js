
// for babel
// Array.includes = function() {
//     let [first, ...rest] = arguments;
//     return Array.prototype.includes.apply(first, rest);
// }
// // for IE
// if (!String.prototype.includes) {
//     String.prototype.includes = function() {
//         'use strict';
//         return String.prototype.indexOf.apply(this, arguments) !== -1;
//     };
// }