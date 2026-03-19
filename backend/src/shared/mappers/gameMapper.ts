import { GameDTO, IGDBGame } from '../interfaces/game'

export class GameMapper {
    static mapIgdbGameItemToGame(igdbGame: IGDBGame): GameDTO {
        return {
            igdbId: igdbGame.id,
            name: igdbGame.name,
            description: igdbGame.summary ?? '',
            imgId: igdbGame.cover?.image_id,
            tournament: [],
        }
    }

    static mapIgdbGameArrayToGameArray(igdbGame: IGDBGame[]): GameDTO[] {
        return igdbGame.map((game) => GameMapper.mapIgdbGameItemToGame(game))
    }
}
