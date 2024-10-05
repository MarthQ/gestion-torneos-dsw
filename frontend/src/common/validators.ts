import { AbstractControl, ValidatorFn } from '@angular/forms';

export function selectRequiredValidator(ctrl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return control.value && control.value > 0
      ? null
      : { required: { value: control.value } };
  };
}
