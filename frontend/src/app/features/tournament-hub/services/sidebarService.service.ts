import { inject, Injectable, signal } from '@angular/core';

import { AuthService } from '@features/auth/services/auth.service';
import { Tournament } from '@shared/interfaces/tournament';

interface RecentTournamentsStorage {
  [userId: string]: Tournament[];
}

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly STORAGE_KEY = 'oki-recent-tournaments';
  private authService = inject(AuthService);

  // Internal signal to notify changes
  private recentTournamentsUpdateSignal = signal(0);

  updateRecentTournaments(tournament: Tournament) {
    // Recent tournaments are only stored if there's a user logged.
    const user = this.authService.user();
    if (!user) return;

    const stored = localStorage.getItem(this.STORAGE_KEY);
    const recentTournamentsData: RecentTournamentsStorage = stored ? JSON.parse(stored) : {};

    let recentTournaments = recentTournamentsData[user.id] ?? [];

    // Deletes the tournament if it already existed in history. And then pushes the same tournament to be first in the list
    recentTournaments = recentTournaments.filter((t) => t.id !== tournament.id);
    recentTournaments.unshift(tournament);

    recentTournaments = recentTournaments.slice(0, 5);

    console.log(recentTournaments);

    recentTournamentsData[user.id] = recentTournaments;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentTournamentsData));

    // Notify changes through signal
    this.recentTournamentsUpdateSignal.update((v) => v + 1);
  }

  getRecentTournaments(): Tournament[] {
    this.recentTournamentsUpdateSignal();
    const user = this.authService.user();
    if (!user) {
      return [];
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];

    const data: RecentTournamentsStorage = JSON.parse(stored);
    return data[user.id] ?? [];
  }
}
