import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './components/admin/admin.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  // {path: 'searchTournaments', component: SearchTournamentComponent},
  // {path: 'searchUsers', component: SearchUsersComponent}
  { path: '**', component: AppComponent },
  //! Change for {path: '**', component: LandingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
