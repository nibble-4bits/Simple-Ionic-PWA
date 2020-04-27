import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
import { EventResponse } from '../interfaces';
import { Subscription } from 'rxjs';
import { EventsService } from '../events.service';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { Network } from '@ngx-pwa/offline';
import { SwUpdate, UpdateAvailableEvent, UpdateActivatedEvent } from '@angular/service-worker';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  events: EventResponse[] = [];
  subscriptions: Subscription[] = [];
  online$ = this.network.onlineChanges;

  constructor(private eventSvc: EventsService,
              private nav: NavController,
              private network: Network,
              private updater: SwUpdate,
              private toastController: ToastController,
              private alertController: AlertController) { }

  ngOnInit(): void {
    this.subscriptions.push(this.eventSvc.getAll().subscribe(e => this.events.push(e)));

    this.initUpdater();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  initUpdater() {
    this.subscriptions.push(this.updater.available.subscribe(e => this.onUpdateAvailable(e)));
    this.subscriptions.push(this.updater.activated.subscribe(e => this.onUpdateActivated(e)));
  }

  async onUpdateAvailable(e: UpdateAvailableEvent) {
    const updateMessage = e.available.appData['updateMessage'];

    const alert = await this.alertController.create({
      header: 'Update Available!',
      message: `A new version of the application is available.
      (Details: ${updateMessage})
      Click OK to update now.`,
      buttons: [
        {
          text: 'Not now',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async () => {
            this.showToastMessage('Update deferred');
          }
        },
        {
          text: 'OK',
          handler: async () => {
            await this.updater.activateUpdate();
            window.location.reload();
          }
        }
      ]
    });

    await alert.present();
  }

  async onUpdateActivated(e: UpdateActivatedEvent) {
    await this.showToastMessage('Application updating.');
  }

  getEvents(): EventResponse[] {
    return this.events.sort((a, b) => a.event.created > b.event.created ? -1 : 1);
  }

  onClick(id: number) {
    this.nav.navigateForward(`/details/${id}`);
  }

  async showToastMessage(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      animated: true,
      position: 'top',
      buttons: [
        'OK'
      ]
    });
    toast.present();
  }
}
