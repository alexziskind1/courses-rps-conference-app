import { RoomInfo } from '../shared/interfaces';
import * as imageSourceModule from 'image-source';

export var defaultImageSource = imageSourceModule.fromFile('~/images/rooms/conf-map.png');

export function getRoomImage(info: RoomInfo, update: (image: imageSourceModule.ImageSource) => void ) {
    
    //simulate image loading from remote source
    setTimeout(function() {
        update(defaultImageSource);
    }, 1000);
}