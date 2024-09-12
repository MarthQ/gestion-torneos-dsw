import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './components/admin/admin.component';
import { AppComponent } from './app.component';
import { GameTypeTableComponent } from './components/crud-related/game-type/game-type-table/game-type-table.component';
import { InscriptionTableComponent } from './components/crud-related/inscription/inscription-table/inscription-table.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    title: 'Admin Layout',
    children: [
      {
        path: 'GameTypes',
        component: GameTypeTableComponent,
        title: 'GameType CRUD',
      },
      {
        path: 'Inscriptions',
        component: InscriptionTableComponent,
        title: 'Inscription CRUD',
      },
    ],
  },
  // {path: 'searchTournaments', component: SearchTournamentComponent},
  // {path: 'searchUsers', component: SearchUsersComponent}
  { path: '**', component: AdminComponent },
  //! Change for {path: '**', component: LandingComponent, title: 'Okizeme'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
