"use strict";
var page_1 = require('ui/page');
var button_1 = require('ui/button');
var main_view_model_1 = require('./main-view-model');
var navigationModule = require('../../shared/navigation');
var animationHelperModule = require('../../shared/animation-helper');
var constantsModule = require('../../shared/constants');
var vm = new main_view_model_1.MainViewModel();
var page;
function pageLoaded(args) {
    page = args.object;
    hideSearchKeyboard();
    navigationModule.configurePlatformSpecificFeatures();
    page.bindingContext = vm;
}
exports.pageLoaded = pageLoaded;
function selectSession(args) {
    var session = args.view.bindingContext;
    hideSearchKeyboard();
    if (!session.isBreak) {
        navigationModule.gotoSessionPage(session);
    }
}
exports.selectSession = selectSession;
function selectView(args) {
    var btn = args.object;
    var slideBar = page.getViewById(constantsModule.SIDE_DRAWER_ID);
    slideBar.closeDrawer();
    vm.selectView(parseInt(btn.tag), btn.text);
    hideSearchKeyboard();
}
exports.selectView = selectView;
function toggleFavorite(args) {
    var session = args.view.bindingContext;
    var gl = args.object;
    var img = gl.getViewById('imgFav');
    animationHelperModule.popAnimate(img)
        .then(function () {
        session.toggleFavorite();
    });
}
exports.toggleFavorite = toggleFavorite;
function showSlideout(args) {
    var slideBar = page.getViewById(constantsModule.SIDE_DRAWER_ID);
    slideBar.showDrawer();
    hideSearchKeyboard();
}
exports.showSlideout = showSlideout;
function hideSearchKeyboard() {
    var searchBar = page.getViewById('search');
    if (searchBar.android) {
        searchBar.android.clearFocus();
    }
    if (searchBar.ios) {
        searchBar.ios.resignFirstResponder();
    }
}
//////////////////////////////////////////////
var label_1 = require('ui/label');
var stack_layout_1 = require('ui/layouts/stack-layout');
function navFactoryFunc() {
    var label = new label_1.Label();
    label.text = "App created by Nuvious";
    var btnBack = new button_1.Button();
    btnBack.text = "back";
    btnBack.on('tap', navigationModule.goBack);
    var stackLayout = new stack_layout_1.StackLayout();
    stackLayout.addChild(label);
    stackLayout.addChild(btnBack);
    var dynamicPage = new page_1.Page();
    dynamicPage.content = stackLayout;
    return dynamicPage;
}
;
function goToAcknowledgementPage() {
    navigationModule.goToPageByFunction(navFactoryFunc);
}
exports.goToAcknowledgementPage = goToAcknowledgementPage;
//# sourceMappingURL=main-page.js.map