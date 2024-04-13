import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group!.get('password')?.value;
    let confirmPass = group!.get('repeat_password')?.value
    return pass === confirmPass ? null : { notSame: true }
}