import { I18nSelectPipe } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';
import { Tag } from '@shared/interfaces/tag';

@Component({
  selector: 'tag-crud-modal',
  imports: [I18nSelectPipe, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './tag-crud-modal.html',
})
export class TagCrudModal {
  tag = input.required<Partial<Tag>>();
  type = input.required<'add' | 'edit' | 'delete'>();
  open = input.required<boolean>();
  closed = output<void>();
  confirmAction = output<Tag>();

  tagModal = viewChild.required<ElementRef<HTMLDialogElement>>('tagModal');

  fb = inject(FormBuilder);

  // Mapper for the modal's title using i18nSelectPipe
  titleMap: any = {
    add: 'Agrega un usuario',
    edit: 'Modifica un usuario.',
    delete: 'Borrar un usuario',
  };

  tagForm = this.fb.nonNullable.group({
    id: [0, Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  openEffect = effect(() => {
    if (this.open()) {
      this.tagModal().nativeElement.showModal();
      this.tagForm.patchValue({
        id: this.tag().id ?? 0,
        name: this.tag().name ?? '',
        description: this.tag().description ?? '',
      });
    } else {
      this.tagModal().nativeElement.close();
    }
  });

  onDialogClose() {
    this.closed.emit();
  }
  emitTag() {
    if (this.tagForm.valid) {
      const tag = this.tagForm.getRawValue();
      this.confirmAction.emit(tag);
    }
  }
}
