import { CrudInterface, DataTypes, OmitId } from 'brackets-manager'
import { BracketGroup } from './bracket-group.entity.js'
import { BracketRound } from './bracket-round.entity.js'
import { BracketMatch } from './bracket-match.entity.js'
import { BracketParticipant } from './bracket-participant.entity.js'
import { BracketMatchGame } from './bracket-match-game.entity.js'
import { BracketStage } from './bracket-stage.entity.js'
import { ORM } from '../shared/db/orm.js'

const em = ORM.em

const normalize = (v: any) => ({
    ...v,
    ...(v.tournament_id !== undefined && { tournamentId: v.tournament_id }),
    ...(v.stage_id !== undefined && { stageId: v.stage_id }),
    ...(v.group_id !== undefined && { groupId: v.group_id }),
    ...(v.round_id !== undefined && { roundId: v.round_id }),
    ...(v.child_count !== undefined && { childCount: v.child_count }),
})

export class MikroOrmDatabase implements CrudInterface {
    // INSERT overloads
    async insert<T extends keyof DataTypes>(table: T, value: OmitId<DataTypes[T]>): Promise<number>
    async insert<T extends keyof DataTypes>(table: T, values: OmitId<DataTypes[T]>[]): Promise<boolean>
    async insert<T extends keyof DataTypes>(
        table: T,
        value: OmitId<DataTypes[T]> | OmitId<DataTypes[T]>[],
    ): Promise<number | boolean> {
        console.log('insert', table, value)

        const entity = this.getEntity(table)

        if (Array.isArray(value)) {
            value.forEach((v) => em.create(entity, normalize(v)))
            await em.flush()
            return true
        }

        const created = em.create(entity, normalize(value))
        await em.flush()
        return (created as any).id
    }

    // SELECT overloads
    async select<T extends keyof DataTypes>(table: T): Promise<DataTypes[T][] | null>
    async select<T extends keyof DataTypes>(table: T, id: number): Promise<DataTypes[T] | null>
    async select<T extends keyof DataTypes>(
        table: T,
        filter: Partial<DataTypes[T]>,
    ): Promise<DataTypes[T][] | null>
    async select<T extends keyof DataTypes>(
        table: T,
        filterOrId?: number | Partial<DataTypes[T]>,
    ): Promise<DataTypes[T] | DataTypes[T][] | null> {
        const entity = this.getEntity(table)

        // select by id
        if (typeof filterOrId === 'number') {
            const result = await em.findOne(entity, { id: filterOrId })
            return result as DataTypes[T] | null
        }

        // select all or with filter
        const results = await em.find(entity, filterOrId ?? {})
        return results.length ? (results as DataTypes[T][]) : null
    }

    // UPDATE overloads
    async update<T extends keyof DataTypes>(table: T, id: number, value: DataTypes[T]): Promise<boolean>
    async update<T extends keyof DataTypes>(
        table: T,
        filter: Partial<DataTypes[T]>,
        value: Partial<DataTypes[T]>,
    ): Promise<boolean>
    async update<T extends keyof DataTypes>(
        table: T,
        filterOrId: number | Partial<DataTypes[T]>,
        value: Partial<DataTypes[T]>,
    ): Promise<boolean> {
        const entity = this.getEntity(table)

        // update by id
        if (typeof filterOrId === 'number') {
            const record = await em.findOne(entity, { id: filterOrId })
            if (!record) return false
            em.assign(record, normalize(value))
            await em.flush()
            return true
        }

        // update by filter
        const records = await em.find(entity, filterOrId)
        records.forEach((record) => em.assign(record, normalize(value)))
        await em.flush()
        return records.length > 0
    }

    // DELETE overloads
    async delete<T extends keyof DataTypes>(table: T): Promise<boolean>
    async delete<T extends keyof DataTypes>(table: T, filter: Partial<DataTypes[T]>): Promise<boolean>
    async delete<T extends keyof DataTypes>(table: T, filter?: Partial<DataTypes[T]>): Promise<boolean> {
        //! Ojo, esto puede borrar todo.
        const entity = this.getEntity(table)
        const records = await em.find(entity, filter ?? {})
        await em.removeAndFlush(records)
        return records.length > 0
    }

    private getEntity(table: string) {
        const entityMap: Record<string, any> = {
            participant: BracketParticipant,
            stage: BracketStage,
            group: BracketGroup,
            round: BracketRound,
            match: BracketMatch,
            match_game: BracketMatchGame,
        }
        const entity = entityMap[table]
        if (!entity) throw new Error(`Unknown table: ${table}`)
        return entity
    }
}
