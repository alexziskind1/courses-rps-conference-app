"use strict";
var observable_1 = require('data/observable');
var session_view_model_1 = require('../session-page/session-view-model');
var sessions_service_1 = require('../../services/sessions-service');
var static_data_1 = require('../../shared/static-data');
var favoritesServiceModule = require('../../services/favorites-service');
var MainViewModel = (function (_super) {
    __extends(MainViewModel, _super);
    function MainViewModel() {
        _super.call(this);
        this._search = '';
        this._allSessions = new Array();
        this._sessionsService = new sessions_service_1.SessionsService();
        this.selectedIndex = 0;
        this.selectedViewIndex = 1;
        this.set('actionBarTitle', 'All sessions');
        this.set('isLoading', true);
        this.set('isSessionsPage', true);
        this.init();
    }
    Object.defineProperty(MainViewModel.prototype, "confDayOptions", {
        get: function () {
            return static_data_1.conferenceDays;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainViewModel.prototype, "sessions", {
        get: function () {
            return this._sessions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainViewModel.prototype, "favorites", {
        get: function () {
            return this.sessions.filter(function (i) { return i.favorite; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainViewModel.prototype, "search", {
        get: function () {
            return this._search;
        },
        set: function (value) {
            if (this._search !== value) {
                this._search = value;
                this.notify({ object: this, eventName: observable_1.Observable.propertyChangeEvent, propertyName: "search", value: value });
                this.filter();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainViewModel.prototype, "selectedIndex", {
        get: function () {
            return this._selectedIndex;
        },
        set: function (value) {
            if (this._selectedIndex !== value) {
                this._selectedIndex = value;
                this.notify({ object: this, eventName: observable_1.Observable.propertyChangeEvent, propertyName: "selectedIndex", value: value });
                this.set('dayHeader', static_data_1.conferenceDays[value].desc);
                if (this.search !== '') {
                    this.search = '';
                }
                else {
                    this.filter();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    MainViewModel.prototype.init = function () {
        var _this = this;
        this._sessionsService.loadSessions()
            .then(function (result) {
            _this.pushSessions(result);
            _this.onDataLoaded();
        });
    };
    MainViewModel.prototype.pushSessions = function (sessionsFromService) {
        for (var i = 0; i < sessionsFromService.length; i++) {
            var newSession = new session_view_model_1.SessionViewModel(sessionsFromService[i]);
            var indexInFavs = favoritesServiceModule.findSessionIndexInFavourites(newSession.id);
            if (indexInFavs >= 0) {
                newSession.favorite = true;
                newSession.calendarEventId = favoritesServiceModule.favourites[indexInFavs].calendarEventId;
            }
            this._allSessions.push(newSession);
        }
    };
    MainViewModel.prototype.onDataLoaded = function () {
        this.set('isLoading', false);
        this.filter();
    };
    MainViewModel.prototype.filter = function () {
        var _this = this;
        this._sessions = this._allSessions.filter(function (s) {
            return s.startDt.getDate() === static_data_1.conferenceDays[_this.selectedIndex].date.getDate()
                && s.title.toLocaleLowerCase().indexOf(_this.search.toLocaleLowerCase()) >= 0;
        });
        if (this.selectedViewIndex === 0) {
            this._sessions = this._sessions.filter(function (i) { return i.favorite || i.isBreak; });
        }
        this.notify({ object: this, eventName: observable_1.Observable.propertyChangeEvent, propertyName: "sessions", value: this._sessions });
    };
    MainViewModel.prototype.selectView = function (index, titleText) {
        this.selectedViewIndex = index;
        if (this.selectedViewIndex < 2) {
            this.filter();
        }
        this.notify({ object: this, eventName: observable_1.Observable.propertyChangeEvent, propertyName: "selectedViewIndex", value: this.selectedViewIndex });
        this.set('actionBarTitle', titleText);
        this.set('isSessionsPage', this.selectedViewIndex < 2);
    };
    return MainViewModel;
}(observable_1.Observable));
exports.MainViewModel = MainViewModel;
//# sourceMappingURL=main-view-model.js.map