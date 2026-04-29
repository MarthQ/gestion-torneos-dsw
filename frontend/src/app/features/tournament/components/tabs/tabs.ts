import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { TournamentService } from '@shared/services/tournament.service';

@Component({
  selector: 'tournament-tabs',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tabs.html',
})
export class Tabs {
  private tournamentService = inject(TournamentService);
  private activatedRoute = inject(ActivatedRoute);

  private user = inject(AuthService).user;

  tournamentId = computed(() => Number(this.activatedRoute.snapshot.paramMap.get('id')));
  isCreator = toSignal(this.tournamentService.isLoggedUserCreator(this.tournamentId()), {
    initialValue: false,
  });

  baseTabs = [
    { name: 'Resumen', router: 'overview' },
    { name: 'Participantes', router: 'participants' },
    { name: 'Llave', router: 'bracket' },
  ];

  adminTab = { name: 'Configuración', router: 'configuration' };

  // Tabs dinámicos basados en permisos
  tabs = computed(() => {
    if (this.isCreator() || this.user()?.role.name === 'admin') {
      return [...this.baseTabs, this.adminTab];
    }
    return this.baseTabs;
  });
}
