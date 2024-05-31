import { Repository } from '../shared/repository.js'
import { Location } from './location.entity.js'
import { pool } from '../shared/db/conn.mysql.js'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class LocationRepository implements Repository<Location> {
    public async findAll(): Promise<Location[] | undefined> {
        const [locations] = await pool.query('SELECT * FROM locations')

        return locations as Location[]
    }

    public async findOne(item: { id: string }): Promise<Location | undefined> {
        const id = Number.parseInt(item.id)
        const [locations] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM locations WHERE id = ?',
            [id]
        )
        if (locations.length === 0) {
            return undefined
        }
        const location = locations[0]

        return location as Location
    }

    public async add(locationInput: Location): Promise<Location | undefined> {
        const { _id, ...locationsRow } = locationInput
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO locations SET ?',
            [locationsRow]
        )
        locationInput._id = result.insertId

        return result ? locationInput : undefined
    }

    public async update(
        id: string,
        locationInput: Location
    ): Promise<Location | undefined> {
        const { _id, ...locationsRow } = locationInput
        await pool.query('UPDATE locations SET ? WHERE id = ?', [
            locationInput,
            Number.parseInt(id),
        ])

        return await this.findOne({ id })
    }

    public async delete(item: { id: string }): Promise<Location | undefined> {
        try {
            const locationToDelete = await this.findOne(item)
            const locationId = Number.parseInt(item.id)
            await pool.query('DELETE FROM locations WHERE id = ?', locationId)

            return locationToDelete
        } catch (error: any) {
            throw new Error('Unable to delete location')
        }
    }
}
