import { Game } from '@shared/interfaces/game';

export class TournamentUtils {
  static tournamentStatusMap: Record<string, string> = {
    Abierto: 'badge-primary',
    Cerrado: 'badge-error',
    'En curso': 'badge-warning',
    Finalizado: 'badge-secondary',
  };

  static tournamentActionMap: Record<string, string> = {
    Abierto: 'Inscribirme',
    Cerrado: 'Ver podio',
    Finalizado: 'Ver podio',
    'En curso': 'Ver Llaves',
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
