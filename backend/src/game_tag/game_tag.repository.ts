import { Repository } from '../shared/repository.js'
import { Game_Tag } from './game_tag.entity.js'
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class Game_TagRepository implements Repository<Game_Tag> {
    public async findAll(): Promise<Game_Tag[] | undefined> {
        const [game_tags] = await pool.query('SELECT * FROM gameTags')

        return game_tags as Game_Tag[]
    }

    public async findOne(item: { id: string }): Promise<Game_Tag | undefined> {
        const id = Number.parseInt(item.id)
        const [game_tags] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM gameTags WHERE id = ?',
            [id]
        )
        if (game_tags.length === 0) {
            return undefined
        }
        const game_tag = game_tags[0]

        return game_tag as Game_Tag
    }

    public async add(gametagInput: Game_Tag): Promise<Game_Tag | undefined> {
        const { _id, ...gametagsRow } = gametagInput
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO gameTags SET ?',
            [gametagsRow]
        )
        gametagInput._id = result.insertId

        return result ? gametagInput : undefined
    }

    public async update(
        id: string,
        gametagInput: Game_Tag
    ): Promise<Game_Tag | undefined> {
        const { _id, ...gametagsRow } = gametagInput
        await pool.query('UPDATE gameTags SET ? WHERE id = ?', [
            gametagInput,
            Number.parseInt(id),
        ])

        return await this.findOne({ id })
    }

    public async delete(item: { id: string }): Promise<Game_Tag | undefined> {
        try {
            const gametagToDelete = await this.findOne(item)
            const gametagId = Number.parseInt(item.id)
            await pool.query('DELETE FROM gameTags WHERE id = ?', gametagId)

            return gametagToDelete
        } catch (error: any) {
            throw new Error('Unable to delete game tag.')
        }
    }
}
