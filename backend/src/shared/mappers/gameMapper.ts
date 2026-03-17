import { GameDTO, IGDBGame } from '../interfaces/game'

export class GameMapper {
    static mapIgdbGameItemToGame(igdbGame: IGDBGame): GameDTO {
        return {
            igdbId: igdbGame.id,
            name: igdbGame.name,
            description: igdbGame.summary ?? '',
            imgUrl: igdbGame.cover?.url,
            tournament: [],
        }
    }

    static mapIgdbGameArrayToGameArray(igdbGame: IGDBGame[]): GameDTO[] {
        return igdbGame.map((game) => GameMapper.mapIgdbGameItemToGame(game))
    }
}
