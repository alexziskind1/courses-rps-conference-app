import { Session, RoomInfo, Speaker, ConferenceDay, ConfTimeSlot } from '../shared/interfaces';
import { conferenceDays } from '../shared/static-data';
import * as fileSystemModule from 'file-system';

import faker = require('faker');

let NUM_SPEAKERS = 40;
let NUM_ROOM_INFOS = 10;
let SESSION_LENGTH = 60;

export function generateSpeakers(): Array<Speaker> {
    var speakerList: Array<Speaker> = [];
    var avatarsMen = getSpeakerAvatars('images/speakers/base64/men.txt');
    var avatarsWomen = getSpeakerAvatars('images/speakers/base64/women.txt');
    for (var i = 0; i <= NUM_SPEAKERS; i++) {
        var genderBool = faker.random.boolean();
        var genderInt =  parseInt(genderBool + '');
        var firstName = faker.name.firstName(genderInt);
        var lastName = faker.name.lastName(genderInt);
        var picture = genderBool ? avatarsMen[faker.random.number(avatarsMen.length-1)] : avatarsWomen[faker.random.number(avatarsWomen.length-1)];
        
        let s: Speaker = {
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

export function generateRoomInfos(): Array<RoomInfo> {
    var roomInfoList: Array<RoomInfo> = [];
    for (var i = 0; i <= NUM_ROOM_INFOS; i++) {
        let r: RoomInfo = {
            roomId: faker.random.uuid(),
            name: faker.address.streetName() + ' ' + faker.random.number(10),
            url: faker.internet.domainName(),
            theme: faker.lorem.words(1)
        };
        roomInfoList.push(r);
    }
    return roomInfoList;
}

export function generateSessions(speakers: Array<Speaker>, roomInfos: Array<RoomInfo>) : Array<Session> {
    var sessionList: Array<Session> = [];
    var idSeed = 1000;
    for (var confDay of conferenceDays) {
        var timeSlots = generateTimeSlots(confDay);
        for (var confTimeSlot of timeSlots) {
            if (confTimeSlot.isBreak) {
                let s: Session = {
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
                var roomInfo = roomInfos[faker.random.number(roomInfos.length-1)];
                
                let s: Session = {
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

function getSpeakerAvatars(path) {
    var avatarList: Array<string> = [];
    var currentAppFolder = fileSystemModule.knownFolders.currentApp();
    var menAvatarsFile = currentAppFolder.getFile(path);
    var fileText = menAvatarsFile.readTextSync();
    
    var lines = fileText.split('\n');
    for (var i = 0; i < lines.length; i++) {
        avatarList.push('data:image/png;base64,' + lines[i]);
    }
    return avatarList;
}

function generateTimeSlots(confDay: ConferenceDay) : Array<ConfTimeSlot> {
    var timeSlotList: Array<ConfTimeSlot> = [];
    var startTimeList = getTimeRange(addMinutes(confDay.date, 240), addMinutes(confDay.date, 780), SESSION_LENGTH);
    for (var startTime of startTimeList) {
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
        var cTimeSlot: ConfTimeSlot = { title: sessionTitle, isBreak: isBreak, start: startTime, end: addMinutes(startTime, SESSION_LENGTH) };
        timeSlotList.push(cTimeSlot);
    }
    return timeSlotList;
}

function getTimeRange(startTime: Date, endTime: Date, minutesBetween: number) : Array<Date> {
    var startTimeList: Array<Date> = [];
    var diffInMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
    var periods: number = diffInMinutes / minutesBetween;
    for (var i = 0; i <= periods; i++) {
        let periodStart = addMinutes(startTime, (minutesBetween * i));
        startTimeList.push(periodStart);
    }
    return startTimeList;
}

function addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes*60000);
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
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}