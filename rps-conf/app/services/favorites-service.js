"use strict";
var appSettingsModule = require('application-settings');
var platformModule = require('platform');
var appModule = require('application');
var typesModule = require('utils/types');
var REMIDER_MINUTES = 5;
var FAVOURITES = 'FAVOURITES';
try {
    exports.favourites = JSON.parse(appSettingsModule.getString(FAVOURITES, '[]'));
}
catch (error) {
    console.log('Error while retrieveing favourites: ' + error);
    exports.favourites = new Array();
    updateFavourites();
}
function findSessionIndexInFavourites(sessionId) {
    for (var i = 0; i < exports.favourites.length; i++) {
        if (exports.favourites[i].sessionId === sessionId) {
            return i;
        }
    }
    return -1;
}
exports.findSessionIndexInFavourites = findSessionIndexInFavourites;
function addToFavourites(session) {
    if (findSessionIndexInFavourites(session.id) >= 0) {
        // Sesson already added to favourites.
        return;
    }
    try {
        if (platformModule.device.os === platformModule.platformNames.android) {
            var projection = java.lang.reflect.Array.newInstance(java.lang.String.class, 1);
            projection[0] = "_id";
            var calendars = android.net.Uri.parse('content://com.android.calendar/calendars');
            var contentResolver = appModule.android.foregroundActivity.getApplicationContext().getContentResolver();
            var managedCursor = contentResolver.query(calendars, projection, null, null, null);
            var calID;
            if (managedCursor.moveToFirst()) {
                var idCol = managedCursor.getColumnIndex(projection[0]);
                calID = managedCursor.getString(idCol);
                managedCursor.close();
            }
            if (typesModule.isUndefined(calID)) {
                // No caledndar to add to
                return;
            }
            var timeZone = java.util.TimeZone.getTimeZone('GMT-05:00');
            var startDate = session.startDt.getTime();
            var endDate = session.endDt.getTime();
            var values = new android.content.ContentValues();
            values.put("calendar_id", calID);
            values.put("eventTimezone", timeZone.getID());
            values.put("dtstart", java.lang.Long.valueOf(startDate));
            values.put("dtend", java.lang.Long.valueOf(endDate));
            values.put("title", session.title);
            values.put("eventLocation", session.room);
            var uri = contentResolver.insert(android.provider.CalendarContract.Events.CONTENT_URI, values);
            var eventId = uri.getLastPathSegment();
            session.calendarEventId = eventId;
            var reminderValues = new android.content.ContentValues();
            reminderValues.put("event_id", java.lang.Long.valueOf(java.lang.Long.parseLong(eventId)));
            reminderValues.put("method", java.lang.Long.valueOf(1)); // METHOD_ALERT
            reminderValues.put("minutes", java.lang.Long.valueOf(REMIDER_MINUTES));
            contentResolver.insert(android.provider.CalendarContract.Reminders.CONTENT_URI, reminderValues);
            persistSessionToFavourites(session);
        }
        else if (platformModule.device.os === platformModule.platformNames.ios) {
            var store = EKEventStore.new();
            store.requestAccessToEntityTypeCompletion(EKEntityTypeEvent, function (granted, error) {
                if (!granted) {
                    return;
                }
                var event = EKEvent.eventWithEventStore(store);
                event.title = session.title;
                event.timeZone = NSTimeZone.alloc().initWithName("UTC-05:00");
                event.startDate = NSDate.dateWithTimeIntervalSince1970(session.startDt.getTime() / 1000);
                event.endDate = NSDate.dateWithTimeIntervalSince1970(session.endDt.getTime() / 1000);
                event.calendar = store.defaultCalendarForNewEvents;
                event.location = session.room;
                event.addAlarm(EKAlarm.alarmWithRelativeOffset(-REMIDER_MINUTES * 60));
                var err;
                var result = store.saveEventSpanCommitError(event, EKSpan.EKSpanThisEvent, true);
                session.calendarEventId = event.eventIdentifier;
                persistSessionToFavourites(session);
            });
        }
    }
    catch (error) {
        console.log('Error while creating calendar event: ' + error);
    }
}
exports.addToFavourites = addToFavourites;
function persistSessionToFavourites(session) {
    exports.favourites.push({
        sessionId: session.id,
        calendarEventId: session.calendarEventId
    });
    updateFavourites();
}
function removeFromFavourites(session) {
    var index = findSessionIndexInFavourites(session.id);
    if (index >= 0) {
        exports.favourites.splice(index, 1);
        updateFavourites();
    }
    if (session.calendarEventId) {
        if (platformModule.device.os === platformModule.platformNames.android) {
            var deleteUri = android.content.ContentUris.withAppendedId(android.provider.CalendarContract.Events.CONTENT_URI, parseInt(session.calendarEventId));
            appModule.android.foregroundActivity.getApplicationContext().getContentResolver().delete(deleteUri, null, null);
        }
        else if (platformModule.device.os === platformModule.platformNames.ios) {
            var store = EKEventStore.new();
            store.requestAccessToEntityTypeCompletion(EKEntityTypeEvent, function (granted, error) {
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
exports.removeFromFavourites = removeFromFavourites;
function updateFavourites() {
    var newValue = JSON.stringify(exports.favourites);
    console.log('favourites: ' + newValue);
    appSettingsModule.setString(FAVOURITES, newValue);
}
//# sourceMappingURL=favorites-service.js.map