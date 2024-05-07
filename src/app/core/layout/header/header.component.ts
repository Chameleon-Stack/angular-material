import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IUser } from '@interfaces/user/user.interface';
import { AuthService } from '@services/auth/auth.service';
import { FilterEventService } from '@services/filter-event/filter-event.service';
import { UserEventService } from '@services/user-event/user-event.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() public menuClick: EventEmitter<void> = new EventEmitter();
  public searchText: string = '';

  public user!: IUser;

  constructor(
    private authService: AuthService,
    private userEventService: UserEventService,
    public dialog: MatDialog,
    private filterEventService: FilterEventService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: IUser | null) => {
      if (user) {
        this.user = user;
      }
    });

    this.userEventService.get().subscribe((user: IUser | null) => {
      if (user) {
        this.user = user;
      }
    });
  }

  public search() {
    if (this.searchText === '') {
      return;
    }

    if (this.searchText.length < 3) {
      return;
    }

    this.filterEventService.emit(this.searchText);
  }
}
