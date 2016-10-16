import * as appModule from 'application';
import * as navigationModule from './shared/navigation';

if (appModule.android) {
    appModule.on(appModule.launchEvent, function (args) {
        appModule.android.onActivityCreated = function (activity) {
            console.log('onCreated');
            var id = activity.getResources().getIdentifier('AppTheme', 'style', activity.getPackageName());
            activity.setTheme(id);
        }

        appModule.android.onActivityStarted = function (activity) {
            console.log('onStarted');
            var window = activity.getWindow();
            if (window) {
                window.setBackgroundDrawable(null);
            }
        }
    });

}

// Set the start module for the application
(<any>appModule).mainModule = navigationModule.startingPage();
(<any>appModule).cssFile = 'styles/app.css';

// Start the application
appModule.start();
