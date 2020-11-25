import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Person } from '../../model/person.model';


@Component({
    selector: 'pwa-form',
    templateUrl: 'form.component.html',
    styleUrls: ['form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit, OnChanges {

    form: FormGroup;
    @Input() model: any;
    isUpdateMode: boolean;

    @Output() cancel: EventEmitter<null>;
    @Output() submit: EventEmitter<Person>;


    constructor(private element: ElementRef, private renderer: Renderer2, private zone: NgZone) {
        this.submit = new EventEmitter();
        this.cancel = new EventEmitter();
        this.model = {address: {}};
        this.form = this._buildForm();
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
     * Function to handle component update
     *
     * @param record model
     */
    ngOnChanges(record) {
        if (record.model && record.model.currentValue) {
            this.model = record.model.currentValue;
            this.isUpdateMode = !!this.model;
            this.form.patchValue(this.model);
        }
    }

    /**
     * Function to emit event to cancel process
     */
    onCancel() {
        this.cancel.emit();
    }

    /**
     * Function to emit event to submit form and person
     */
    onSubmit(person: Person) {
        this.submit.emit(person);
    }

    /**
     * Function to build our form
     *
     */
    private _buildForm(): FormGroup {
        return new FormGroup({
            id: new FormControl(''),
            firstname: new FormControl('', Validators.compose([
                Validators.required, Validators.minLength(2)
            ])),
            lastname: new FormControl('', Validators.compose([
                Validators.required, Validators.minLength(2)
            ])),
            email: new FormControl('', Validators.compose([
                Validators.required, Validators.email
            ])),
            photo: new FormControl('https://randomuser.me/api/portraits/lego/6.jpg'),
            address: new FormGroup({
                street: new FormControl(''),
                city: new FormControl(''),
                postalCode: new FormControl('')
            }),
            phone: new FormControl('', Validators.compose([
                Validators.required, Validators.pattern('\\d{10}')
            ])),
            isManager: new FormControl('')
        });
    }
}
