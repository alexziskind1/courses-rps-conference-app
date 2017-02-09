import { FavouriteSession } from '../shared/interfaces';
import { SessionViewModel } from '../pages/session-page/session-view-model';

import * as appSettingsModule from 'application-settings';
import * as platformModule from 'platform';
import * as appModule from 'application';
import * as typesModule from 'utils/types';

/*
declare const java: any;
declare const android: any;
declare const EKEventStore: any;
declare const EKEntityTypeEvent: any;
declare const EKEvent: any;
declare const NSDate: any;
declare const NSTimeZone: any;
declare const EKAlarm: any;
declare const EKSpan: any;
*/


var REMIDER_MINUTES = 5;
var FAVOURITES = 'FAVOURITES';
export var favourites: Array<FavouriteSession>;
try {
    favourites = <Array<FavouriteSession>>JSON.parse(appSettingsModule.getString(FAVOURITES, '[]'));
}
catch (error) {
    console.log('Error while retrieveing favourites: ' + error);
    favourites = new Array<FavouriteSession>();
    updateFavourites();
}

export function findSessionIndexInFavourites(sessionId: string): number {
    for (var i = 0; i < favourites.length; i++) {
        if (favourites[i].sessionId === sessionId) {
            return i;
        }
    }
    return -1;
}

export function addToFavourites(session: SessionViewModel) {
    if (findSessionIndexInFavourites(session.id) >= 0) {
        // Sesson already added to favourites.
        return;
    }
    try {
        persistSessionToFavourites(session);
    }
    catch (error) {
        console.log('Error while storing session: ' + error);
    }
}

function persistSessionToFavourites(session: SessionViewModel) {
    favourites.push({
        sessionId: session.id,
        calendarEventId: session.calendarEventId
    });
    updateFavourites();
}

export function removeFromFavourites(session: SessionViewModel) {
    var index = findSessionIndexInFavourites(session.id);
    if (index >= 0) {
        favourites.splice(index, 1);
        updateFavourites();
    }

    if (session.calendarEventId) {
        if (platformModule.device.os === platformModule.platformNames.android) {
            var deleteUri = android.content.ContentUris.withAppendedId(android.provider.CalendarContract.Events.CONTENT_URI, parseInt(session.calendarEventId));
            appModule.android.foregroundActivity.getApplicationContext().getContentResolver().delete(deleteUri, null, null);
        } else if (platformModule.device.os === platformModule.platformNames.ios) {
            var store = EKEventStore.new()
            store.requestAccessToEntityTypeCompletion(EKEntityTypeEvent, (granted: boolean, error: any/* NSError*/) => {
                if (!granted) {
                    return;
                }

                var eventToRemove = store.eventWithIdentifier(session.calendarEventId);
                if (eventToRemove) {
                    store.removeEventSpanCommitError(eventToRemove, EKSpan.EKSpanThisEvent, true);
                    session.calendarEventId = undefined;
                }
            });
        }
    }
}

function updateFavourites() {
    var newValue = JSON.stringify(favourites);
    console.log('favourites: ' + newValue);
    appSettingsModule.setString(FAVOURITES, newValue);
}