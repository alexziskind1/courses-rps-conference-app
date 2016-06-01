"use strict";
var observable_1 = require('data/observable');
var MapViewModel = (function (_super) {
    __extends(MapViewModel, _super);
    function MapViewModel(roomInfo) {
        _super.call(this);
        this._isLoading = false;
        this._roomInfo = roomInfo;
    }
    Object.defineProperty(MapViewModel.prototype, "roomInfo", {
        get: function () {
            return this._roomInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapViewModel.prototype, "name", {
        get: function () {
            return this._roomInfo.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapViewModel.prototype, "isLoading", {
        get: function () {
            return this._isLoading;
        },
        set: function (value) {
            this._isLoading = value;
            this.notify({ object: this, eventName: observable_1.Observable.propertyChangeEvent, propertyName: 'isLoading', value: this._isLoading });
        },
        enumerable: true,
        configurable: true
    });
    return MapViewModel;
}(observable_1.Observable));
exports.MapViewModel = MapViewModel;
//# sourceMappingURL=map-view-model.js.map