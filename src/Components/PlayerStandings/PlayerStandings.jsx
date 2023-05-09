import React from "react";
import { useNavigate } from "react-router";

const PlayerStandings = ({ item }) => {
  const navigate = useNavigate();
  return (
    <div className="standings">
      <table>
        <thead>
          <tr>
            <td>Pos</td>
            <td>Name</td>
            <td>Apps</td>
            <td>Assists</td>
            <td>Goals</td>
            <td>Shots(%)</td>
            <td>Passes (%)</td>
            <td>Dribbles (%)</td>
            <td>Rating</td>
          </tr>
        </thead>
        <tbody>
          {item?.map((player, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <div className="team">
                  <img
                    onClick={() =>
                      navigate(`/football/team/${player?.player?.id}`)
                    }
                    src={player.player?.photo}
                    alt=""
                  />{" "}
                  <p
                    onClick={() =>
                      navigate(`/football/team/${player?.player?.id}`)
                    }
                  >
                    {player.player?.name}
                    <span>({player?.statistics?.[0]?.team?.name})</span>
                  </p>
                </div>
              </td>
              <td>{player?.statistics?.[0]?.games?.appearences}</td>
              <td>{player?.statistics?.[0]?.goals?.assists}</td>
              <td>{player?.statistics?.[0]?.goals?.total}</td>
              <td>
                {(
                  (player?.statistics?.[0]?.shots?.on /
                    player?.statistics?.[0]?.shots?.total) *
                  100
                ).toFixed(2) + "%"}
              </td>
              <td>{player?.statistics?.[0]?.passes?.accuracy + "%"}</td>
              <td>
                {(
                  (player?.statistics?.[0]?.dribbles?.success /
                    player?.statistics?.[0]?.dribbles?.attempts) *
                  100
                ).toFixed(2) + "%"}
              </td>
              <td>{player?.statistics?.[0]?.games?.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerStandings;
