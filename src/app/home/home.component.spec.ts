import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HomeComponent} from './home.component';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {By} from '@angular/platform-browser';
import {PeopleService} from '../shared/people.service';
import {of} from 'rxjs';
import {asyncData} from '../../test';

describe('Test Home Component', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let peopleService: PeopleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [HomeComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    peopleService = TestBed.inject(PeopleService);
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not display card if person is null', () => {
    component.person = null;
    fixture.detectChanges(); // ngOnInit
    expect(debugElement.query(By.css('pwa-card'))).toBeFalsy();
    component.person = {};
    fixture.detectChanges(); // update view
    expect(debugElement.query(By.css('pwa-card'))).toBeTruthy();
  });

  it('should call fetchRandom when click on autorenew', () => {
    const fetchRandomSpy = spyOn(peopleService, 'fetchRandom').and.returnValue(of({}));
    fixture.detectChanges(); // ngOnInit
    expect(fetchRandomSpy).toHaveBeenCalled();
    expect(component).toBeTruthy();
    debugElement
        .query(By.css('[data-id=button-1]'))
        .triggerEventHandler('click', {button : 0});
    expect(fetchRandomSpy).toHaveBeenCalledTimes(2);
  });

  it('should call delete when card triggers a personDelete event', () => {
    component.person.id = 'fakeId';
    const deleteSpy = spyOn(peopleService, 'delete').and.returnValue(of({}));
    fixture.detectChanges(); // ngOnInita
    debugElement.query(By.css('pwa-card')).triggerEventHandler('personDelete', null);
    expect(deleteSpy).toHaveBeenCalledWith(component.person.id);
  });

  it('should call fetch random person on Init (async)', waitForAsync(() => {
      component.person = null;
      const fetchRandomSpy = spyOn(peopleService, 'fetchRandom').and.returnValue(asyncData({}));
      fixture.detectChanges(); // ngOnInit
      fixture.whenStable().then(() => {
          fixture.detectChanges(); // updateView after async code is executed
          expect(fetchRandomSpy).toHaveBeenCalled();
          expect(debugElement.query(By.css('pwa-card'))).toBeTruthy();
      });
  }));
});
