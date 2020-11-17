import { Component, OnInit, Input, EventEmitter, Output,
   ChangeDetectionStrategy, ElementRef, NgZone, Renderer2 } from '@angular/core';
import {Person} from '../../model/person.model';

@Component({
  selector: 'pwa-card-on-push',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardOnPushComponent implements OnInit {
  @Input() person: Person;
  @Output('personDelete') delete$: EventEmitter<Person>;

  constructor(private element: ElementRef, private renderer: Renderer2, private zone: NgZone) {
    this.person = null;
    this.delete$ = new EventEmitter();
  }

  tick(): void {
    this.renderer.setStyle(this.element.nativeElement, 'border', '2px solid orangered');
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.renderer.setStyle(this.element.nativeElement, 'border', 'none');
      }, 500);
    });
  }

  /**
   * OnInit implementation
   */
  ngOnInit() {
  }

  /**
   * Function to emit event to delete current person
   *
   * @param person the person to delete
   */
  delete(person: Person) {
    this.delete$.emit(person);
  }
}
