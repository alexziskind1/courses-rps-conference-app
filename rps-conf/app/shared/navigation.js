"use strict";
var frameModule = require('ui/frame');
function startingPage() {
    return 'pages/main-page/main-page';
}
exports.startingPage = startingPage;
function gotoSessionPage(session) {
    frameModule.topmost().navigate({
        moduleName: 'pages/session-page/session-page',
        context: session
    });
}
exports.gotoSessionPage = gotoSessionPage;
function goToRoomMapPage(session) {
    frameModule.topmost().navigate({
        moduleName: 'pages/map-page/map-page',
        context: session,
        transition: {
            name: "fade",
            duration: 1000,
            curve: "easeIn"
        }
    });
}
exports.goToRoomMapPage = goToRoomMapPage;
function goBack() {
    frameModule.topmost().goBack();
}
exports.goBack = goBack;
function configurePlatformSpecificFeatures() {
    // Enable platform specific feature (in this case Android page caching)
    if (frameModule.topmost().android) {
        frameModule.topmost().android.cachePagesOnNavigate = true;
    }
    var iosFrame = frameModule.topmost().ios;
    if (iosFrame) {
        // Fix status bar color and nav bar vidibility
        iosFrame.controller.view.window.backgroundColor = UIColor.blackColor();
        iosFrame.navBarVisibility = 'never';
    }
}
exports.configurePlatformSpecificFeatures = configurePlatformSpecificFeatures;
function goToPageByFunction(factoryFunc) {
    frameModule.topmost().navigate(factoryFunc);
}
exports.goToPageByFunction = goToPageByFunction;
//# sourceMappingURL=navigation.js.map