import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import * as fromRoot from '@app/store';
import * as fromUser from '@app/store/user';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromProfileUser from '../../store/user';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayComponent implements OnInit, OnDestroy {

  user$ !: Observable<fromProfileUser.User>;
  isOwnProfile$ !: Observable<boolean>;

  constructor(
    private router: ActivatedRoute,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(fromProfileUser.getUser)) as Observable<fromProfileUser.User>;

    this.router.params.subscribe((param: Params)=> {
      const id = param.id;
      this.store.dispatch(new fromProfileUser.Read(id));
      this.isOwnProfile$ = this.store.pipe(
        select(fromUser.getUser),
        map(user => user && user.uid === id)
      ) as Observable<boolean>;
    })

  }

  ngOnDestroy():void{
    this.store.dispatch(new fromProfileUser.Clear());
  }
}
 