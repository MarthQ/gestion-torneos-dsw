import { I18nSelectPipe } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';
import { CrudAction } from '@shared/interfaces/crudAction';
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
  confirmAction = output<CrudAction<Tag>>();

  tagModal = viewChild.required<ElementRef<HTMLDialogElement>>('tagModal');

  fb = inject(FormBuilder);

  // Mapper for the modal's title using i18nSelectPipe
  titleMap: any = {
    add: 'Agrega un etiqueta',
    edit: 'Modifica un etiqueta',
    delete: 'Borrar un etiqueta',
  };

  tagForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  openEffect = effect(() => {
    if (this.open()) {
      this.tagModal().nativeElement.showModal();
      this.tagForm.patchValue({
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
      const { name, description } = this.tagForm.getRawValue();
      const id = this.tag()?.id;

      switch (this.type()) {
        case 'add':
          this.confirmAction.emit({ actionType: 'create', data: { name, description } });
          break;
        case 'edit':
          this.confirmAction.emit({ actionType: 'update', data: { id: id!, name, description } });
          break;
        case 'delete':
          this.confirmAction.emit({ actionType: 'delete', data: { id: id! } });
          break;
      }
    }
  }
}
