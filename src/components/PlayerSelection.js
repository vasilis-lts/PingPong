import React, { useState, useEffect } from "react";
import { Link } from "react-navi";
import appSettings from "../appSettings";

export default function PlayerSelection(props) {
  const style = {
    playersSelected: {
      margin: "0",
      fontSize: "3vw",
      width: 100 / props.playersAmount + "%"
    }
  };

  const [SelectedBoxes, setSelectedBoxes] = useState([]);
  const [SelectedPlayers, setSelectedPlayers] = useState([]);
  const [CountryActive, setCountryActive] = useState("GR");
  const [ActivePlayersByCountry, setActivePlayersByCountry] = useState([]);
  const [ActivePlayersAmount, setActivePlayersAmount] = useState(0);
  const [PlayerHovered, setPlayerHovered] = useState(0);

  const ActivePlayers = 6;

  useEffect(() => {
    initConnection();
  }, []);

  useEffect(() => {
    console.log(ActivePlayersByCountry);
    if (ActivePlayersByCountry.length) {
      localStorage.setItem(
        "ActivePlayers",
        JSON.stringify(ActivePlayersByCountry)
      );
    }
  }, [ActivePlayersByCountry]);

  const initConnection = () => {
    const url = "ws://localhost:8080/";
    const connection = new WebSocket(url);
    let counter = 0;

    console.log(connection);

    connection.onopen = () => {
      console.log("connection opened");
      localStorage.setItem("PlayerHovered", 0);
    };

    connection.onerror = error => {
      console.log(`WebSocket error: ${JSON.stringify(error)}`);
    };

    connection.onmessage = e => {
      const message = JSON.parse(e.data);

      if (message.buttonAction === appSettings.ButtonActions.SinglePress) {
        counter < ActivePlayers - 1 ? counter++ : (counter = 0);

        localStorage.setItem("PlayerHovered", counter);
        const _playerHovered = parseInt(
          localStorage.getItem("PlayerHovered"),
          10
        );
        setPlayerHovered(_playerHovered);
      } else if (message.buttonAction === appSettings.ButtonActions.Hold) {
        const activePlayers = JSON.parse(localStorage.getItem("ActivePlayers"));
        // selectBoxClicked(activePlayers[counter].Id);
        const elem = document.querySelector(
          ".player-select-box.color-border-toggle"
        );
        elem.click();
      }
    };

    return () => {
      // connection.close();
    };
  };

  useEffect(() => {
    const playersActive = props.players.filter(player => {
      return player.Country === CountryActive;
    });
    setActivePlayersByCountry(playersActive);
    // eslint-disable-next-line
  }, [CountryActive]);

  const flicMessageHandler = SocketMessage => {
    switch (SocketMessage.buttonAction) {
      case appSettings.ButtonActions.SinglePress:
        singlePress();
        break;
      case appSettings.ButtonActions.Hold:
        // setShowCoinFlip(true);
        break;
      case appSettings.ButtonActions.DoublePress:
        // nothing yet
        break;

      default:
        break;
    }
  };

  const singlePress = () => {
    if (PlayerHovered < ActivePlayers) {
      // setPlayerHovered(PlayerHovered + 1);
    }
  };

  const isPlayerSelected = id => {
    const _selectedPlayers = [...SelectedPlayers];
    let playerSelected = false;
    let i;

    if (_selectedPlayers.length) {
      // check if player is selected
      _selectedPlayers.forEach((player, index) => {
        if (props.players[id - 1].Name === player.Name) {
          playerSelected = true;
          i = index;
        }
      });
    }

    return [playerSelected, i];
  };

  function selectBoxClicked(playerId) {
    // id equals index in players list

    const _selectedPlayers = [...SelectedPlayers];
    const _selectedBoxes = [...SelectedBoxes];
    const clickedBox = playerId;

    const [playerSelected, index] = isPlayerSelected(clickedBox);

    if (playerSelected) {
      _selectedPlayers.splice(index, 1);
      _selectedBoxes.splice(_selectedBoxes.indexOf(clickedBox), 1);
    } else {
      if (SelectedPlayers.length < props.playersAmount) {
        _selectedPlayers.push(props.players[clickedBox - 1]);
        _selectedBoxes.push(clickedBox);
      }
    }

    console.log(_selectedPlayers);
    console.log(_selectedBoxes);

    setSelectedBoxes(_selectedBoxes);
    setSelectedPlayers(_selectedPlayers);
  }

  return (
    <div>
      <div className="flex sb">
        <div className="flex">
          <h1>Players select!</h1>
          <h3
            className={`country-selection ${
              CountryActive === "GR" ? "highlighted-country" : ""
            }`}
            onClick={() => setCountryActive("GR")}
          >
            GR
          </h3>
          <h3
            className={`country-selection ${
              CountryActive === "NL" ? "highlighted-country" : ""
            }`}
            onClick={() => setCountryActive("NL")}
          >
            NL
          </h3>
        </div>
        <h3>
          {SelectedPlayers.length <= props.playersAmount - 1 ? (
            <Link href="/main-menu" direction="forward">
              <h3 className="m0">Back to main menu</h3>
            </Link>
          ) : (
            // `Select ${4 - SelectedPlayers.length} ${
            //   SelectedPlayers.length !== 0 ? "more" : ""
            // } player${SelectedPlayers.length < 3 ? "s" : ""} `
            <button
              className="btn btn-primary"
              onClick={() => props.onPlayersSelected(SelectedPlayers)}
            >
              <h3 className="m0">Confirm Players?</h3>
            </button>
          )}
        </h3>
      </div>
      <div className="flex">
        {ActivePlayersByCountry.map((player, index) => (
          <div
            className={`player-select-box ${
              SelectedBoxes.includes(player.Id) ? "selected" : ""
            } ${PlayerHovered === index ? "color-border-toggle" : ""}  `}
            key={player.Id}
            id={index}
            // onMouseEnter={e => setPlayerHovered(index)}
            onClick={e => selectBoxClicked(player.Id)}
          >
            {player.Name}
          </div>
        ))}
      </div>
      <div className="flex mt2">
        <h4 style={style.playersSelected}>
          P1 {SelectedPlayers[0] ? SelectedPlayers[0].Name : "..."}
        </h4>
        <h4 style={style.playersSelected}>
          P2 {SelectedPlayers[1] ? SelectedPlayers[1].Name : "..."}
        </h4>
        <h4 style={style.playersSelected}>
          P3 {SelectedPlayers[2] ? SelectedPlayers[2].Name : "..."}
        </h4>
        <h4 style={style.playersSelected}>
          P4 {SelectedPlayers[3] ? SelectedPlayers[3].Name : "..."}
        </h4>
      </div>
    </div>
  );
}
