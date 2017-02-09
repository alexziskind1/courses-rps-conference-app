import * as appModule from 'application';
import * as navigationModule from './shared/navigation';
import * as frameModule from 'ui/frame';

if (appModule.android) {
    appModule.on('launch', () => {
        console.log('onLaunch');
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
let navEntry: frameModule.NavigationEntry = {
    moduleName: navigationModule.startingPage()
};

// Start the application
appModule.start(navEntry);
