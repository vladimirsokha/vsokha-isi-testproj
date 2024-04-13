import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appUserFormValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: UserFormValidatorDirective, multi: true }],
  standalone: true
})
export class UserFormValidatorDirective implements Validator, OnDestroy {

  @Input() fieldName: string = '';

  statusChangeSubscription: Subscription | undefined;
  constructor(
    private userService: UserService,
    private elRef: ElementRef
  ) {}

  ngOnDestroy(): void {
    this.removeError();
  }

  validate(control: AbstractControl): null {
    console.log(control)
    this.statusChangeSubscription = control!.statusChanges!.subscribe(
      (status) => {
        if (status == 'INVALID') {
          this.showError(control);
        } else {
          this.removeError();
        }
      }
    )
    return null;
  }

  private showError(control: AbstractControl) {
    this.removeError();
    const valErrors: ValidationErrors = control!.errors as ValidationErrors;
    let text = '';

    Object.keys(valErrors).forEach(error => {
      switch (error) {
        case 'required':
          text += this.fieldName + ' required. ';
          break;
        case 'email': 
          text += this.fieldName + ' must be valid. '
          break;
        case 'pattern':
          text += 'Password must be strong (8 characters, at least one number and one letter)'
          break;
        case 'usernameExists':
          text += 'Username already exists';
      }
    })
    const errSpan = `<div style="font: normal normal normal 13px/16px Helvetica; color: #EF7DA0;" id="${this.fieldName.trim()}">${text}</div>`;
    this.elRef.nativeElement.parentElement.parentElement.insertAdjacentHTML('beforeend', errSpan);
  }

  private removeError(): void {
    const errorElement = document.getElementById(this.fieldName);
    if (errorElement) errorElement.remove();
  }
}
