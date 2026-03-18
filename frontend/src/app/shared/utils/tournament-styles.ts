import { Game } from '@shared/interfaces/game';
import { Tournament } from '@shared/interfaces/tournament';

export const TournamentStatusMap: Record<string, string> = {
  Abierto: 'bg-green-500',
  Cerrado: 'bg-red-500',
  'En curso': 'bg-yellow-500',
  Finalizado: 'bg-orange-500',
};

export const TournamentActionMap: Record<string, string> = {
  Abierto: 'Inscribirme',
  Cerrado: 'Ver podio',
  Finalizado: 'Ver podio',
  'En curso': 'Ver Llaves',
};

export function GetGameImage(game: Game, size = 'thumb'): string {
  if (game.imgId) {
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
  return `https://placehold.co/600x400/1e293b/white?text=${game.name.replace(' ', '+')}`;
}
