import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SlicePipe } from '@angular/common';

import { AuthService } from '@features/auth/services/auth.service';
import { USER_ROLE } from '@features/auth/interfaces/user-role.const';
import { Footer } from '../footer/footer';
import { SidebarService } from '@features/tournament-hub/services/sidebarService.service';
import { Tournament } from '@shared/interfaces/tournament';
import { TournamentUtils } from '@shared/utils/tournament-utils';

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
  private sidebarService = inject(SidebarService);
  authService = inject(AuthService);
  router = inject(Router);

  getBackgroundStyle = TournamentUtils.GetGameImage;

  isAdmin = computed(() => {
    const user = this.authService.user();

    return user?.role.name === USER_ROLE.ADMIN;
  });

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
    {
      name: 'CRUD Region',
      routerPath: 'admin/region',
      icon: `icon-[mdi--world]`,
    },
  ]);

  publicSidebarButtons = signal([
    {
      name: 'Explorar Torneos',
      routerPath: '/explore',
      icon: `icon-[material-symbols--explore]`,
    },
  ]);

  userSidebarButtons = signal([
    {
      name: 'Mis torneos',
      routerPath: '/my-tournaments',
      icon: `icon-[boxicons--crown]`,
    },
    {
      name: 'Mis inscripciones',
      routerPath: '/my-inscriptions',
      icon: `icon-[material-symbols--joystick]`,
    },
  ]);

  sidebarButtons = computed(() => {
    const user = this.authService.user();

    return user
      ? this.publicSidebarButtons().concat(this.userSidebarButtons())
      : this.publicSidebarButtons();
  });

  recentTournaments = computed(() => {
    return this.sidebarService.getRecentTournaments();
  });

  clickedTournament(tournament: Tournament) {
    this.sidebarService.updateRecentTournaments(tournament);
    this.router.navigate(['/tournament', tournament.id]);
  }

  toggleSidebar() {
    this.isSidebarToggled.update((current) => !current);
    console.log({ isAdmin: this.isAdmin });
  }
}
