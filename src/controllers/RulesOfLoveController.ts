import { Request, Response } from 'express';
import { startROL, getROLById, joinROL } from '../models/RulesOfLoveModel';
import { getUserById } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function intermediateRulesOfLove(req: Request, res: Response): Promise<void> {
  const { gameId, newPlay } = req.body as RulesOfLoveBody;
  console.log(`GameId: ${gameId}\nnewPlay: ${newPlay}`);

  // NOTES: Access the data from `req.session`
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const user = await getUserById(authenticatedUser.userId);
  if (!user) {
    // res.sendStatus(404); // 404 not found
    res.redirect('/index');
    return;
  }
  // try to join game with the id
  let game = await getROLById(gameId);

  // game did not exist already, make a new one with that id
  if (!game) {
    try {
      game = await startROL(gameId, user, newPlay);
      console.log(`${user.username} has created Rules of Love ${game.gameId}`);
    } catch (err) {
      console.error(err);
      const databaseErrorMessage = parseDatabaseError(err);
      res.status(500).json(databaseErrorMessage);
    }
  } else if (game.players.length >= 2) {
    // full game or player is joining game they already started
    res.redirect('/rulesoflove');
  } else {
    game = await joinROL(game, user, newPlay);
    console.log(`${user.username} has joined Rules of Love ${game.gameId}`);
    res.redirect(`/rulesoflove/play/${gameId}`);
  }
}

async function playRulesOfLove(req: Request, res: Response): Promise<void> {
  res.sendStatus(201);
}

export { intermediateRulesOfLove, playRulesOfLove };
