import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../core/services/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IUser } from '../core/models/user';
import { UserFormValidatorDirective } from '../core/directives/UserFormValidator.directive';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../components/button/button.component';
import { ButtonEnum } from '../core/enums/button.enum';
import { MessageService } from '../core/services/message.service';
import { MessageEnum } from '../core/enums/message.enum';
import { UserTypeEnum } from '../core/enums/user-type.enum';
import { checkPasswords } from '../core/validators/passwordMatch.validator';
import { Observable, Subscription, of } from 'rxjs';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserFormValidatorDirective, ButtonComponent, RouterModule],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => UserComponent),
    }]
})
export class UserComponent implements OnInit, OnDestroy {

  buttonEnum = ButtonEnum;
  userTypeEnum = UserTypeEnum;
  userId: string | 'new' = 'new';
  userForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    first_name: [ '', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
    repeat_password: [''],
    user_type: [null, Validators.required]
  });

  usersList: IUser[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id']; 
      if (this.userId !== 'new') {
        const user = this.userService.getUserById(parseInt(this.userId));
        if (user) {
          this.initForm(this.userService.getUserById(parseInt(this.userId)));
        } else {
          this.router.navigate(['/new']);
          this.messageService.messageSubject.next({type: MessageEnum.ERROR, message: 'Error! User doesn\'t exist.'});
        }
      } else {
        this.initForm();
      }
    });
    this.subscriptions.push(
      this.userService.users$.subscribe(res => {
        this.usersList = res;
      })
    );
  }

  createUser(): void {
    if (this.userForm.valid) {
      const userId = this.userService.addUser(this.generateUserPayload());
      this.messageService.messageSubject.next({type: MessageEnum.SUCCESS, message: 'Success! User added.'});
      setTimeout(() => {
        this.router.navigate([`/${userId}`]);
      }, 0);
    } else {
      this.messageService.messageSubject.next({type: MessageEnum.ERROR, message: 'Error! User data is not valid.'});
    }
    
  }

  updateUser(): void {
    if (this.userForm.valid) {
      this.userService.updateUser(this.generateUserPayload());
      this.messageService.messageSubject.next({type: MessageEnum.SUCCESS, message: 'Success! User updated.'});
    } else {
      this.messageService.messageSubject.next({type: MessageEnum.ERROR, message: 'Error! User data is not valid.'});
    }
    
  }

  deleteUser(): void {
    this.userService.deleteUser(parseInt(this.userId));
    this.messageService.messageSubject.next({type: MessageEnum.SUCCESS, message: 'Success! User deleted.'});
    this.router.navigate([`/`]);
  }

  private generateUserPayload(): IUser {
    const userData: IUser = {
      id: this.userId === 'new' ? 0 : parseInt(this.userId),
      username: this.userForm.value.username,
      first_name: this.userForm.value.first_name,
      last_name: this.userForm.value.last_name,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      user_type: this.userForm.value.user_type
    };
    return userData;
  }

  private initForm(userData?: IUser): void {
    this.userForm = this.formBuilder.group({
      username: [userData ? userData.username : '', Validators.required, this.checkUniqieName],
      first_name: [userData ? userData.first_name : '', Validators.required],
      last_name: [userData ? userData.last_name : '', Validators.required],
      email: [userData ? userData.email : '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      repeat_password: [''],
      user_type: [userData ? userData.user_type : null, Validators.required]
    }, {validators: checkPasswords});
  }

  checkUniqieName: ValidatorFn = (group: AbstractControl):  Observable<ValidationErrors|null> => { 
    return this.usersList.some(user => user.username === this.userForm.get('username')?.value) ? of({ usernameExists: true }) :  of(null)
  }
}
