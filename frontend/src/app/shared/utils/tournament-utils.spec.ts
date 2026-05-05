import { TournamentUtils } from '@shared/utils/tournament-utils'

describe('TournamentUtils - tournamentStatusBadgeMap', () => {
  it('should return correct badge class for each status', () => {
    expect(TournamentUtils.tournamentStatusBadgeMap['open']).toBe('badge-success')
    expect(TournamentUtils.tournamentStatusBadgeMap['closed']).toBe('badge-warning')
    expect(TournamentUtils.tournamentStatusBadgeMap['running']).toBe('badge-primary')
    expect(TournamentUtils.tournamentStatusBadgeMap['finished']).toBe('badge-secondary')
    expect(TournamentUtils.tournamentStatusBadgeMap['canceled']).toBe('badge-error')
  })
})

describe('TournamentUtils - tournamentActionMap', () => {
  it('should return correct action label for each status', () => {
    expect(TournamentUtils.tournamentActionMap['open']).toBe('Inscribirme')
    expect(TournamentUtils.tournamentActionMap['closed']).toBe('Ver torneo')
    expect(TournamentUtils.tournamentActionMap['running']).toBe('Ver peleas')
    expect(TournamentUtils.tournamentActionMap['finished']).toBe('Ver podio')
    expect(TournamentUtils.tournamentActionMap['canceled']).toBe('Ver torneo')
  })
})

describe('TournamentUtils - GetGameImage', () => {
  it('should return placeholder when game has no imgId', () => {
    const game = { name: 'Test Game', imgId: '' } as any
    expect(TournamentUtils.GetGameImage(game)).toContain('placehold.co')
  })

  it('should return thumb URL by default when game has imgId', () => {
    const game = { name: 'Test Game', imgId: 'abc123' } as any
    expect(TournamentUtils.GetGameImage(game)).toContain('t_thumb')
  })

  it('should return correct URL for each size', () => {
    const game = { name: 'Test Game', imgId: 'abc123' } as any
    expect(TournamentUtils.GetGameImage(game, 'medium')).toContain('t_screenshot_big')
    expect(TournamentUtils.GetGameImage(game, 'cover_big')).toContain('t_cover_big')
    expect(TournamentUtils.GetGameImage(game, 'cover_small')).toContain('t_cover_small')
  })
})