import { SlicePipe } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Toaster } from '@shared/utils/toaster';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';

@Component({
  selector: 'match-modal',
  imports: [ReactiveFormsModule, FormsModule, FormErrorLabel, SlicePipe],
  templateUrl: './matchModal.html',
})
export class MatchModal {
  private fb = inject(FormBuilder);
  isModalOpen = input.required<boolean>();
  isModalClosed = output<void>();
  onResultsCharged = output<any>();
  matchData = input<any>();

  resultsForm = this.fb.group({
    score1: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]],
    score2: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]],
  });

  results_modal = viewChild.required<ElementRef>('results_modal');

  openModal = effect(() => {
    const modal = this.results_modal().nativeElement;

    if (!this.isModalOpen()) return;

    modal.showModal();
    console.log({ matchData: this.matchData() });
  });

  handleClose() {
    const modal = this.results_modal().nativeElement;
    modal.close();
    this.isModalClosed.emit();
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.resultsForm.invalid) {
      this.resultsForm.markAllAsTouched();
      return;
    }

    const { score1, score2 } = this.resultsForm.value;
    this.onResultsCharged.emit({
      matchId: this.matchData().matchId,
      scores: `${score1}-${score2}`,
    });
    this.handleClose();
    this.resultsForm.reset();
  }
}
