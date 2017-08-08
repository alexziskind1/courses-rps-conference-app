import { Observable } from 'data/observable';
import { SegmentedBarItem } from 'ui/segmented-bar';
import { ConferenceDay, Speaker, RoomInfo, Session, FavouriteSession } from '../../shared/interfaces';
import { SessionViewModel } from '../session-page/session-view-model';
import { SessionsService } from '../../services/sessions-service';
import { conferenceDays } from '../../shared/static-data';
import * as favoritesServiceModule from '../../services/favorites-service';


export class MainViewModel extends Observable {
    private _selectedIndex;
    private _search = '';
    private _allSessions: Array<SessionViewModel> = new Array<SessionViewModel>();
    private _sessions: Array<SessionViewModel>;
    private _sessionsService: SessionsService;

    public selectedViewIndex: number;

    constructor() {
        super();
        this._sessionsService = new SessionsService();
        this.selectedIndex = 0;
        this.selectedViewIndex = 1;
        this.set('actionBarTitle', 'All sessions');
        this.set('isLoading', true);
        this.set('isSessionsPage', true);
        this.init();
    }

    get confDayOptions(): Array<SegmentedBarItem> {
        const items = [];
        conferenceDays.forEach(cd => {
            let segmentedBarItem = new SegmentedBarItem();
            segmentedBarItem.title = cd.title;
            items.push(segmentedBarItem);
        });
        return items;
    }

    get sessions(): Array<SessionViewModel> {
        return this._sessions;
    }

    get favorites(): Array<SessionViewModel> {
        return this.sessions.filter(i => { return i.favorite });
    }

    get search(): string {
        return this._search;
    }
    set search(value: string) {
        if (this._search !== value) {
            this._search = value;
            this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "search", value: value });

            this.filter();
        }
    }

    get selectedIndex(): number {
        return this._selectedIndex;
    }
    set selectedIndex(value: number) {
        if (this._selectedIndex !== value) {
            this._selectedIndex = value;
            this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "selectedIndex", value: value });

            this.set('dayHeader', conferenceDays[value].desc);

            if (this.search !== '') {
                this.search = '';
            } else {
                this.filter();
            }
        }
    }

    public init() {
        this._sessionsService.loadSessions<Array<Session>>()
            .then((result: Array<Session>) => {
                this.pushSessions(result);
                this.onDataLoaded();
            });
    }

    private pushSessions(sessionsFromService: Array<Session>) {
        for (var i = 0; i < sessionsFromService.length; i++) {
            var newSession = new SessionViewModel(sessionsFromService[i]);
            var indexInFavs = favoritesServiceModule.findSessionIndexInFavourites(newSession.id);
            if (indexInFavs >= 0) {
                newSession.favorite = true;
                newSession.calendarEventId = favoritesServiceModule.favourites[indexInFavs].calendarEventId;
            }
            this._allSessions.push(newSession);
        }
    }

    private onDataLoaded() {
        this.set('isLoading', false);
        this.filter();
    }

    private filter() {
        this._sessions = this._allSessions.filter(s => {
            return s.startDt.getDate() === conferenceDays[this.selectedIndex].date.getDate()
                && s.title.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) >= 0;
        });

        if (this.selectedViewIndex === 0) {
            this._sessions = this._sessions.filter(i => { return i.favorite || i.isBreak; });
        }

        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "sessions", value: this._sessions });
    }

    public selectView(index: number, titleText: string) {
        this.selectedViewIndex = index;
        if (this.selectedViewIndex < 2) {
            this.filter();
        }
        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "selectedViewIndex", value: this.selectedViewIndex });
        this.set('actionBarTitle', titleText);
        this.set('isSessionsPage', this.selectedViewIndex < 2);
    }
}
