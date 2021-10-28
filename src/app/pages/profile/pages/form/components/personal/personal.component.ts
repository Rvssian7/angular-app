import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markFormGroupTouched, regexErrors } from '@app/shared';
import { Dictionaries } from '@app/store/dictionaries';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StepperService } from '../stepper/services';


export interface PersonalForm {
  name: string | null;
  photoURL: string | null;
  country: string | null;
}


@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalComponent implements OnInit, OnDestroy {
  
  @Input() value!: PersonalForm;
  @Input() dictionaries!: Dictionaries | null;

  @Output() changed = new EventEmitter<PersonalForm>();

  private destroy = new Subject<any>();

  form !: FormGroup;

  constructor(
    private stepper: StepperService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      photoURL : [null],
      name: [null, {
        updateOn: 'blur', validators: [
          Validators.required,
          Validators.maxLength(128)
        ]
      }],
      country: [null, {
        updateOn: 'change', validators: [
          Validators.required
        ]
      }]
    })

    if(this.value){
      this.form.patchValue(this.value);
    }


    this.stepper.check$.pipe(takeUntil(this.destroy)).subscribe((type)=> {
        
        if(!this.form.valid) {
          markFormGroupTouched(this.form);
          this.form.updateValueAndValidity();
          this.cdr.detectChanges();
        }else{
          this.changed.emit(this.form.value);
        }


        this.stepper[type].next(this.form.valid);
    })
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  onPhotoChanged(url : any) : void {
    console.log('url', url);
    if(url) {
      console.log('url2', url);
      this.form.controls.photoURL.setValue(url);
    }
  }

}
