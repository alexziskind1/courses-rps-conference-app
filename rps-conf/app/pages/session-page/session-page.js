"use strict";
var gestures_1 = require('ui/gestures');
var frameModule = require('ui/frame');
var platformModule = require('platform');
var utilsModule = require('utils/utils');
var navigationModule = require('../../shared/navigation');
var animationHelperModule = require('../../shared/animation-helper');
var vm;
var page;
function pageNavigatingTo(args) {
    page = args.object;
    vm = page.navigationContext;
    page.bindingContext = vm;
}
exports.pageNavigatingTo = pageNavigatingTo;
function toggleFavorite(args) {
    var gl = args.object;
    var img = gl.getViewById('imgFav');
    animationHelperModule.popAnimate(img)
        .then(function () {
        vm.toggleFavorite();
    });
}
exports.toggleFavorite = toggleFavorite;
function shareTap(args) {
    var shareText = vm.title + ' ';
    if (vm.speakers) {
        var speakerNames = '';
        var byStr = vm.speakers.forEach(function (sp, i, arr) {
            if (sp.twitterName) {
                speakerNames += sp.twitterName + ' ';
            }
        });
        if (speakerNames) {
            shareText += 'by ' + speakerNames;
        }
    }
    shareText += ' #RPSConf';
    if (platformModule.device.os === platformModule.platformNames.android) {
        var intent = new android.content.Intent(android.content.Intent.ACTION_SEND);
        intent.setType('text/plain');
        intent.putExtra(android.content.Intent.EXTRA_SUBJECT, 'subject');
        intent.putExtra(android.content.Intent.EXTRA_TEXT, shareText);
        var activity = frameModule.topmost().android.activity;
        activity.startActivity(android.content.Intent.createChooser(intent, 'share'));
    }
    else if (platformModule.device.os === platformModule.platformNames.ios) {
        var currentPage = frameModule.topmost().currentPage;
        var controller = new UIActivityViewController(utilsModule.ios.collections.jsArrayToNSArray([shareText]), null);
        currentPage.ios.presentViewControllerAnimatedCompletion(controller, true, null);
    }
}
exports.shareTap = shareTap;
function toogleDescription(args) {
    var btn = args.object;
    var txtDesc = page.getViewById('txtDescription');
    var scroll = page.getViewById('scroll');
    if (btn.text === 'MORE') {
        btn.text = 'LESS';
        txtDesc.text = vm.description;
    }
    else {
        btn.text = 'MORE';
        txtDesc.text = vm.descriptionShort;
        scroll.scrollToVerticalOffset(0, false);
    }
}
exports.toogleDescription = toogleDescription;
function backTap(args) {
    navigationModule.goBack();
}
exports.backTap = backTap;
function showMapTap(args) {
    navigationModule.goToRoomMapPage(vm);
}
exports.showMapTap = showMapTap;
function backSwipe(args) {
    if (args.direction === gestures_1.SwipeDirection.right) {
        navigationModule.goBack();
    }
}
exports.backSwipe = backSwipe;
//# sourceMappingURL=session-page.js.map