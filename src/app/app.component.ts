import { Component, OnInit } from '@angular/core';
import {Store, select} from '@ngrx/store';
import * as fromRoot from './store';
import * as fromDictionaries from './store/dictionaries';
import * as fromUser from './store/user';
import {Observable} from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ecommerce-angular-app-1';
  isAuthorized$ !: Observable<boolean>;

  user$!:Observable<fromUser.User>;
  constructor(private store: Store<fromRoot.State>){}


  ngOnInit(){
    this.user$ = this.store.pipe(select(fromUser.getUser)) as Observable<fromUser.User>;
    this.isAuthorized$ = this.store.pipe(select(fromUser.getIsAuthorized))

    this.store.dispatch(new fromUser.Init());

    this.store.dispatch(new fromDictionaries.Read());

    // this.store.pipe(select(fromUser.getUserState)).pipe(
    //   filter(state => !!state.uid),
    //   take(1)
    // ).subscribe( () => {
    //   console.log('estatus');
      
    // })

    
  }

  onSignOut() : void {
    this.store.dispatch(new fromUser.SignOut());
  }


}
