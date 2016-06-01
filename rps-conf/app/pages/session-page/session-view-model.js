"use strict";
var observable_1 = require('data/observable');
var favoritesServiceModule = require('../../services/favorites-service');
var SessionViewModel = (function (_super) {
    __extends(SessionViewModel, _super);
    function SessionViewModel(source) {
        _super.call(this);
        if (source) {
            this._session = source;
            this._startDt = this.fixDate(new Date(source.start));
            this._endDt = this.fixDate(new Date(source.end));
        }
    }
    SessionViewModel.prototype.fixDate = function (date) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    };
    Object.defineProperty(SessionViewModel.prototype, "id", {
        get: function () {
            return this._session.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionViewModel.prototype, "title", {
        get: function () {
            return this._session.title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionViewModel.prototype, "room", {
        get: function () {
            if (this._session.room) {
                return this._session.room;
            }
            if (this._session.roomInfo) {
                return this._session.roomInfo.name;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionViewModel.prototype, "roomInfo", {
        get: function () {
            return this._session.roomInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionViewModel.prototype, "start", {
        get: function () {
            return this._session.start;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionViewModel.prototype, "end", {
        get: function () {
            return this._session.end;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionViewModel.prototype, "startDt", {
        get: function () {
            return this._startDt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionViewModel.prototype, "endDt", {
        get: function () {
            return this._endDt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionViewModel.prototype, "speakers", {
        get: function () {
            return this._session.speakers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionViewModel.prototype, "range", {
        get: function () {
            var startMinutes = this.startDt.getMinutes() + '';
            var endMinutes = this.endDt.getMinutes() + '';
            var startAM = this.startDt.getHours() < 12 ? 'am' : 'pm';
            var endAM = this.endDt.getHours() < 12 ? 'am' : 'pm';
            var startHours = (this.startDt.getHours() <= 12 ? this.startDt.getHours() : this.startDt.getHours() - 12) + '';
            var endHours = (this.endDt.getHours() <= 12 ? this.endDt.getHours() : this.endDt.getHours() - 12) + '';
            return (startHours.length === 1 ? '0' + startHours : startHours) + ':' + (startMinutes.length === 1 ? '0' + startMinutes : startMinutes) + startAM +
                ' - ' + (endHours.length === 1 ? '0' + endHours : endHours) + ':' + (endMinutes.length === 1 ? '0' + endMinutes : endMinutes) + endAM;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionViewModel.prototype, "isBreak", {
        get: function () {
            return this._session.isBreak;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionViewModel.prototype, "favorite", {
        get: function () {
            return this._favorite;
        },
        set: function (value) {
            if (this._favorite !== value && !this._session.isBreak) {
                this._favorite = value;
                this.notify({ object: this, eventName: observable_1.Observable.propertyChangeEvent, propertyName: 'favorite', value: this._favorite });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionViewModel.prototype, "description", {
        get: function () {
            return this._session.description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionViewModel.prototype, "descriptionShort", {
        get: function () {
            if (this.description.length > 160) {
                return this.description.substr(0, 160) + '...';
            }
            else {
                return this.description;
            }
        },
        enumerable: true,
        configurable: true
    });
    SessionViewModel.prototype.toggleFavorite = function () {
        this.favorite = !this.favorite;
        if (this.favorite) {
            favoritesServiceModule.addToFavourites(this);
        }
        else {
            favoritesServiceModule.removeFromFavourites(this);
        }
    };
    Object.defineProperty(SessionViewModel.prototype, "calendarEventId", {
        get: function () {
            return this._calendarEventId;
        },
        set: function (value) {
            if (this._calendarEventId !== value) {
                this._calendarEventId = value;
                this.notify({ object: this, eventName: observable_1.Observable.propertyChangeEvent, propertyName: 'calendarEventId', value: this._calendarEventId });
            }
        },
        enumerable: true,
        configurable: true
    });
    return SessionViewModel;
}(observable_1.Observable));
exports.SessionViewModel = SessionViewModel;
//# sourceMappingURL=session-view-model.js.map