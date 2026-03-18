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

export function getTournamentBackgroundStyle(tournament: Tournament): string {
  const fallback = `https://placehold.co/600x400/1e293b/white?text=${tournament.name.replace(' ', '+')}`;
  const url = tournament.game.imgUrl ?? fallback;
  return `background-image: url('${url}');`;
}
