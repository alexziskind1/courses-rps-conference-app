import { Page, NavigatedData } from 'ui/page';
import { GestureEventData, SwipeGestureEventData, SwipeDirection } from 'ui/gestures';
import { RoomInfo } from '../../shared/interfaces';
import { MapViewModel } from '../map-page/map-view-model';

import * as roomMapsServiceModule from '../../services/room-map-service';
import * as navigationModule from '../../shared/navigation';
import * as animationHelperModule from '../../shared/animation-helper';

var vm: MapViewModel;

export function pageNavigatingTo(args: NavigatedData) {
    var page = <Page>args.object;
    
    if (page && page.navigationContext) {
        vm = new MapViewModel(<RoomInfo>page.navigationContext.roomInfo);
    }
    
    var img = <any>page.getViewById('imgMap');
    img.style.opacity = 0.2;
    vm.isLoading = true;
    
    roomMapsServiceModule.getRoomImage(vm.roomInfo, function (imageSource) {
        vm.set('image', imageSource);
        vm.isLoading = false;
        animationHelperModule.fadeIn(img);
    });

    page.bindingContext = vm;
}

export function backTap(args: GestureEventData) {
    navigationModule.goBack();
}

export function backSwipe(args: SwipeGestureEventData) {
    if (args.direction === SwipeDirection.right) {
        navigationModule.goBack();
    }
}