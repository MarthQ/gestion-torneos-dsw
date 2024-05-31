import { Repository } from '../shared/repository.js'
import { User } from './user.entity.js'
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class userRepository implements Repository<User> {
    public async findAll(): Promise<User[] | undefined> {
        const [users] = await pool.query('SELECT * FROM users')

        return users as User[]
    }

    public async findOne(item: { id: string }): Promise<User | undefined> {
        const id = Number.parseInt(item.id)
        const [users] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM users WHERE id = ?',
            [id]
        )
        if (users.length === 0) {
            return undefined
        }
        const user = users[0]

        return user as User
    }

    public async add(userInput: User): Promise<User | undefined> {
        const { _id, ...usersRow } = userInput
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO users SET ?',
            [usersRow]
        )
        userInput._id = result.insertId

        return result ? userInput : undefined
    }

    public async update(
        id: string,
        userInput: User
    ): Promise<User | undefined> {
        const { _id, ...usersRow } = userInput
        await pool.query('UPDATE users SET ? WHERE id = ?', [
            userInput,
            Number.parseInt(id),
        ])

        return await this.findOne({ id })
    }

    public async delete(item: { id: string }): Promise<User | undefined> {
        try {
            const userToDelete = await this.findOne(item)
            const userId = Number.parseInt(item.id)
            await pool.query('DELETE FROM users WHERE id = ?', userId)

            return userToDelete
        } catch (error: any) {
            throw new Error('Unable to delete user')
        }
    }
}
