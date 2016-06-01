"use strict";
var enums_1 = require('ui/enums');
var duration = 250;
var scaleFactor = 1.8;
function popAnimate(view) {
    var defPopUp = {
        duration: duration,
        curve: enums_1.AnimationCurve.easeIn,
        scale: { x: scaleFactor, y: scaleFactor }
    };
    var defPopDown = {
        duration: duration,
        curve: enums_1.AnimationCurve.easeOut,
        scale: { x: 1.0, y: 1.0 }
    };
    return view.animate(defPopUp)
        .then(function () {
        view.animate(defPopDown);
    });
}
exports.popAnimate = popAnimate;
function fadeIn(view) {
    return view.animate({
        opacity: 1.0,
        duration: duration
    });
}
exports.fadeIn = fadeIn;
//# sourceMappingURL=animation-helper.js.map