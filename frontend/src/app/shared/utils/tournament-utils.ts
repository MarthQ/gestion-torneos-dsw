import { Game } from '@shared/interfaces/game';

export class TournamentUtils {
  static tournamentStatusBadgeMap: Record<string, string> = {
    open: 'badge-success',
    closed: 'badge-warning',
    running: 'badge-primary',
    finished: 'badge-secondary',
    canceled: 'badge-error',
  };

  static tournamentActionMap: Record<string, string> = {
    open: 'Inscribirme',
    closed: 'Ver torneo',
    running: 'Ver peleas',
    finished: 'Ver podio',
    canceled: 'Ver torneo',
  };

  static tournamentStatusMap: Record<string, string> = {
    open: 'Abierto',
    closed: 'Cerrado',
    running: 'En Curso',
    finished: 'Finalizado',
    canceled: 'Cancelado',
  };

  static GetGameImage(game: Game, size = 'thumb'): string {
    if (!game.imgId || game.imgId === '') {
      return `https://placehold.co/600x400/1e293b/white?text=${game.name.replace(' ', '+')}`;
    }
    switch (size) {
      case 'medium':
        return `//images.igdb.com/igdb/image/upload/t_screenshot_big/${game.imgId}.jpg`;
      case 'big':
        return `//images.igdb.com/igdb/image/upload/t_1080p/${game.imgId}.jpg`;
      case 'thumb':
      default:
        return `//images.igdb.com/igdb/image/upload/t_thumb/${game.imgId}.jpg`;
    }
  }
}
