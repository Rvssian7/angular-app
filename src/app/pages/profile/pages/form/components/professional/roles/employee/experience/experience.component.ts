import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


export interface ExperienceForm {
  companyName: string;
  period: Period;
}

export interface Period {
  from: number;
  to: number;
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit, OnDestroy {

  @Input() public parent!: FormGroup;
  @Input() public name!: string;

  @Input() public values!: ExperienceForm[];
  
  form!: FormArray;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.values = this.values ? this.values : [];
    this.init();
  }

  ngOnDestroy(): void {
    this.parent.removeControl(this.name);
  }

  private init(): void {
    this.form = this.fb.array(this.getFormGroupArray(this.values) );
    this.parent.addControl(this.name, this.form);
  }

  private getFormGroupArray(values: ExperienceForm[]) : FormGroup[] {
    if(!this.values.length){
        return [this.getFormGroup()];
    }else{
      return values.map(value => this.getFormGroup(value));
    }
  }

 


  private getFormGroup(value?: ExperienceForm): FormGroup {
    const group = this.fb.group({
      companyName: [null, {
        updateOn: 'blur', validators: [
          Validators.required
        ]
      }],
        period: [null, {
          updateOn: 'change', validators: [
            Validators.required
          ]
        }]
    });

    if(value){
      group.patchValue(value);
    }
    return group;
  }

  addExperience(): void{
    this.form.push(this.getFormGroup());
  }

  deleteExperience(i: number):void {
    this.form.removeAt(i);
  }

   getControls(){
     return (this.parent.get(this.name) as FormArray).controls;
   }

   getControl(control: any, name: string){
     return control.get('controls')?.get(name) as FormControl;
   }

}
