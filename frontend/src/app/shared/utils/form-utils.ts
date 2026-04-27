import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}

export class FormUtils {
  // Expresiones regulares
  static namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)$';
  static emailPattern = '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  // Validadores
  static isFieldOneEqualToFieldTwo(field1: string, field2: string) {
    return (formGroup: AbstractControl) => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value
        ? null
        : {
            fieldsNotEqual: true,
          };
    };
  }

  // Funciones
  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Minimo de ${errors['minlength'].requiredLength} caracteres.`;
        case 'min':
          return `Valor mínimo de ${errors['min'].min}.`;
        case 'email':
          return 'El email no tiene un formato válido esperado';
        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El correo electrónico no es permitido';
          }
          return 'El campo no tiene el tipo necesario';
        case 'emailTaken':
          return 'El mail ingresado ya esta en uso. Verifique que usted no tiene una cuenta';
        case 'usernameTaken':
          return 'El nombre de usuario "Strider" no esta disponible.';

        default:
          return `Error de validación no controlado: ${key}`;
      }
    }
    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return !(form.controls[fieldName].errors && form.controls[fieldName].touched);
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};
    return this.getTextError(errors);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return !(formArray.controls[index].errors && formArray.controls[index].touched);
  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};
    return this.getTextError(errors);
  }

  static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
    console.log('Validando contras servidor...');
    await sleep();

    const formValue = control.value;

    if (formValue === 'hola@mundo.com') {
      return {
        emailTaken: true,
      };
    }

    return null;
  }

  static checkingUsername(control: AbstractControl): ValidationErrors | null {
    const formValue = control.value;

    if (formValue === 'Strider') {
      return {
        usernameTaken: true,
      };
    }

    return null;
  }

  // ========== Date/Time Utilities ==========

  /**
   * Convierte una fecha a formato HTML datetime-local (YYYY-MM-DDTHH:MM)
   * Resta la timezone offset para mostrar la fecha correcta en el input
   */
  static formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }
}
