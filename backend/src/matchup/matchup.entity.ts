import { Entity, PrimaryKey, Property, Cascade, Collection, OneToMany, ManyToOne, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Tournament } from '../tournament/tournament.entity.js'
import { Inscription } from '../inscription/inscription.entity.js'

@Entity()
export class Matchup extends BaseEntity {
    @Property()
    player1Rounds!: number
    @Property()
    player2Rounds!: number
    @Property()
    status!: string
    @Property()
    bracket!: string
    @Property()
    round!: number
    @ManyToOne(() => Inscription, { nullable: true })
    player1Inscription?: Rel<Inscription>
    @ManyToOne(() => Inscription, { nullable: true })
    player2Inscription?: Rel<Inscription>
    @ManyToOne(() => Inscription, { nullable: true })
    winnerInscription?: Rel<Inscription>
    @ManyToOne(() => Tournament, { nullable: false })
    tournament!: Rel<Tournament>
    @ManyToOne(() => Matchup, { nullable: true })
    winnerNextMatchup?: Rel<Matchup>
    @ManyToOne(() => Matchup, { nullable: true })
    losersNextMatchup?: Rel<Matchup>

    // @OneToMany(() => Matchup, (matchup) => matchup.winnerNextMatchup)
    // comingByWinner = new Collection<Inscription>(this)
    // @OneToMany(() => Matchup, (matchup) => matchup.losersNextMatchup)
    // comingByLosers = new Collection<Inscription>(this)
}
