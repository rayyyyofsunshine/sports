import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";

export default function PlayersTab({ players, sport }) {
  const cricketPosition = (pos) => {
    if (pos === "BM") return "Batsman";
    else if (pos === "B") return "Bowler";
    else if (pos === "AR") return "All Rounder";
    else if (pos === "WK") return "Wicket Keeper";
  };

  const aFootballPosiiton = (pos) => {
    if (pos === "QB") return "Quarterback";
    else if (pos === "RB") return "Running Back";
    else if (pos === "TE") return "Tight End";
    else if (pos === "WR") return "Wide Receiver";
    else if (pos === "LB") return "Linebacker";
    else if (pos === "SAF") return "Safety";
    else if (pos === "K") return "Kicker";
    else if (pos === "P") return "Punter";
    else if (pos === "C") return "Center";
    else if (pos === "G") return "Guard";
    else if (pos === "T") return "Tackle";
    else if (pos === "FB") return "Full Back";
    else if (pos === "FS") return "Free Safety";
    else if (pos === "CB") return "Corner Back";
    else if (pos === "DB") return "Defensive Back";
    else if (pos === "DE") return "Defensive End";
    else if (pos === "DT") return "Defensive Tackle";
    else if (pos === "MLB") return "Middle Linebacker";
    else if (pos === "OLB") return "Outside Linebacker";
    else if (pos === "OT") return "Offensive Tackle";
    else if (pos === "OG") return "Offensive Guard";
    else if (pos === "NT") return "Nose Tackle";
    else if (pos === "LT") return "Left Tackle";
  };

  console.log(players);

  return (
    <div className="playersTab-container">
      <table>
        <thead>
          <tr>
            <td>{window.innerWidth < 1024 ? "No" : "Number"}</td>
            <td>Name</td>
            <td>{sport === "football" ? "Age" : "DOB"}</td>
            {sport !== "football" && <td>Nationality</td>}
            <td>Position</td>
            {sport !== "american-football" && sport !== "football" && (
              <td>Info</td>
            )}
          </tr>
        </thead>
        <tbody>
          {players?.map((player, index) => (
            <tr key={index}>
              <td>{player?.number ?? player?.player?.shirtNumber ?? "-"}</td>
              <td>
                <Link
                  className="link"
                  to={`/${sport}/player/${player?.id ?? player?.player?.id}`}
                >
                  {sport === "football" ? (
                    <div className="player">
                      <img src={player?.photo} alt="player-img" />
                      <p>{player?.name}</p>
                    </div>
                  ) : (
                    player?.player?.name
                  )}
                </Link>
              </td>
              <td>
                {sport === "football"
                  ? player?.age
                  : moment
                      .unix(player?.player?.dateOfBirthTimestamp)
                      .utc()
                      .format("DD-MM-YYYY")}
              </td>
              {sport !== "football" && <td>{player?.player?.country?.name}</td>}
              <td>
                {sport === "cricket"
                  ? cricketPosition(player?.player?.position)
                  : sport === "american-football"
                  ? aFootballPosiiton(player?.player?.position)
                  : player?.position}
              </td>
              {sport !== "american-football" && sport !== "football" && (
                <td>
                  {player?.player?.position === "BM"
                    ? `${player?.player?.cricketPlayerInfo?.batting}-hand batsman`
                    : player?.player?.cricketPlayerInfo?.bowling}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
