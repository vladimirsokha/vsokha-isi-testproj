import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../core/services/user.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IUser } from '../core/models/user';
import { UserFormValidatorDirective } from '../core/directives/UserFormValidator.directive';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../components/button/button.component';
import { ButtonEnum } from '../core/enums/button.enum';
import { MessageService } from '../core/services/message.service';
import { MessageEnum } from '../core/enums/message.enum';
import { UserTypeEnum } from '../core/enums/user-type.enum';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserFormValidatorDirective, ButtonComponent, RouterModule]
})
export class UserComponent implements OnInit {

  buttonEnum = ButtonEnum;
  userTypeEnum = UserTypeEnum;
  userId: string | 'new' = 'new';
  userForm!: FormGroup;


  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id']; 
      if (this.userId !== 'new') {
        this.initForm(this.userService.getUserById(parseInt(this.userId)));
        console.log(this.userForm.value);
      } else {
        this.initForm();
      }
    });
  }

  createUser(): void {
    if (this.userForm.valid) {
      this.userService.addUser(this.generateUserPayload());
      this.messageService.messageSubject.next({type: MessageEnum.SUCCESS, message: 'Success! User added.'});
      this.userForm.reset();
    } else {
      this.messageService.messageSubject.next({type: MessageEnum.ERROR, message: 'Error! User data is not valid.'});
    }
    
  }

  updateUser(): void {
    if (this.userForm.valid) {
      this.userService.updateUser(this.generateUserPayload());
      this.messageService.messageSubject.next({type: MessageEnum.SUCCESS, message: 'Success! User updated.'});
      this.userForm.reset();
    } else {
      this.messageService.messageSubject.next({type: MessageEnum.ERROR, message: 'Error! User data is not valid.'});
    }
    
  }

  deleteUser(): void {
    this.userService.deleteUser(parseInt(this.userId));
    this.messageService.messageSubject.next({type: MessageEnum.SUCCESS, message: 'Success! User deleted.'});
    this.userForm.reset();
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
      username: [userData ? userData.username : '', Validators.required],
      first_name: [userData ? userData.first_name : '', Validators.required],
      last_name: [userData ? userData.last_name : '', Validators.required],
      email: [userData ? userData.email : '', [Validators.required, Validators.email]],
      password: [userData ? userData.password : '', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      user_type: [userData ? userData.user_type : null, Validators.required]
    });
  }
}
