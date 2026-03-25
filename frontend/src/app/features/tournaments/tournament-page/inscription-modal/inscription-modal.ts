import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Inscription } from '@shared/interfaces/inscription';

@Component({
  selector: 'inscription-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './inscription-modal.html',
})
export class InscriptionModal {
  open = input.required<boolean>();
  closed = output<void>();
  confirmInscription = output<{ nickname: string }>();

  inscriptionModal = viewChild.required<ElementRef<HTMLDialogElement>>('inscriptionModal');

  fb = inject(FormBuilder);

  inscriptionForm = this.fb.nonNullable.group({
    nickname: ['', Validators.required],
  });

  openEffect = effect(() => {
    if (this.open()) {
      this.inscriptionModal().nativeElement.showModal();
      this.inscriptionForm.patchValue({
        nickname: '',
      });
    } else {
      this.inscriptionModal().nativeElement.close();
    }
  });

  onDialogClose() {
    this.closed.emit();
  }
  emitInscription() {
    if (this.inscriptionForm.valid) {
      // If the form is valid, this emits an object like { nickname: string }.
      this.confirmInscription.emit(this.inscriptionForm.getRawValue());
    }
  }
}
