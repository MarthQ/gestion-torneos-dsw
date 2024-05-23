import { Repository } from "../shared/repository.js";
import { Game_Type } from "./game_type.entity.js";
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from "mysql2";

const game_types = {
        name: 'Classic Fighter',
        description: 'es un juego donde te cagas a piñas',
        tags: 'street fighter',
}

export class Game_TypeRepository implements Repository<Game_Type> {
    public async findAll(): Promise<Game_Type[] | undefined> {
        const [game_types] = await pool.query('select * from gametypes')
        return game_types as Game_Type[];
    }

    public async findOne(item: { id: string }): Promise<Game_Type | undefined> {
        const id = Number.parseInt(item.id);
        const [game_types] = await pool.query<RowDataPacket[]>('select * from gametypes = ?',[id]);
        if(game_types.length===0){return undefined}
        const game_type = game_types[0];
        return game_type as Game_Type;
    }

    public async add(gametypeInput: Game_Type): Promise<Game_Type | undefined> {
        const{_id, name, ...gametypesRow} = gametypeInput;
        const [result] = await pool.query<ResultSetHeader>('insert into gametypes set ?', [gametypesRow]) 
        gametypeInput._id = result.insertId 
        return gametypeInput;
    }

    public async update(id:string, gametypeInput: Game_Type): Promise<Game_Type | undefined> {
        const{_id,name, ...gametypesRow} = gametypeInput;
        await pool.query('update characters set ? where id = ?', [gametypeInput,Number.parseInt(id)]);
        return gametypeInput;
    }

    public async delete(item: { id: string }): Promise<Game_Type | undefined> {
        try{
        const gametypeToDelete = await this.findOne(item);
        const gametypeId = Number.parseInt(item.id);
        await pool.query('delete from gametypes where id=?',gametypeId)
        return gametypeToDelete;
        }catch(error: any){
            throw new Error('unable to delete game type')
        }
    }
}
