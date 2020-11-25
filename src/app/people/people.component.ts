import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Person } from '../model/person.model';
import { PeopleService } from '../shared/people.service';
import { AddDialogComponent } from './add-dialog/add-dialog.component';


@Component({
  selector: 'pwa-people',
  templateUrl: 'people.component.html',
  styleUrls: ['people.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleComponent implements OnInit, OnDestroy {

  public people: Array<Person> = [];
  public dialogStatus = 'inactive';

  private peopleSubscription!: Subscription;
  private addDialog: MatDialogRef<AddDialogComponent>;

  constructor(private peopleService: PeopleService, public dialog: MatDialog, public cdr: ChangeDetectorRef) {
  }

  /**
   * OnInit implementation
   */
  ngOnInit() {
    this.peopleSubscription = this.peopleService.fetch().subscribe(people => {
      this.people = people;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.peopleSubscription.unsubscribe();
  }

  delete(person: Person) {
    this.peopleService.delete(person.id).subscribe(() => {
      const index = this.people.findIndex(p => p.id === person.id);
      this.people.splice(index, 1);
      this.cdr.markForCheck();
    });
  }

  add(person: Person) {
    this.peopleService.create(person).subscribe(personAdded => {
      this.people.push(personAdded);
      this.cdr.detectChanges();
    });
  }

  showDialog() {
    this.dialogStatus = 'active';
    this.addDialog = this.dialog.open(AddDialogComponent, {
      width: '450px',
      data: {}
    });

    this.addDialog.afterClosed().subscribe(person => {
      this.dialogStatus = 'inactive';
      if (person) {
        this.add(person);
      } else {
        // for button "Add" refresh
        this.cdr.markForCheck();
      }
    });
  }

  trackByFn(index: number, item: Person) {
    return item.id;
  }
}
