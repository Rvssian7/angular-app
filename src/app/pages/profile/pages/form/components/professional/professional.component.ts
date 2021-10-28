import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markFormGroupTouched, regexErrors } from '@app/shared';
import { Dictionaries } from '@app/store/dictionaries';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PersonalForm } from '../personal/personal.component';
import { StepperService } from '../stepper/services';
import { EmployeeForm } from './roles/employee/employee.component';
import { RecruiterForm } from './roles/recruiter/recruiter.component';


export interface ProfesionalForm {
  about?: string | null ;
  roleId?: string | null ;
  role?: RecruiterForm | EmployeeForm | null;
}

@Component({
  selector: 'app-professional',
  templateUrl: './professional.component.html',
  styleUrls: ['./professional.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfessionalComponent implements OnInit, OnDestroy {

  @Input() value!: ProfesionalForm | any;
  @Input() dictionaries!: Dictionaries | null;

  @Output() changed = new EventEmitter<ProfesionalForm>();

  form!: FormGroup;
  regexErrors = regexErrors;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private stepper: StepperService
  ) { }

  private destroy = new Subject<any>();

  ngOnInit(): void {
      this.form = this.fb.group({
        roleId: [null,{
          updateOn: 'change', validators: [
            Validators.required
          ]
        }],
        about: [null, {
          updateOn: 'blur', validators: [
            Validators.required
          ]
        }] 
      });

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

  ngOnDestroy(): void{
    this.destroy.next(null);
    this.destroy.complete();
  }

}
