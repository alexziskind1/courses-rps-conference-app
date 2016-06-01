"use strict";
var gestures_1 = require('ui/gestures');
var map_view_model_1 = require('../map-page/map-view-model');
var roomMapsServiceModule = require('../../services/room-map-service');
var navigationModule = require('../../shared/navigation');
var animationHelperModule = require('../../shared/animation-helper');
var vm;
function pageNavigatingTo(args) {
    var page = args.object;
    if (page && page.navigationContext) {
        vm = new map_view_model_1.MapViewModel(page.navigationContext.roomInfo);
    }
    var img = page.getViewById('imgMap');
    img.style.opacity = 0.2;
    vm.isLoading = true;
    roomMapsServiceModule.getRoomImage(vm.roomInfo, function (imageSource) {
        vm.set('image', imageSource);
        vm.isLoading = false;
        animationHelperModule.fadeIn(img);
    });
    page.bindingContext = vm;
}
exports.pageNavigatingTo = pageNavigatingTo;
function backTap(args) {
    navigationModule.goBack();
}
exports.backTap = backTap;
function backSwipe(args) {
    if (args.direction === gestures_1.SwipeDirection.right) {
        navigationModule.goBack();
    }
}
exports.backSwipe = backSwipe;
//# sourceMappingURL=map-page.js.map