"use strict";
var static_data_1 = require('../shared/static-data');
var fileSystemModule = require('file-system');
var faker = require('faker');
var NUM_SPEAKERS = 40;
var NUM_ROOM_INFOS = 10;
var SESSION_LENGTH = 60;
function generateSpeakers() {
    var speakerList = [];
    var avatarsMen = getSpeakerAvatars('images/speakers/base64/men.txt');
    var avatarsWomen = getSpeakerAvatars('images/speakers/base64/women.txt');
    for (var i = 0; i <= NUM_SPEAKERS; i++) {
        var genderBool = faker.random.boolean();
        var genderInt = parseInt(genderBool + '');
        var firstName = faker.name.firstName(genderInt);
        var lastName = faker.name.lastName(genderInt);
        var picture = genderBool ? avatarsMen[faker.random.number(avatarsMen.length - 1)] : avatarsWomen[faker.random.number(avatarsWomen.length - 1)];
        var s = {
            id: faker.random.uuid(),
            name: firstName + ' ' + lastName,
            title: faker.name.jobTitle(),
            company: faker.company.companyName(),
            picture: picture,
            twitterName: '@' + faker.internet.userName(firstName, lastName),
        };
        speakerList.push(s);
    }
    return speakerList;
}
exports.generateSpeakers = generateSpeakers;
function generateRoomInfos() {
    var roomInfoList = [];
    for (var i = 0; i <= NUM_ROOM_INFOS; i++) {
        var r = {
            roomId: faker.random.uuid(),
            name: faker.address.streetName() + ' ' + faker.random.number(10),
            url: faker.internet.domainName(),
            theme: faker.lorem.words(1)
        };
        roomInfoList.push(r);
    }
    return roomInfoList;
}
exports.generateRoomInfos = generateRoomInfos;
function generateSessions(speakers, roomInfos) {
    var sessionList = [];
    var idSeed = 1000;
    for (var _i = 0, conferenceDays_1 = static_data_1.conferenceDays; _i < conferenceDays_1.length; _i++) {
        var confDay = conferenceDays_1[_i];
        var timeSlots = generateTimeSlots(confDay);
        for (var _a = 0, timeSlots_1 = timeSlots; _a < timeSlots_1.length; _a++) {
            var confTimeSlot = timeSlots_1[_a];
            if (confTimeSlot.isBreak) {
                var s = {
                    id: (idSeed++).toString(),
                    title: toTitleCase(confTimeSlot.title),
                    isBreak: true,
                    start: confTimeSlot.start.toString(),
                    end: confTimeSlot.end.toString(),
                    room: '',
                    roomInfo: null,
                    speakers: [],
                    description: '',
                    descriptionShort: '',
                    calendarEventId: ''
                };
                sessionList.push(s);
            }
            else {
                var subSpeakers = getRandomArrayElements(speakers, faker.random.number(3));
                var roomInfo = roomInfos[faker.random.number(roomInfos.length - 1)];
                var s = {
                    id: (idSeed++).toString(),
                    title: toTitleCase(faker.company.bs()),
                    isBreak: false,
                    start: confTimeSlot.start.toString(),
                    end: confTimeSlot.end.toString(),
                    room: roomInfo.name,
                    roomInfo: roomInfo,
                    speakers: subSpeakers,
                    description: faker.lorem.paragraph(),
                    descriptionShort: faker.lorem.sentence(),
                    calendarEventId: faker.random.uuid()
                };
                sessionList.push(s);
            }
        }
    }
    return sessionList;
}
exports.generateSessions = generateSessions;
function getSpeakerAvatars(path) {
    var avatarList = [];
    var currentAppFolder = fileSystemModule.knownFolders.currentApp();
    var menAvatarsFile = currentAppFolder.getFile(path);
    var fileText = menAvatarsFile.readTextSync();
    var lines = fileText.split('\n');
    for (var i = 0; i < lines.length; i++) {
        avatarList.push('data:image/png;base64,' + lines[i]);
    }
    return avatarList;
}
function generateTimeSlots(confDay) {
    var timeSlotList = [];
    var startTimeList = getTimeRange(addMinutes(confDay.date, 240), addMinutes(confDay.date, 780), SESSION_LENGTH);
    for (var _i = 0, startTimeList_1 = startTimeList; _i < startTimeList_1.length; _i++) {
        var startTime = startTimeList_1[_i];
        var isBreak = false;
        var sessionTitle = '';
        if (startTime.getHours() == 4) {
            isBreak = true;
            sessionTitle = 'Welcome Message';
        }
        else if (startTime.getHours() == 8) {
            isBreak = true;
            sessionTitle = 'Lunch Break';
        }
        var cTimeSlot = { title: sessionTitle, isBreak: isBreak, start: startTime, end: addMinutes(startTime, SESSION_LENGTH) };
        timeSlotList.push(cTimeSlot);
    }
    return timeSlotList;
}
function getTimeRange(startTime, endTime, minutesBetween) {
    var startTimeList = [];
    var diffInMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
    var periods = diffInMinutes / minutesBetween;
    for (var i = 0; i <= periods; i++) {
        var periodStart = addMinutes(startTime, (minutesBetween * i));
        startTimeList.push(periodStart);
    }
    return startTimeList;
}
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}
function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}
//# sourceMappingURL=fake-data-service.js.map