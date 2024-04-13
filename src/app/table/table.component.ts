import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../core/services/user.service';
import { IUser } from '../core/models/user';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class TableComponent implements OnInit {

  users: IUser[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.userService.users$.subscribe(res => {
        this.users = res;
      })
    )
  }

}
