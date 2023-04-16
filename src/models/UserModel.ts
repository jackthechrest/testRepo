import { AppDataSource } from '../dataSource';
import { RulesOfLove } from '../entities/RulesOfLove';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function addUser(username: string, email: string, passwordHash: string): Promise<User> {
  // Create the new user object
  let newUser = new User();
  newUser.username = username;
  newUser.email = email;
  newUser.passwordHash = passwordHash;

  // Then save it to the database
  // NOTES: We reassign to `newUser` so we can access
  // NOTES: the fields the database autogenerates (the id & default columns)
  newUser = await userRepository.save(newUser);

  return newUser;
}

async function getUserByEmail(email: string): Promise<User | null> {
  return userRepository.findOne({ where: { email } });
}

async function allUserData(): Promise<User[]> {
  return userRepository.find();
}

async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { userId } });
  return user;
}

async function addROL(
  userId: string,
  newPlay: RulesOfLoveOptions,
  newROL: RulesOfLove
): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ currentPlay: newPlay, rolInfo: newROL })
    .where({ userId })
    .execute();
}

export { addUser, getUserByEmail, getUserById, allUserData, addROL, userRepository };
