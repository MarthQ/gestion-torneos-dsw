import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserComponent } from './user/user.component';
import { CRUDTableComponent } from './crud-table/crud-table.component';
import { CRUDManagementComponent } from './crud-management/crud-management.component';

@NgModule({
  declarations: [AppComponent, NavbarComponent, UserComponent, CRUDTableComponent, CRUDManagementComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
