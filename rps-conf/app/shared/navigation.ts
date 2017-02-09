import * as frameModule from 'ui/frame';

declare const UIColor: any;

export function startingPage() {
    return 'pages/main-page/main-page';
}

export function gotoSessionPage(session) {
    frameModule.topmost().navigate({
        moduleName: 'pages/session-page/session-page',
        context: session
    });
}

export function goToRoomMapPage(session) {
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

export function goBack() {
    frameModule.topmost().goBack();
}

export function configurePlatformSpecificFeatures() {
    // Enable platform specific feature (in this case Android page caching)
    if (frameModule.topmost().android) {
        frameModule.topmost().android.cachePagesOnNavigate = true;
    }

    var iosFrame = frameModule.topmost().ios;
    if (iosFrame) {
        // Fix status bar color and nav bar vidibility
        iosFrame.controller.view.window.backgroundColor = UIColor.blackColor;
        iosFrame.navBarVisibility = 'never';
    }
}

export function goToPageByFunction(factoryFunc) {
    frameModule.topmost().navigate(factoryFunc);
}
