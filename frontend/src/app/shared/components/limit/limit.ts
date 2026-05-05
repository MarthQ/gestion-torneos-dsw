import { Component, inject, input, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-limit',
  imports: [],
  templateUrl: './limit.html',
})
export class Limit {
  private router = inject(Router);
  limit = input.required<number>();

  limitSelected = linkedSignal(this.limit);

  limits = signal([9, 18, 27, 36, 45, 54]);

  handleLimit(newLimit: number) {
    this.limitSelected.set(+newLimit);

    this.router.navigate([], {
      queryParams: { limit: newLimit },
      queryParamsHandling: 'merge',
    });
  }
}
