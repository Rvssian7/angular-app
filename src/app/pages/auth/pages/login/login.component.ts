import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';


import { regex, regexErrors, markFormGroupTouched } from '@app/shared/utils';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '@app/store';
import * as fromUser from '@app/store/user';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loading$ !: Observable<boolean | null>;
  form !: FormGroup;
  regexErrors = regexErrors;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    this.loading$ = this.store.pipe(select(fromUser.getLoading));

    this.form = this.fb.group({
      email: [null, {
        updateOn: 'blur',  validators: [
          Validators.required,
          Validators.maxLength(128),
          Validators.pattern(regex.email)
        ]
      }],
      password: [null, {
        updateOn: 'change', validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.pattern(regex.password)
        ]
      }],
    })
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const value = this.form.value;
      const credentials: fromUser.EmailPasswordCredentials = {
        email: value.email,
        password: value.password
      }
      this.store.dispatch(new fromUser.SignInEmail(credentials));
    } else {
      markFormGroupTouched(this.form);
    }
  }
}
