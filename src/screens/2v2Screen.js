import React, { useEffect, useState } from "react";
import thefuckingplantImage from "../assets/images/the_fucking_plant.png";
import "../App.scss";
import Modal from "../components/Modal";

function TeamRandomizer(props) {
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);

  useEffect(() => {
    randomizeTeams();
  }, []);

  function randomizeTeams() {
    const players = ["Bill", "Dennis", "Stevy", "Thomas"];
    const numberOfPlayers = players.length;
    const team1 = [];
    const team2 = [];
    setTeam1([]);
    setTeam2([]);

    setTimeout(() => {
      do {
        let randomIndex = Math.floor(Math.random() * players.length);
        if (players.length > numberOfPlayers / 2) {
          team1.push(players[randomIndex]);
        } else {
          team2.push(players[randomIndex]);
        }
        players.splice(randomIndex, 1);
      } while (players.length > 0);

      setTeam1(team1);
      setTeam2(team2);
    }, 500);
  }

  return (
    <div className="TeamRandomizer screen">
      <p
        className="nav-link main-menu-link"
        onClick={() => props.goToMainMenu()}
      >{`<- Back to main menu`}</p>
      <div className="flex">
        <div className="team-title red">
          <h1>Team Red</h1>
        </div>
        <div className="team-title blue">
          <h1>Team Blue</h1>
        </div>
      </div>
      <div className="teams-container">
        <div className="flex">
          <div className="teams" id="team1">
            <div className="players">
              {team1.length ? (
                team1.map((player, index) => (
                  <p key={index} className="box">
                    {player}
                  </p>
                ))
              ) : (
                <div style={{ height: "80px" }} />
              )}
            </div>
          </div>
          <div className="teams" id="team2">
            <div className="players">
              {team2.length ? (
                team2.map((player, index) => (
                  <p key={index} className="box">
                    {player}
                  </p>
                ))
              ) : (
                <div style={{ height: "80px" }} />
              )}
            </div>
          </div>
        </div>
      </div>
      {team1.length && team2.length ? (
        <button
          className="mt2 btn btn-primary font-large"
          onClick={() => randomizeTeams()}
        >
          Re-Randomize!
        </button>
      ) : null}

      <img
        width="100"
        src={thefuckingplantImage}
        id="theFuckingPlant"
        alt="the fucking plant"
      />

      {!team1.length && !team2.length ? (
        <Modal text="Randomizing Teams..." />
      ) : null}
    </div>
  );
}

export default TeamRandomizer;