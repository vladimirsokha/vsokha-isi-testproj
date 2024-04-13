import { Injectable } from '@angular/core';
import { IUser } from '../models/user';
import { UserTypeEnum } from '../enums/user-type.enum';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);
  users$: Observable<IUser[]> = this.usersSubject.asObservable();

  constructor() {
    this.populateInitialData();
  }

  getAllUsers(): IUser[] {
    return this.usersSubject.value;
  }

  getUserById(id: number): IUser {
    return this.usersSubject.value.find(user => user.id === id) as IUser;
  }

  addUser(user: IUser): void {
    const users = this.usersSubject.value;
    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    user.id = id;
    this.usersSubject.next([...users, user]);
  }

  updateUser(user: IUser): void {
    const users = this.usersSubject.value;
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      this.usersSubject.next([...users]);
    }
  }

  deleteUser(id: number): void {
    const users = this.usersSubject.value;
    const filteredUsers = users.filter(user => user.id !== id);
    this.usersSubject.next(filteredUsers);
  }

  private populateInitialData(): void {
    const initialUsers: IUser[] = [
      {
        id: 1,
        username: 'user1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password1',
        user_type: UserTypeEnum.ADMIN
      },
      {
        id: 2,
        username: 'user2',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        password: 'password2',
        user_type: UserTypeEnum.DRIVER
      }
    ];
    this.usersSubject.next(initialUsers);
  }
}