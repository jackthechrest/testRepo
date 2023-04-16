import { AppDataSource } from '../dataSource';
import { RulesOfLove } from '../entities/RulesOfLove';
import { User } from '../entities/User';
import { addROL } from './UserModel';

// rules of love repository
const rolRepository = AppDataSource.getRepository(RulesOfLove);

async function startROL(
  gameId: string,
  player: User,
  play: RulesOfLoveOptions
): Promise<RulesOfLove> {
  let newROL = new RulesOfLove();
  newROL.gameId = gameId;
  await addROL(player.userId, play, newROL);

  newROL = await rolRepository.save(newROL);

  console.log(newROL);

  return newROL;
}

async function joinROL(
  game: RulesOfLove,
  player: User,
  play: RulesOfLoveOptions
): Promise<RulesOfLove> {
  const updatedGame = game;
  await addROL(player.userId, play, updatedGame);

  await rolRepository.save(updatedGame);

  console.log(updatedGame);

  return updatedGame;
}

async function getROLById(gameId: string): Promise<RulesOfLove | null> {
  return rolRepository.findOne({ where: { gameId } });
}

async function getAllROL(): Promise<RulesOfLove[]> {
  return rolRepository.find();
}

async function endROLById(gameId: string): Promise<void> {
  await rolRepository
    .createQueryBuilder('rol')
    .delete()
    .from(RulesOfLove)
    .where('gameId = :gameId', { gameId })
    .execute();
}

export { startROL, joinROL, getROLById, getAllROL, endROLById };
