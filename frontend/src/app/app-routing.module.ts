import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { AppComponent } from './app.component';
import { GameTypeTableComponent } from './components/crud-related/game-type/game-type-table/game-type-table.component';
import { InscriptionTableComponent } from './components/crud-related/inscription/inscription-table/inscription-table.component';
import { GameTableComponent } from './components/crud-related/game/game-table/game-table.component';
import { UserCrudTableComponent } from './components/crud-related/user-crud/user-crud-table/user-crud-table.component';
import { LocationTableComponent } from './components/crud-related/location/location-table/location-table.component';
import { TagTableComponent } from './components/crud-related/tag/tag-table/tag-table.component';
import { CreateTournamentComponent } from './components/create-tournament/create-tournament.component';
import { SearchTournamentComponent } from './components/search-tournament/search-tournament.component';
import { LandingComponent } from './components/landing/landing.component';
import { TournamentInfoComponent } from './components/tournament-info/tournament-info.component';

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
      {
        path: 'Games',
        component: GameTableComponent,
        title: 'Game CRUD',
      },
      {
        path: 'Users',
        component: UserCrudTableComponent,
        title: 'User CRUD',
      },
      {
        path: 'Locations',
        component: LocationTableComponent,
        title: 'Location CRUD',
      },
      {
        path: 'Tags',
        component: TagTableComponent,
        title: 'Tag CRUD',
      },
    ],
  },
  {
    path: 'tournament-info/:id',
    component: TournamentInfoComponent,
    title: 'Información del Torneo',
  },
  {
    path: 'createTournament',
    component: CreateTournamentComponent,
    title: 'Crear un Torneo',
  },
  {
    path: 'searchTournament',
    component: SearchTournamentComponent,
    title: 'Buscar un torneo',
  },
  { path: '**', component: LandingComponent, title: 'Okizeme' },
  //! Change for {path: '**', component: LandingComponent, title: 'Okizeme'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
