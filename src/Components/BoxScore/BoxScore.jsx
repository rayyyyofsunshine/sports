import React from "react";
import moment from "moment/moment";
import { Link } from "react-router-dom";

export default function BoxScore({ stats, sport }) {
  return (
    <div className="boxscore-container">
      <div className="boxscore-container__player--wrapper">
        {sport !== "american-football" && sport !== "hockey" && (
          <table>
            <thead>
              <tr>
                <td>{sport === "basketball" ? "Players" : "Batters"}</td>
                <td>{sport === "basketball" ? "Reb" : "AB"}</td>
                <td>{sport === "basketball" ? "Ast" : "R"}</td>
                <td>{sport === "basketball" ? "FG" : "H"}</td>
                <td>{sport === "basketball" ? "3PT" : "RBI"}</td>
                <td>{sport === "basketball" ? "FT" : "BB"}</td>
                <td>{sport === "basketball" ? "PF" : "SO"}</td>
                <td>{sport === "basketball" ? "Min" : "LOB"}</td>
                <td>{sport === "basketball" ? "Stl" : "Avg"}</td>
                {sport === "basketball" && <td>Blk</td>}
                {sport === "basketball" && <td>TO</td>}
                {sport === "basketball" && <td>Pts</td>}
              </tr>
            </thead>
            <tbody>
              {sport === "basketball"
                ? stats?.players.map((player, index) => (
                    <tr key={index}>
                      <td>
                        <div className="player--info">
                          <Link
                            className="link"
                            to={`/${sport}/player/${player?.player?.id}`}
                          >{`${player?.player?.name}`}</Link>
                        </div>
                      </td>
                      <td>{player?.statistics?.rebounds}</td>
                      <td>{player?.statistics?.assists}</td>
                      <td>
                        {player?.statistics?.fieldGoalsMade}/
                        {player?.statistics?.fieldGoalAttempts}
                      </td>
                      <td>
                        {player?.statistics?.threePointsMade}/
                        {player?.statistics?.threePointAttempts}
                      </td>
                      <td>
                        {player?.statistics?.freeThrowsMade}/
                        {player?.statistics?.freeThrowAttempts}
                      </td>
                      <td>{player?.statistics?.personalFouls}</td>
                      <td>
                        {moment
                          .utc(player?.statistics?.secondsPlayed * 1000)
                          ?.format("mm:ss")}
                      </td>
                      <td>
                        {player?.statistics?.steals ||
                          player?.statistics?.battingAverage}
                      </td>
                      <td>{player?.statistics?.blocks}</td>
                      <td>{player?.statistics?.turnovers}</td>
                      <td>{player?.statistics?.points}</td>
                    </tr>
                  ))
                : stats?.players
                    ?.filter((player) => player?.position !== "P")
                    ?.map((player, index) => (
                      <tr key={index}>
                        <td>
                          <div className="player--info">
                            <Link
                              className="link"
                              to={`/${sport}/player/${player?.player?.id}`}
                            >{`${player?.player?.name}`}</Link>
                          </div>
                        </td>
                        <td>{player?.statistics?.battingAtBats}</td>
                        <td>{player?.statistics?.battingRuns}</td>
                        <td>{player?.statistics?.battingHits}</td>
                        <td>{player?.statistics?.battingRbi}</td>
                        <td>{player?.statistics?.battingBaseOnBats}</td>
                        <td>{player?.statistics?.battingStrikeOuts}</td>
                        <td>{player?.statistics?.battingLeftOnBase}</td>
                        <td>{player?.statistics?.battingAverage}</td>
                      </tr>
                    ))}
            </tbody>
          </table>
        )}
        {sport === "baseball" && (
          <table>
            <thead>
              <tr>
                <td>Pitchers</td>
                <td>IP</td>
                <td>H</td>
                <td>R</td>
                <td>ER</td>
                <td>BB</td>
                <td>SO</td>
                <td>HR</td>
                <td>ERA</td>
              </tr>
            </thead>
            <tbody>
              {stats?.players
                ?.filter((player) => player?.position === "P")
                ?.map((player, index) => (
                  <tr key={index}>
                    <td>
                      <div className="player--info">
                        <Link
                          className=""
                          to={`/${sport}/player/${player?.player?.id}`}
                        >{`${player?.player?.name}`}</Link>
                      </div>
                    </td>
                    <td>{player?.statistics?.pitchingInningsPitched}</td>
                    <td>{player?.statistics?.pitchingHits}</td>
                    <td>{player?.statistics?.pitchingRuns}</td>
                    <td>{player?.statistics?.pitchingEarnedRuns}</td>
                    <td>{player?.statistics?.pitchingBaseOnBalls}</td>
                    <td>{player?.statistics?.pitchingStrikeOuts}</td>
                    <td>{player?.statistics?.pitchingHomeRuns}</td>
                    <td>{player?.statistics?.pitchingEarnedRunsAverage}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        {sport === "american-football" && (
          <table>
            <thead>
              <tr>
                <td>Receiving</td>
                <td>Rec</td>
                <td>Yds</td>
                <td>Avg</td>
                <td>TD</td>
              </tr>
            </thead>
            <tbody>
              {stats?.players
                ?.filter(
                  (player) =>
                    player?.position === "PR" ||
                    player?.position === "WR" ||
                    player?.position === "TE" ||
                    player?.position === "RB"
                )
                .map((player) => (
                  <tr key={player?.player?.id}>
                    <td>{player?.player?.name}</td>
                    <td>{player?.statistics?.receivingReceptions}</td>
                    <td>{player?.statistics?.receivingYards}</td>
                    <td>
                      {Math.round(
                        player?.statistics?.receivingYardsPerReception * 10
                      ) / 10}
                    </td>
                    <td>{player?.statistics?.receivingTouchdowns}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        {sport === "american-football" && (
          <table>
            <thead>
              <tr>
                <td>Rushing</td>
                <td>Car</td>
                <td>Yds</td>
                <td>Avg</td>
                <td>TD</td>
              </tr>
            </thead>
            <tbody>
              {stats?.players
                ?.filter(
                  (player) =>
                    player?.position === "QB" ||
                    player?.position === "OLB" ||
                    player?.position === "DE" ||
                    player?.position === "MLB"
                )
                .map((player) => (
                  <tr key={player?.player?.id}>
                    <td>{player?.player?.name}</td>
                    <td>{player?.statistics?.rushingAttempts}</td>
                    <td>{player?.statistics?.rushingYards}</td>
                    <td>
                      {Math.round(
                        player?.statistics?.rushingYardsPerAttempt * 10
                      ) / 10}
                    </td>
                    <td>{player?.statistics?.rushingTouchdowns}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        {sport === "american-football" && (
          <table style={{ marginTop: "2em" }}>
            <thead>
              <tr>
                <td>Defensive</td>
                <td>Tck/Ast</td>
                <td>Sack</td>
                <td>Int</td>
              </tr>
            </thead>
            <tbody>
              {stats?.players
                ?.filter(
                  (player) =>
                    player?.position === "DB" ||
                    player?.position === "DT" ||
                    player?.position === "DE" ||
                    player?.position === "NT" ||
                    player?.position === "OT" ||
                    player?.position === "LB" ||
                    player?.position === "MLB" ||
                    player?.position === "OLB" ||
                    player?.position === "SS" ||
                    player?.position === "FS" ||
                    player?.position === "CB" ||
                    player?.position === "SAF"
                )
                .map((player) => (
                  <tr key={player?.player?.id}>
                    <td>{player?.player?.name}</td>
                    <td>
                      {player?.statistics?.defensiveCombineTackles -
                        player?.statistics?.defensiveAssistTackles}{" "}
                      / {player?.statistics?.defensiveAssistTackles}
                    </td>
                    <td>{player?.statistics?.defensiveSacks}</td>
                    <td>{player?.statistics?.defensiveInterceptions}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        {sport === "american-football" && (
          <table style={{ marginTop: "2em" }}>
            <thead>
              <tr>
                <td>Punting</td>
                <td>No</td>
                <td>Yds</td>
                <td>Avg</td>
                <td>In20</td>
              </tr>
            </thead>
            <tbody>
              {stats?.players
                ?.filter((player) => player?.position === "P")
                .map((player) => (
                  <tr key={player?.player?.id}>
                    <td>{player?.player?.name}</td>
                    <td>{player?.statistics?.puntingTotal}</td>
                    <td>{player?.statistics?.puntingYards}</td>
                    <td>
                      {Math.round(
                        player?.statistics?.puntingYardsPerPuntAvg * 10
                      ) / 10}
                    </td>
                    <td>{player?.statistics?.puntingInside20}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        {sport === "american-football" && (
          <table style={{ marginTop: "2em" }}>
            <thead>
              <tr>
                <td>Kicking</td>
                <td>FG</td>
                <td>Pct</td>
                <td>Lng</td>
                <td>TD</td>
              </tr>
            </thead>
            <tbody>
              {stats?.players
                ?.filter((player) => player?.position === "K")
                .map((player) => (
                  <tr key={player?.player?.id}>
                    <td>{player?.player?.name}</td>
                    <td>
                      {player?.statistics?.kickingExtraMade /
                        player?.statistics?.kickingExtraAttempts}
                    </td>
                    <td>
                      {(
                        (player?.statistics?.kickingExtraMade /
                          player?.statistics?.kickingExtraAttempts) *
                        100
                      ).toFixed(1)}
                    </td>
                    <td>{player?.statistics?.kickReturnsLong}</td>
                    <td>{player?.statistics?.kickReturnsTouchdowns}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        {sport === "hockey" && (
          <table>
            <thead>
              <tr>
                <td>Player</td>
                <td>G</td>
                <td>A</td>
                <td>+/-</td>
                <td>S</td>
                <td>HIT</td>
                <td>BLK</td>
                <td>GVA</td>
                <td>TKA</td>
                <td>FO%</td>
                <td>PP</td>
                <td>SH</td>
              </tr>
            </thead>
            <tbody>
              {stats?.players?.map((player) => (
                <tr key={player?.player?.id}>
                  <td>{player?.player?.name ?? "-"}</td>
                  <td>{player?.statistics?.goals ?? "-"}</td>
                  <td>{player?.statistics?.assists ?? "-"}</td>
                  <td>{player?.statistics?.plusMinus ?? "-"}</td>
                  <td>{player?.statistics?.shots ?? "-"}</td>
                  <td>{player?.statistics?.hits ?? "-"}</td>
                  <td>{player?.statistics?.blocked ?? "-"}</td>
                  <td>{player?.statistics?.giveaways ?? "-"}</td>
                  <td>{player?.statistics?.takeaways ?? "-"}</td>
                  <td>
                    {player?.statistics?.faceOffWins !== undefined &&
                    player?.statistics?.faceOffWins !== 0
                      ? Math.round(
                          player?.statistics?.faceOffWins /
                            player?.statistics?.faceOffTaken
                        ) * 100
                      : "-"}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{`${
                    player?.statistics?.powerPlayAssists ?? ""
                  } - ${player?.statistics?.powerPlayGoals ?? ""}`}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{`${
                    player?.statistics?.shortHandedAssists ?? ""
                  } - ${player?.statistics?.shortHandedGoals ?? ""}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
