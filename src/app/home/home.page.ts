import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventResponse } from '../interfaces';
import { Subscription } from 'rxjs';
import { EventsService } from '../events.service';
import { NavController } from '@ionic/angular';
import { Network } from '@ngx-pwa/offline';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  events: EventResponse[] = [];
  sub: Subscription;
  online$ = this.network.onlineChanges;

  constructor(private eventSvc: EventsService, private nav: NavController, private network: Network) { }

  ngOnInit(): void {
    this.sub = this.eventSvc.getAll().subscribe(e => this.events.push(e));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getEvents(): EventResponse[] {
    return this.events.sort((a, b) => a.event.created > b.event.created ? -1 : 1);
  }

  onClick(id: number) {
    this.nav.navigateForward(`/details/${id}`);
  }
}
