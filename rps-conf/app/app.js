"use strict";
var appModule = require('application');
var navigationModule = require('./shared/navigation');
if (appModule.android) {
    appModule.onLaunch = function (intent) {
        console.log('onLaunch');
        appModule.android.onActivityCreated = function (activity) {
            console.log('onCreated');
            var id = activity.getResources().getIdentifier('AppTheme', 'style', activity.getPackageName());
            activity.setTheme(id);
        };
        appModule.android.onActivityStarted = function (activity) {
            console.log('onStarted');
            var window = activity.getWindow();
            if (window) {
                window.setBackgroundDrawable(null);
            }
        };
    };
}
// Set the start module for the application
appModule.mainModule = navigationModule.startingPage();
appModule.cssFile = 'styles/app.css';
// Start the application
appModule.start();
//# sourceMappingURL=app.js.map