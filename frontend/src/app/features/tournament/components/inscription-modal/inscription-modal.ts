import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';
@Component({
  selector: 'inscription-modal',
  imports: [ReactiveFormsModule, FormErrorLabel],
  templateUrl: './inscription-modal.html',
})
export class InscriptionModal {
  // Inputs
  type = input.required<'add' | 'delete'>();
  open = input.required<boolean>();
  // Outputs
  inscriptionConfirmed = output<{ nickname: string }>();
  deletionConfirmed = output<void>();
  closed = output<void>();

  private fb = inject(FormBuilder);

  inscriptionModal = viewChild.required<ElementRef<HTMLDialogElement>>('inscriptionModal');

  inscriptionForm = this.fb.nonNullable.group({
    nickname: [''],
  });

  openEffect = effect(() => {
    const modal = this.inscriptionModal().nativeElement;
    this.open() ? modal.showModal() : modal.close();
  });

  onConfirm() {
    if (this.type() === 'add') {
      const { nickname } = this.inscriptionForm.getRawValue();
      this.inscriptionConfirmed.emit({ nickname });
    } else {
      this.deletionConfirmed.emit();
    }
  }

  onCancel() {
    this.closed.emit();
  }
}
