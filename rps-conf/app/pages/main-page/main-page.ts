import { EventData } from 'data/observable';
import { GestureEventData } from 'ui/gestures';
import { Page } from 'ui/page';
import { ItemEventData } from 'ui/list-view';
import { SearchBar } from 'ui/search-bar';
import { Button } from 'ui/button';
import { MainViewModel } from './main-view-model';
import { SessionViewModel } from '../session-page/session-view-model';

import * as navigationModule from '../../shared/navigation';
import * as animationHelperModule from '../../shared/animation-helper';
import * as constantsModule from '../../shared/constants';

var vm = new MainViewModel();
var page: Page;

export function pageLoaded(args: EventData) {
    page = <Page>args.object;
    hideSearchKeyboard();
    navigationModule.configurePlatformSpecificFeatures();
    page.bindingContext = vm;
}

export function selectSession(args: ItemEventData) {
    var session = <SessionViewModel>args.view.bindingContext;
    hideSearchKeyboard();

    if (!session.isBreak) {
        navigationModule.gotoSessionPage(session);
    }
}

export function selectView(args: EventData) {
    var btn = <Button>args.object;
    var slideBar = <any>page.getViewById(constantsModule.SIDE_DRAWER_ID);
    slideBar.closeDrawer();

    vm.selectView(parseInt((<any>btn).tag), btn.text);
    hideSearchKeyboard();
}

export function toggleFavorite(args: GestureEventData) {
    var session = <SessionViewModel>args.view.bindingContext;
    var gl = <any>args.object;
    var img = gl.getViewById('imgFav');
    
    animationHelperModule.popAnimate(img)
        .then(()=>{
            session.toggleFavorite();
        });
}

export function showSlideout(args: GestureEventData) {
    var slideBar = <any>page.getViewById(constantsModule.SIDE_DRAWER_ID);
    slideBar.showDrawer();
    hideSearchKeyboard();
}

function hideSearchKeyboard() {
    var searchBar = <SearchBar>page.getViewById('search');
    if (searchBar.android) {
        searchBar.android.clearFocus();
    }
    if (searchBar.ios) {
        searchBar.ios.resignFirstResponder();
    }
}

//////////////////////////////////////////////
import { Label } from 'ui/label';
import { StackLayout } from 'ui/layouts/stack-layout';

function navFactoryFunc() {
    var label = new Label();
    label.text = "App created by Nuvious";
        
    var btnBack = new Button();
    btnBack.text = "back";
    btnBack.on('tap', navigationModule.goBack);
    
    var stackLayout = new StackLayout();
    stackLayout.addChild(label);
    stackLayout.addChild(btnBack);

    var dynamicPage = new Page();
    dynamicPage.content = stackLayout;
    return dynamicPage;
};

export function goToAcknowledgementPage() {
    navigationModule.goToPageByFunction(navFactoryFunc);
}