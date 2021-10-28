import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {User} from '@app/store/user';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @Input() isAuthorized !: boolean | null;
  @Output() signOut = new EventEmitter<void>();

  @Input() user!:User  | null;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSignOut(): void{
      this.signOut.emit();
  }

  onProfileNavigate(): void {
    console.log('this.user.uid', this.user);
    const path = this.user ? this.user.uid : 'new';
    this.router.navigate(['/profile', path]);
  }

}
