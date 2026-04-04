import { tournamentStatusMap } from './tournament-map-styles';
import { TournamentActionMap } from './tournament-map-styles';

describe('tournamentStatusMap', () => {
  it('should return correct CSS class for each tournament status', () => {
    expect(tournamentStatusMap['Abierto']).toBe('bg-green-500');
    expect(tournamentStatusMap['Cerrado']).toBe('bg-red-500');
    expect(tournamentStatusMap['En curso']).toBe('bg-yellow-500');
    expect(tournamentStatusMap['Finalizado']).toBe('bg-orange-500');
  });
});

describe('TournamentActionMap', () => {
  it('should return correct action label for each tournament status', () => {
    expect(TournamentActionMap['Abierto']).toBe('Inscribirme');
    expect(TournamentActionMap['Cerrado']).toBe('Ver podio');
    expect(TournamentActionMap['En curso']).toBe('Ver Llaves');
    expect(TournamentActionMap['Finalizado']).toBe('Ver podio');
  });
});