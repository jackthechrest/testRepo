import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne } from 'typeorm';
import { RulesOfLove } from './RulesOfLove';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column({ default: 0 })
  profileViews: number;

  @Column({ default: true })
  isSingle: boolean;

  // Rules Of Love
  @ManyToOne(() => RulesOfLove, (rol) => rol.players, { cascade: ['insert', 'update'] })
  rolInfo: Relation<RulesOfLove>;

  @Column({ default: 'NONE' })
  currentPlay: RulesOfLoveOptions;

  @Column({ default: 0 })
  currentWinStreak: number;

  @Column({ default: 0 })
  highestWinStreak: number;

  // Copycat
  // make sure to check for when both players are 'creator' role at beginning of game
  @Column({ default: 'creator' })
  currentCopycatRole: CopycatRoles;

  @Column({ default: 0 })
  highestRoundReachedCopycat: number;
}
