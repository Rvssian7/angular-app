import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisplayRoutingModule } from './display-routing.module';
import { DisplayComponent } from './display.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { RecruiterComponent } from './components/recruiter/recruiter.component';

import { UserPhotoModule } from '@app/shared/layouts';
@NgModule({
  declarations: [
    DisplayComponent,
    EmployeeComponent,
    RecruiterComponent
  ],
  imports: [
    CommonModule,
    DisplayRoutingModule,
    UserPhotoModule
  ]
})
export class DisplayModule { }
