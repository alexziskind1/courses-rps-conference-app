"use strict";
var imageSourceModule = require('image-source');
exports.defaultImageSource = imageSourceModule.fromFile('~/images/rooms/conf-map.png');
function getRoomImage(info, update) {
    //simulate image loading from remote source
    setTimeout(function () {
        update(exports.defaultImageSource);
    }, 1000);
}
exports.getRoomImage = getRoomImage;
//# sourceMappingURL=room-map-service.js.map