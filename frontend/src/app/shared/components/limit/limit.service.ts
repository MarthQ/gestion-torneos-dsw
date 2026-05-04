import { inject, Injectable, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LimitService {
  private activatedRoute = inject(ActivatedRoute);

  currentLimit = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((params) => (params.get('limit') ? +params.get('limit')! : 9)),
      map((page) => (isNaN(page) ? 9 : page)),
    ),
    {
      initialValue: 9,
    },
  );
}
