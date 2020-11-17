import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, Renderer2 } from '@angular/core';
import {PeopleService} from '../shared/people.service';
import {mergeMap} from 'rxjs/operators';
import { timer } from 'rxjs';

@Component({
  selector: 'pwa-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
  person: any = {};
  infiniteObs;
  doCheck = false;
  constructor(private peopleService: PeopleService,
     private element: ElementRef,
     private renderer: Renderer2,
     private cdr: ChangeDetectorRef,
     private zone: NgZone) {}

  tick(): void {
    this.renderer.setStyle(this.element.nativeElement, 'color', '#FF0000');
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.renderer.setStyle(this.element.nativeElement, 'color', '#000000');
      }, 500);
    });
  }

  /**
   * OnInit implementation
   */
  ngOnInit() {
    this.peopleService.fetchRandom().subscribe(person => this.person = person);
    this.infiniteObs = timer(1, 5000);
    this.infiniteObs.pipe(
      mergeMap(() => this.peopleService.fetchRandom())
    ).subscribe(person => {
      this.person.id = person.id;
      this.person.photo = person.photo;
      this.person.firstname = person.firstname;
      this.person.lastname = person.lastname;
      this.person.entity = person.entity;
      this.person.entryDate = person.entryDate;
      this.person.birthDate = person.birthDate;
      this.person.gender = person.gender;
      this.person.email = person.email;
      this.person.skills = person.skills;
      this.person.phone = person.phone;
      this.person.isManager = person.isManager;
      this.person.manager = person.manager;
      this.person.managerId = person.managerId;
      this.person.address = person.address;
      console.log('Automated Random: ', this.person.firstname, this.person.lastname);
    });
  }

  fetchRandom() {
    this.peopleService.fetchRandom().subscribe(person => {
      this.person = person;
      console.log('Manual Random: ', this.person.firstname, this.person.lastname);
    });
  }

  delete(personId: string): void {
    console.log('Delete Event triggered');
  }
}
