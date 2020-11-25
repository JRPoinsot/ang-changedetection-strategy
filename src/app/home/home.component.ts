import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PeopleService } from '../shared/people.service';

@Component({
  selector: 'pwa-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  person: any = {};
  infiniteObs;
  doCheck = false;
  infiniteSub: Subscription = new Subscription();
  constructor(private peopleService: PeopleService,
     private element: ElementRef,
     private renderer: Renderer2,
     private cdr: ChangeDetectorRef,
     private zone: NgZone) {}

  ngOnDestroy(): void {
    this.infiniteSub.unsubscribe();
  }

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
    this.peopleService.fetchRandom().subscribe(person => {
      this.person = person;
      // call detect change to trigger initial view refresh
      this.cdr.detectChanges();
    });
    this.infiniteObs = timer(1, 5000);
    this.infiniteSub.add(
        this.infiniteObs.pipe(
        mergeMap(() => this.peopleService.fetchRandom())
      ).subscribe(person => {
        this.person = person;
        console.log('Automated Random: ', this.person.firstname, this.person.lastname);
        this.cdr.detectChanges();
      }));
  }

  fetchRandom() {
    this.peopleService.fetchRandom().subscribe(person => {
      this.person = person;
      this.cdr.detectChanges();
      console.log('Manual Random: ', this.person.firstname, this.person.lastname);
    });
  }

  delete(personId: string): void {
    console.log('Delete Event triggered');
  }
}
