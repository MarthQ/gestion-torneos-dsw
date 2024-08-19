import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserComponent } from './components/user/user.component';
import { CRUDManagementComponent } from './components/crud-management/crud-management.component';
import { CrudModalComponent } from './components/crud-modal/crud-modal.component';
import { AdminComponent } from './components/admin/admin.component';
import { GameTypeTableComponent } from './components/game-type-table/game-type-table.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UserComponent,
    CRUDManagementComponent,
    CrudModalComponent,
    AdminComponent,
    GameTypeTableComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
