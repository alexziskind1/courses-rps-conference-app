import { Observable } from 'data/observable';
import { ImageSource } from 'image-source';
import { RoomInfo } from '../../shared/interfaces';

export class MapViewModel extends Observable {
    constructor(roomInfo: RoomInfo) {
        super();
        this._roomInfo = roomInfo;
    }
    
    private _roomInfo: RoomInfo;
    private _isLoading: boolean = false;
    public image: ImageSource;
    
    get roomInfo() {
        return this._roomInfo;
    }
    
    get name(): string {
        return this._roomInfo.name;
    }
    
    get isLoading(): boolean {
        return this._isLoading;
    }
    set isLoading(value: boolean) {
        this._isLoading = value;
        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'isLoading', value: this._isLoading });
    }
}