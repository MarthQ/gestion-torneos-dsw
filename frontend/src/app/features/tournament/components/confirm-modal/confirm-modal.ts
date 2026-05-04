import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';
@Component({
  selector: 'confirm-modal',
  imports: [ReactiveFormsModule, FormErrorLabel],
  templateUrl: './confirm-modal.html',
})
export class ConfirmModal {
  type = input.required<'close' | 'start' | 'end' | 'cancel' | 'reopen'>();
  open = input.required<boolean>();
  confirmed = output<void>();
  cancelled = output<void>();
  modal = viewChild.required<ElementRef>('confirmModal');
  fb = inject(FormBuilder);

  confirmInput = this.fb.nonNullable.control('');

  openEffect = effect(() => {
    const modal = this.modal().nativeElement;
    if (this.open()) {
      modal.showModal();
      this.confirmInput.patchValue('');
    } else {
      modal.close();
    }
  });

  getTitle(): string {
    const titles = {
      close: 'Cerrar Inscripciones',
      start: 'Iniciar Torneo',
      end: 'Finalizar Torneo',
      cancel: 'Cancelar Torneo',
      reopen: 'Reabrir Torneo',
    };
    return titles[this.type()];
  }
  getMessage(): string {
    const messages = {
      close:
        '¿Estás seguro de que querés cerrar las inscripciones? Una vez cerrado, no se podrán agregar más participantes.',
      start: '¿Estás seguro de que querés iniciar el torneo?',
      end: '¿Estás seguro de que querés finalizar el torneo? Esta acción no se puede deshacer.',
      cancel: 'Esta acción cancelará el torneo de forma permanente.',
      reopen: '¿Estás seguro de que querés reabir el torneo?',
    };
    return messages[this.type()];
  }
  get isConfirmDisabled(): boolean {
    return this.type() === 'cancel' && this.confirmInput.value !== 'Cancelar';
  }
  onConfirm() {
    if (this.isConfirmDisabled) return;
    this.modal().nativeElement.close();
    this.confirmed.emit();
  }
  onCancel() {
    this.modal().nativeElement.close();
    this.cancelled.emit();
  }
}
