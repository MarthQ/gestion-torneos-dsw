import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { NavbarComponent } from './components/navbar/navbar.component';
import { UserComponent } from './components/user/user.component';
import { CRUDManagementComponent } from './components/crud-related/crud-management/crud-management.component';
import { AdminComponent } from './components/admin/admin.component';
import { GameTypeTableComponent } from './components/crud-related/game-type/game-type-table/game-type-table.component';
import { GameTypeModalComponent } from './components/crud-related/game-type/game-type-modal/game-type-modal.component';
import { ConfirmComponent } from './components/shared/confirm/confirm.component';
import { InscriptionTableComponent } from './components/crud-related/inscription/inscription-table/inscription-table.component';
import { InscriptionModalComponent } from './components/crud-related/inscription/inscription-modal/inscription-modal.component';
import { GameTableComponent } from './components/crud-related/game/game-table/game-table.component';
import { GameModalComponent } from './components/crud-related/game/game-modal/game-modal.component';
import { UserCrudTableComponent } from './components/crud-related/user-crud/user-crud-table/user-crud-table.component';
import { UserCrudModalComponent } from './components/crud-related/user-crud/user-crud-modal/user-crud-modal.component';
import { LocationTableComponent } from './components/crud-related/location/location-table/location-table.component';
import { LocationModalComponent } from './components/crud-related/location/location-modal/location-modal.component';
import { TagTableComponent } from './components/crud-related/tag/tag-table/tag-table.component';
import { TagModalComponent } from './components/crud-related/tag/tag-modal/tag-modal.component';
import { SearchTournamentComponent } from './components/search-tournament/search-tournament.component';
import { UserInscriptionModalComponent } from './components/user-inscription-modal/user-inscription-modal.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UserComponent,
    CRUDManagementComponent,
    AdminComponent,
    GameTypeTableComponent,
    GameTypeModalComponent,
    ConfirmComponent,
    InscriptionTableComponent,
    InscriptionModalComponent,
    GameTableComponent,
    GameModalComponent,
    UserCrudTableComponent,
    UserCrudModalComponent,
    LocationTableComponent,
    LocationModalComponent,
    TagTableComponent,
    TagModalComponent,
    SearchTournamentComponent,
    UserInscriptionModalComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
