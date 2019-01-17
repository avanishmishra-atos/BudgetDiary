import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { WindowRef } from './window.ref';

@Injectable()
export class DisplayNotificationService {
    isWindowActive: boolean;

    constructor(private _notificationService: NotificationsService,
        private winRef: WindowRef) {
        this.winRef.nativeWindow.onfocus = function() {
            console.log('Window Activated');
            this.isWindowActive = true;
        };
        this.winRef.nativeWindow.onblur = function() {
            console.log('Out of focus');
            this.isWindowActive = false;
        };
    }

    /**
     * Display notification on screen
     * @param  {string} message Message to be displayed
     * @param  {string} type    Type of messages, allowed values are 'info', 'success','error','warning'
     * @return {[type]}         [description]
     */
    showToastNotification(message: string, type: string) {
        switch (type.toLowerCase()) {
            case 'info': this._notificationService.info('Info:', message);
            break;
            case 'success': this._notificationService.success('Success:', message);
            break;
            case 'error': this._notificationService.error('Error:', message);
            break;
            case 'warning': this._notificationService.warn('Warning:', message);
            break;
            default: this._notificationService.info('Info:', message);
            break;
        }
    }
}
