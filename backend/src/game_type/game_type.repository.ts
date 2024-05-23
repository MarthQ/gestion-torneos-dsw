import { Repository } from '../shared/repository.js'
import { Game_Type } from './game_type.entity.js'
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class Game_TypeRepository implements Repository<Game_Type> {
    public async findAll(): Promise<Game_Type[] | undefined> {
        const [game_types] = await pool.query('SELECT * FROM gameTypes')

        return game_types as Game_Type[]
    }

    public async findOne(item: { id: string }): Promise<Game_Type | undefined> {
        const id = Number.parseInt(item.id)
        const [game_types] = await pool.query<RowDataPacket[]>('SELECT * FROM gameTypes WHERE id = ?', [id])
        if (game_types.length === 0) {
            return undefined
        }
        const game_type = game_types[0]

        return game_type as Game_Type
    }

    public async add(gametypeInput: Game_Type): Promise<Game_Type | undefined> {
        const { _id, ...gametypesRow } = gametypeInput
        const [result] = await pool.query<ResultSetHeader>('INSERT INTO gameTypes SET ?', [gametypesRow])
        gametypeInput._id = result.insertId

        return result ? gametypeInput : undefined
    }

    public async update(id: string, gametypeInput: Game_Type): Promise<Game_Type | undefined> {
        const { _id, ...gametypesRow } = gametypeInput
        await pool.query('UPDATE gameTypes SET ? WHERE id = ?', [gametypeInput, Number.parseInt(id)])

        return await this.findOne({ id })
    }

    public async delete(item: { id: string }): Promise<Game_Type | undefined> {
        try {
            const gametypeToDelete = await this.findOne(item)
            const gametypeId = Number.parseInt(item.id)
            await pool.query('DELETE FROM gameTypes WHERE id = ?', gametypeId)

            return gametypeToDelete
        } catch (error: any) {
            throw new Error('Unable to delete game type.')
        }
    }
}
