import Api from "../ApiMethods";
import appSettings from "../appSettings";

export const saveGameWon2v2 = async (winningTeam, players) => {
  const game2v2WonBody = [];
  const winningTeamIds = winningTeam.map(player => player.Id);

  players.forEach(player => {
    let Win;
    if (winningTeamIds.indexOf(player.Id) !== -1) {
      Win = true;
    } else {
      Win = false;
    }
    game2v2WonBody.push({ PlayerId: player.Id, Win });
  });
  console.log(game2v2WonBody);

  let updatePlayersGames = await Api.post(
    appSettings.endpoints.UpdatePlayersWins,
    game2v2WonBody
  );

  console.log(updatePlayersGames);
};
