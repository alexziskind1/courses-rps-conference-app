"use strict";
var httpModule = require('http');
var constantsModule = require('../shared/constants');
var fakeDataServiceModule = require('./fake-data-service');
var SessionsService = (function () {
    function SessionsService() {
        this._useHttpService = false;
    }
    SessionsService.prototype.loadSessions = function () {
        if (this._useHttpService) {
            return this.loadSessionsViaHttp();
        }
        else {
            return this.loadSessionsViaFaker();
        }
    };
    SessionsService.prototype.loadSessionsViaHttp = function () {
        var reqParams = {
            url: constantsModule.AZURE_URL + constantsModule.AZURE_TABLE_PATH + constantsModule.AZURE_TABLE_NAME + '?$orderby=start',
            method: 'GET',
            headers: constantsModule.AZURE_VERSION_HEADER
        };
        return httpModule.getJSON(reqParams);
    };
    SessionsService.prototype.loadSessionsViaFaker = function () {
        return new Promise(function (resolve, reject) {
            var speakers = fakeDataServiceModule.generateSpeakers();
            var roomInfos = fakeDataServiceModule.generateRoomInfos();
            var sessions = fakeDataServiceModule.generateSessions(speakers, roomInfos);
            resolve(sessions);
        });
    };
    return SessionsService;
}());
exports.SessionsService = SessionsService;
//# sourceMappingURL=sessions-service.js.map