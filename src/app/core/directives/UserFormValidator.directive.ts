import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserTypeEnum } from '../enums/user-type.enum';
import { UserService } from '../services/user.service';
import { IUser } from '../models/user';

@Directive({
  selector: '[appUserFormValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: UserFormValidatorDirective, multi: true }],
  standalone: true
})
export class UserFormValidatorDirective implements Validator {

  constructor(private userService: UserService) {}

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const errors: ValidationErrors = {};

    // Validate username (unique)
    console.log(control.value);
    console.log(control.value.username);
    if (value.username) {
      const allUsers = this.userService.getAllUsers();
      const isUsernameTaken = allUsers.some((user: IUser) => user.username === value.username);
      if (isUsernameTaken) {
        errors['uniqueUsername'] = true;
      }
    }

    // Validate email
    if (value.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value.email)) {
      errors['invalidEmail'] = true;
    }

    // Validate password (min length 8, at least one number and one letter)
    if (value.password && !(/(?=.*\d)(?=.*[a-zA-Z]).{8,}/).test(value.password)) {
      errors['invalidPassword'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  }
}
