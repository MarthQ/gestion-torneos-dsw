import { tournamentStatusMap } from './tournament-map-styles';
import { TournamentActionMap } from './tournament-map-styles';

describe('tournamentStatusMap', () => {
  it('should return correct CSS class for each tournament status', () => {
    expect(tournamentStatusMap['Abierto']).toBe('badge-primary');
    expect(tournamentStatusMap['Cerrado']).toBe('badge-error');
    expect(tournamentStatusMap['En curso']).toBe('badge-warning');
    expect(tournamentStatusMap['Finalizado']).toBe('badge-secondary');
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