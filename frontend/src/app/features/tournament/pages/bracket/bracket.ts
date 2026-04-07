import { Component, ViewChild, ElementRef, inject, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TournamentService } from '@shared/services/tournament.service';
import { JsonPipe } from '@angular/common';

@Component({
  imports: [JsonPipe],
  templateUrl: './bracket.html',
})
export class Bracket {
  @ViewChild('bracketContainer', { static: true })
  protected readonly bracketContainer!: ElementRef<HTMLElement>;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly tournamentService = inject(TournamentService);

  private readonly tournamentId = signal<number>(0);
  private initialized = false;

  // Effect que se ejecuta después del primer render
  protected readonly initEffect = effect(() => {
    if (!this.initialized) {
      this.initialized = true;
      // Obtener el ID del torneo de los parámetros
      const id = this.activatedRoute.parent?.snapshot.paramMap.get('id');
      if (id) {
        this.tournamentId.set(Number(id));
        this.loadBracketData();
      }
    }
  });

  private async loadBracketData(): Promise<void> {
    const container = this.bracketContainer?.nativeElement;
    if (!container) return;

    try {
      const data = await firstValueFrom(
        this.tournamentService.getTournamentBracket(this.tournamentId()),
      );

      if (!data?.match?.length) {
        console.log('[Bracket] No data or empty matches:', data);
        return;
      }

      console.log('[Bracket] Rendering with data:', data);
      await this.renderBracket(data);
    } catch (err) {
      console.error('[Bracket] Error loading bracket:', err);
    }
  }

  private async renderBracket(data: any): Promise<void> {
    console.log('[DEBUG] Stage:', data.stage);
    console.log('[DEBUG] Groups:', data.group);
    console.log('[DEBUG] Rounds:', data.round);
    console.log('[DEBUG] Matches:', data.match);
    console.log('[DEBUG] Participants:', data.participant);
    const container = this.bracketContainer?.nativeElement;
    if (!container) return;

    // Clear previous render
    container.innerHTML = '';

    // Load brackets-viewer script if not available
    if (!(window as any).bracketsViewer) {
      await this.loadBracketsViewerScript();
    }

    try {
      await (window as any).bracketsViewer.render(
        {
          stages: data.stage || [],
          matches: data.match || [],
          matchGames: data.match_game || [],
          participants: data.participant || [],
        },
        {
          selector: '#bracket-container',
          highlightParticipantOnHover: true,
          showSlotsOrigin: true,
        },
      );
    } catch (err) {
      console.error('[Bracket] Render error:', err);
    }
  }

  private loadBracketsViewerScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).bracketsViewer) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load brackets-viewer'));
      document.head.appendChild(script);
    });
  }
}
