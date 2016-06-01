import { Observable } from 'data/observable';
import * as favoritesServiceModule from '../services/favorites-service';

export interface ConferenceDay {
    date: Date;
    title: string;
    desc: string;
}

export interface Speaker {
    id: string;
    name: string;
    title: string;
    company: string;
    picture: string;
    twitterName: string;
}

export interface RoomInfo {
    roomId: string;
    name: string;
    url: string;
    theme: string;
}

export interface Session {
    id: string;
    title: string;
    start: string;
    end: string;
    room: string;
    roomInfo: RoomInfo;
    speakers: Array<Speaker>;
    description: string;
    descriptionShort: string;
    calendarEventId: string;
    isBreak: boolean;
}

export interface FavouriteSession {
    sessionId: string;
    calendarEventId: string;
}

export interface ConfTimeSlot {
    title: string;
    isBreak: boolean;
    start: Date;
    end: Date;
}