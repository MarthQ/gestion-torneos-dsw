import {
  Component,
  computed,
  ElementRef,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Toaster } from '@shared/utils/toaster';

import { Tag } from '@shared/interfaces/tag';
import { TagService } from '@features/tournament-hub/services/tag.service';
import { TagCrudModal } from './tag-crud-modal/tag-crud-modal';
import { Pagination } from '@shared/components/pagination/pagination';
import { SearchBar } from '@shared/components/search-bar/search-bar';

@Component({
  selector: 'admin-tag-crud',
  imports: [TagCrudModal, Pagination, SearchBar],
  templateUrl: './tag-crud.html',
})
export class TagCrud {
  tagService = inject(TagService);

  // ElementRef for resetting the query
  searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  // API Get parameters (for table)
  query = signal('');
  page = linkedSignal({
    source: this.query,
    computation: () => 1,
  });
  pageSize = 10;

  // Modal parameters
  modalType = signal<'add' | 'edit' | 'delete'>('add');
  openModal = signal<boolean>(false);

  selectedTag = signal<Partial<Tag>>({});

  tagMeta = signal<PaginationMeta | undefined>(undefined);

  tagResource = rxResource({
    params: () => ({ query: this.query(), page: this.page() }),
    stream: ({ params }) => {
      return this.tagService.getTagsPaginated(params.query, params.page, this.pageSize).pipe(
        tap((response) => this.tagMeta.set(response.meta)),
        map((response) => response.data),
      );
    },
  });

  // Visual actions (pagination)
  pageChangedTo(newPage: number) {
    this.page.set(newPage);
  }

  // CRUD Actions
  addTag() {
    this.modalType.set('add');
    this.selectedTag.set({});
    this.openModal.set(true);
  }
  editTag(tag: Tag) {
    this.modalType.set('edit');
    this.selectedTag.set(tag);
    this.openModal.set(true);
  }
  deleteTag(tag: Tag) {
    this.modalType.set('delete');
    this.selectedTag.set(tag);
    this.openModal.set(true);
  }

  handleCrudAction(tag: Tag) {
    switch (this.modalType()) {
      case 'add':
        this.tagService.addTag(tag).subscribe({
          next: () => {
            Toaster.success('La etiqueta se agregó correctamente');
            this.tagResource.reload();
          },
          error: (err) => {
            Toaster.error(err);
            console.error(err);
          },
        });
        break;
      case 'edit':
        this.tagService.updateTag(tag).subscribe({
          next: () => {
            Toaster.success('La etiqueta se modificó correctamente');
            this.tagResource.reload();
          },
          error: (err) => {
            Toaster.error(err);
            console.error(err);
          },
        });
        break;
      case 'delete':
        this.tagService.deleteTag(tag).subscribe({
          next: () => {
            Toaster.success('La etiqueta se eliminó correctamente');
            this.tagResource.reload();
          },
          error: (err) => {
            Toaster.error(err);
            console.error(err);
          },
        });
    }
  }
}
