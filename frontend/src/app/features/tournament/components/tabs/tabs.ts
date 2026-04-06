import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'tournament-tabs',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tabs.html',
})
export class Tabs {
  tabs = [
    { name: 'Resumen', router: 'overview' },
    { name: 'Participantes', router: 'participants' },
    { name: 'Llave', router: 'bracket' },
    { name: 'Configuración', router: 'configuration' },
  ];
}
