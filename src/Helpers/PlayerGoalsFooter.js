import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

export default function PlayerGoalsFooter({ fixture }) {
  let type = _.groupBy(fixture.events, "type");
  let goalType = _.groupBy(type.Goal, "detail");
  let ownGoalsPlayer = _.groupBy(goalType?.["Own Goal"], "player.name");
  let normalGoalsPlayer = _.groupBy(goalType?.["Normal Goal"], "player.name");
  let penaltyGoalsPlayer = _.groupBy(goalType?.["Penalty"], "player.name");
  let players = [];

  Object.entries(normalGoalsPlayer).map((item) =>
    item[1].map((temp) => players.push(temp))
  );

  Object.entries(ownGoalsPlayer).map((item) =>
    item[1].map((temp) => players.push(temp))
  );

  Object.entries(penaltyGoalsPlayer).map((item) =>
    item[1].map((temp) => players.push(temp))
  );

  console.log(_.groupBy(players, "player.name"));

  return (
    <div className="player-footer">
      <div className="player-footer--home">
        {Object.entries(_.groupBy(players, "player.name"))
          .filter((item) => item[1][0].team.id === fixture.teams.home.id)
          .map((item) =>
            item[1].length > 1 ? (
              <Link
                className="link"
                to={`/football/player/${item?.[1]?.[0]?.player?.id}`}
              >
                {item[1][0].player.name}
                {item[1].map((player, index) => (
                  <span className="time" key={index + 1000}>
                    {player.time.elapsed}{" "}
                    {player.time.extra !== null && "+" + player.time?.extra}'
                    {player.detail === "Penalty" && (
                      <span className="type-of-goal">(P)</span>
                    )}
                    {player.detail === "Own Goal" && (
                      <span className="type-of-goal">(OG)</span>
                    )}
                  </span>
                ))}
              </Link>
            ) : (
              <Link
                className="link"
                to={`/football/player/${item?.[1]?.[0]?.player?.id}`}
              >
                {item[1][0].player.name}
                <span className="time">
                  {item[1][0].time.elapsed}
                  {item[1][0].time.extra !== null &&
                    "+" + item[1][0].time?.extra}
                  '
                  {item[1][0].detail === "Penalty" && (
                    <span className="type-of-goal">(P)</span>
                  )}
                  {item[1][0].detail === "Own Goal" && (
                    <span className="type-of-goal">(OG)</span>
                  )}
                </span>
              </Link>
            )
          )}
      </div>
      <div className="player-footer--away">
        {Object.entries(_.groupBy(players, "player.name"))
          .filter((item) => item[1][0].team.id === fixture.teams.away.id)
          .map((item) =>
            item[1].length > 1 ? (
              <Link
                className="link"
                to={`/football/player/${item?.[1]?.[0]?.player?.id}`}
              >
                {item[1][0].player.name + " "}
                {item[1].map((player, index) => (
                  <span className="time" key={index + 1000}>
                    {player.time.elapsed}{" "}
                    {player.time.extra !== null && "+" + player.time?.extra}'
                    {player.detail === "Penalty" && (
                      <span className="type-of-goal">(P)</span>
                    )}
                    {player.detail === "Own Goal" && (
                      <span className="type-of-goal">(OG)</span>
                    )}
                  </span>
                ))}
              </Link>
            ) : (
              <Link
                className="link"
                to={`/football/player/${item?.[1]?.[0]?.player?.id}`}
              >
                {item[1][0].player.name + " "}
                <span className="time">
                  {item[1][0].time.elapsed}{" "}
                  {item[1][0].time.extra !== null &&
                    "+" + item[1][0].time?.extra}
                  '{" "}
                  {item[1][0].detail === "Penalty" && (
                    <span className="type-of-goal">(P)</span>
                  )}
                  {item[1][0].detail === "Own Goal" && (
                    <span className="type-of-goal">(OG)</span>
                  )}
                </span>
              </Link>
            )
          )}
      </div>
    </div>
  );
}
