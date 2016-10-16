import { EventData } from 'data/observable';
import { GestureEventData, SwipeGestureEventData, SwipeDirection } from 'ui/gestures';
import { Page, NavigatedData } from 'ui/page';
import { Button } from 'ui/button';
import { Label } from 'ui/label';
import { ScrollView } from 'ui/scroll-view';
import { ListView } from 'ui/list-view';
import { SessionViewModel } from '../session-page/session-view-model';

import * as frameModule from 'ui/frame';
import * as platformModule from 'platform';
import * as utilsModule from 'utils/utils';
import * as navigationModule from '../../shared/navigation';
import * as animationHelperModule from '../../shared/animation-helper';


declare var android, UIActivityViewController;

var vm: SessionViewModel;
var page: Page;

export function pageNavigatingTo(args: NavigatedData) {
    page = <Page>args.object;
    vm = <SessionViewModel>page.navigationContext;
    page.bindingContext = vm;
}

export function toggleFavorite(args: GestureEventData) {
    var gl = <any>args.object;
    var img = gl.getViewById('imgFav');

    animationHelperModule.popAnimate(img)
        .then(() => {
            vm.toggleFavorite();
        });
}

export function shareTap(args: GestureEventData) {
    var shareText = vm.title + ' ';

    if (vm.speakers) {
        var speakerNames = '';
        var byStr = vm.speakers.forEach((sp, i, arr) => {
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

        let controllerOptions = { activityItems: utilsModule.ios.collections.jsArrayToNSArray([shareText]), applicationActivities: null };
        var controller = new UIActivityViewController(controllerOptions);

        (<any>currentPage.ios).presentViewControllerAnimatedCompletion(controller, true, null);
    }
}

export function toogleDescription(args: EventData) {
    var btn = <Button>args.object;
    var txtDesc = <Label>page.getViewById('txtDescription');
    var scroll = <ScrollView>page.getViewById('scroll');

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

export function backTap(args: GestureEventData) {
    navigationModule.goBack();
}

export function showMapTap(args: GestureEventData) {
    navigationModule.goToRoomMapPage(vm);
}

export function backSwipe(args: SwipeGestureEventData) {
    if (args.direction === SwipeDirection.right) {
        navigationModule.goBack();
    }
}