import { Repository } from "../shared/repository.js";
import { Game_Type } from "./game_type.entity.js";

const game_types = [
    new Game_Type(
        "Classic Fighter",
        "One-on-one battles between distinct characters, each with their own unique moves and abilities.",
        ["SF", "Fighter", "KOF", "1v1"],
        "8d47c07a-769f-433b-9830-5fb881156d81"
    ),
];

export class Game_TypeRepository implements Repository<Game_Type> {
    public findAll(): Game_Type[] | undefined {
        return game_types;
    }

    public findOne(item: { id: string }): Game_Type | undefined {
        return game_types.find((game_type) => game_type.id === item.id);
    }

    public add(item: Game_Type): Game_Type | undefined {
        game_types.push(item);
        return item;
    }

    public update(item: Game_Type): Game_Type | undefined {
        const game_typeIdx = game_types.findIndex(
            (game_type) => game_type.id === item.id
        );

        if (game_typeIdx !== -1) {
            game_types[game_typeIdx] = { ...game_types[game_typeIdx], ...item };
        }
        return game_types[game_typeIdx];
    }

    public delete(item: { id: string }): Game_Type | undefined {
        const game_typeIdx = game_types.findIndex(
            (game_type) => game_type.id === item.id
        );

        if (game_typeIdx !== -1) {
            const deletedGame_Types = game_types[game_typeIdx];
            game_types.splice(game_typeIdx, 1);
            return deletedGame_Types;
        }
    }
}
