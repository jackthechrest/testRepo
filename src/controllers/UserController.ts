import { Request, Response } from 'express';
import argon2 from 'argon2';
import { addUser, getUserByEmail, allUserData } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function getAllUserProfiles(req: Request, res: Response): Promise<void> {
  res.json(await allUserData());
}

async function registerUser(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body as NewUserRequest;

  // IMPORTANT: Hash the password
  const passwordHash = await argon2.hash(password);

  try {
    // IMPORTANT: Store the `passwordHash` and NOT the plaintext password
    const newUser = await addUser(username, email, passwordHash);
    console.log(newUser);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  console.log(req.session);

  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);
  if (!user) {
    res.redirect('/login'); // 404 Not Found - email doesn't exist
    return;
  }

  const { passwordHash } = user;
  if (!(await argon2.verify(passwordHash, password))) {
    res.redirect('/login'); // 404 Not Found - user with email/pass doesn't exist
    return;
  }

  // NOTES: Remember to clear the session before setting their authenticated session data
  await req.session.clearSession();

  // NOTES: Now we can add whatever data we want to the session
  req.session.authenticatedUser = {
    userId: user.userId,
    username: user.username,
    email: user.email,
  };

  req.session.isLoggedIn = true;
  res.redirect('/welcome');
  // res.render('ProfilePage', { email: user.email });
}

export { registerUser, logIn, getAllUserProfiles };
