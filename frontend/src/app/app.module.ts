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

import { NavbarComponent } from './components/navbar/navbar.component';
import { UserComponent } from './components/user/user.component';
import { CRUDManagementComponent } from './components/crud-related/crud-management/crud-management.component';
import { AdminComponent } from './components/admin/admin.component';
import { GameTypeTableComponent } from './components/crud-related/game-type/game-type-table/game-type-table.component';
import { GameTypeModalComponent } from './components/crud-related/game-type/game-type-modal/game-type-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UserComponent,
    CRUDManagementComponent,
    AdminComponent,
    GameTypeTableComponent,
    GameTypeModalComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
