import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { StepperService } from './components/stepper/services';

import { Store, select } from '@ngrx/store';
import * as fromRoot from '@app/store';
import * as fromForm from '../../store/form';
import * as fromDictionaries from '@app/store/dictionaries';
import * as fromUser from '@app/store/user';
import { Observable, Subject, zip } from 'rxjs';
import { PersonalForm } from './components/personal/personal.component';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ProfesionalForm } from './components/professional/professional.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MapperService } from './services';



export interface ProfileForm {
  personal: PersonalForm | any;
  professional: ProfesionalForm | any;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit, OnDestroy {

  dictionaries$!: Observable<fromDictionaries.Dictionaries> | Observable<any>;
  dictionariesIsReady$ !: Observable<boolean>;

  personal$ !: Observable<PersonalForm> | Observable<any>;
  professional$!: Observable<ProfesionalForm> | Observable<any>;

  profile$!: Observable<ProfileForm> | Observable<any>;

  loading$ !: Observable<boolean>;

  private isEditing!: boolean;

  private destroy = new Subject<any>();

  private user!: fromUser.User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public stepper: StepperService,
    private store: Store<fromRoot.State>,
    private mapper: MapperService
  ) { }

  ngOnInit(): void {
    this.user = this.route.snapshot.data.user;
    
    this.isEditing = !!this.user;
    

    this.profile$ = this.store.pipe(select(fromForm.getFormState)) as Observable<ProfileForm>;
    this.personal$ = this.store.pipe(select(fromForm.getPersonalForm)) as Observable<PersonalForm>;
    this.professional$ = this.store.pipe(select(fromForm.getProfessionalForm)) as Observable<ProfesionalForm>;

    this.loading$ = this.store.pipe(select(fromUser.getLoading)) as Observable<boolean>;

    if (this.user) {
      const form = this.mapper.userToForm(this.user);
      this.store.dispatch(new fromForm.Set(form))
    }


    this.dictionaries$ = this.store.pipe(select(fromDictionaries.getDictionaries));
    this.dictionariesIsReady$ = this.store.pipe(select(fromDictionaries.getIsReady)) as Observable<boolean>;
    this.stepper.init([
      { key: 'personal', label: 'Personal' },
      { key: 'professional', label: 'Profesional' },

    ])

    

    this.stepper.complete$.pipe(
      switchMap(() => zip(this.profile$, this.dictionaries$)),
      takeUntil(this.destroy)

    ).subscribe(([profile, dictionaries]) => {
      this.onComplete(profile, this.user, dictionaries)
    });

    this.stepper.cancel$.pipe(takeUntil(this.destroy)).subscribe(() => {
          this.router.navigate(['/profile', this.user.uid]);
    });

  }




  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete()
    this.store.dispatch(new fromForm.Clear());
  }

  onChangedPersonal(data: PersonalForm): void {
    
    this.store.dispatch(new fromForm.Update({ personal: data }))
  }


  onChangedProfesional(data: ProfesionalForm): void {
    
    this.store.dispatch(new fromForm.Update({ professional: data }))
  }


  private onComplete(profile: ProfileForm | any, user: fromUser.User, dictionaries: fromDictionaries.Dictionaries | any): void {
    //create o update
    if (this.isEditing) {
      const request = this.mapper.formToUserUpdate(profile, user, dictionaries);
      this.store.dispatch(new fromUser.Update(request));
    } else {
      const request = this.mapper.formToUserCreate(profile, dictionaries);
      this.store.dispatch(new fromUser.Create(request));
    }

  }

  get title(): string {
    return this.isEditing ? 'Editar Perfil de Usuario' : 'Nuevo Perfil de Usuario';
  }

}
