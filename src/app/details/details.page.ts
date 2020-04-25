import { Component, OnInit } from '@angular/core';
import { EventResponse, EmergencyEvent, Acknowledgment } from '../interfaces';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  eventId: number;
  eventResponse: EventResponse;
  event: EmergencyEvent;
  acknowledgments: Acknowledgment[] = [];
  newNote = '';

  constructor(private route: ActivatedRoute, private eventSvc: EventsService) { }

  async ngOnInit() {
    this.eventId = +this.route.snapshot.params['eventId'];
    this.eventResponse = await this.eventSvc.getById(this.eventId).toPromise();
    this.event = this.eventResponse.event;
    this.acknowledgments = await this.eventSvc.getAcknowledgments(this.eventResponse).toPromise();
  }

}
