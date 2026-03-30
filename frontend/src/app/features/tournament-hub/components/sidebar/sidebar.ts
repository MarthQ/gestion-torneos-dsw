import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { Footer } from '../footer/footer';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Footer, SlicePipe],
  templateUrl: './sidebar.html',
  styles: `
    #navbar-title {
      font-family: Segoe-Script;
      font-size: 1.8em;
    }
    #sidebar-toggle {
      transition: ease-in 0.3s;
    }
    #sidebar-toggle.toggled {
      rotate: 180deg;
      transition: ease-in 0.3s;
    }
  `,
})
export class Sidebar {
  authService = inject(AuthService);

  isAdmin = this.authService.user()!.role;

  isSidebarToggled = signal(false);

  adminSidebarButtons = signal([
    {
      name: 'CRUD Juegos',
      routerPath: 'admin/game',
      icon: `icon-[bx--joystick]`,
    },
    {
      name: 'CRUD Localidades',
      routerPath: 'admin/location',
      icon: `icon-[mdi--location]`,
    },
    {
      name: 'CRUD Usuarios',
      routerPath: 'admin/user',
      icon: `icon-[mdi--users]`,
    },
    {
      name: 'CRUD Torneos',
      routerPath: 'admin/tournament',
      icon: `icon-[solar--cup-bold]`,
    },
    {
      name: 'CRUD Tags',
      routerPath: 'admin/tag',
      icon: `icon-[tabler--tag]`,
    },
    {
      name: 'CRUD Roles',
      routerPath: 'admin/role',
      icon: `icon-[eos-icons--role-binding]`,
    },
  ]);

  sidebarButtons = signal([
    {
      name: 'Explorar Torneos',
      routerPath: '/explore',
      icon: `icon-[material-symbols--explore]`,
    },
    {
      name: 'Mis inscripciones',
      routerPath: '/my-inscriptions',
      icon: `icon-[material-symbols--joystick]`,
    },
    {
      name: 'Configuraciones',
      routerPath: 'user-profile/settings',
      icon: `icon-[material-symbols--settings]`,
    },
  ]);

  toggleSidebar() {
    this.isSidebarToggled.update((current) => !current);
    console.log(this.isSidebarToggled());
  }
}
