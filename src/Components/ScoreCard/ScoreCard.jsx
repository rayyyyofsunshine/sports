import React from "react";
import _ from "lodash";
import { useNavigate } from "react-router";

export default function ScoreCard({ data, id }) {
  const navigate = useNavigate();
  console.log(data);
  let inningsData =
    data?.statistics?.innings?.[0]?.batting_team === id
      ? data?.statistics?.innings?.[0]
      : data?.statistics?.innings?.[1];

  function dismissalType(dismissalId, data) {
    if (dismissalId === 1) {
      return `b ${data?.wicketBowlerName}`;
    } else if (dismissalId === 2) {
      return `lbw b ${data?.wicketBowlerName}`;
    } else if (dismissalId === 3) {
      return `c ${data?.wicketCatchName} b ${data?.wicketBowlerName}`;
    } else if (dismissalId === 4) {
      return `b ${data?.wicketCatchName}`;
    } else if (dismissalId === 5) {
      return `run out (${data?.wicketCatchName})`;
    } else if (dismissalId === 6) {
      return `c & b ${data?.wicketCatchName}`;
    }
  }

  return (
    <div className="scorecard-container">
      <div className="scorecard-container__batbowl--wrapper">
        <table>
          <thead>
            <tr>
              <td>Batting</td>
              <td>R</td>
              <td>B</td>
              <td>4s</td>
              <td>6s</td>
              <td>S/R</td>
            </tr>
          </thead>
          <tbody>
            {data?.battingLine
              ?.filter((player) => player?.wicketTypeId !== 9)
              .map((player, index) => (
                <tr key={index}>
                  <td>
                    <div className="player--info">
                      <p
                        onClick={() =>
                          navigate(`/cricket/player/${player?.player?.id}`)
                        }
                      >
                        {player?.player?.name}{" "}
                        {player?.wicketTypeId === 10 && <sup>*</sup>}
                      </p>
                      <span>
                        {player?.wicketTypeId !== 8
                          ? dismissalType(player?.wicketTypeId, player)
                          : "not out"}
                      </span>
                    </div>
                  </td>
                  <td>{player?.score}</td>
                  <td>{player?.balls}</td>
                  <td>{player?.s4}</td>
                  <td>{player?.s6}</td>
                  <td>{((player?.score / player?.balls) * 100).toFixed(2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="scorecard-container__contents--wrapper">
        <div className="container--extra">
          <p>Extras</p>
          <p>
            {data?.extra}{" "}
            {data?.extra > 0 && (
              <span style={{ marginLeft: "0.15em" }}>
                (
                {data?.noBall > 0 && (
                  <span className="extras">{data.noBall} NB</span>
                )}
                {data?.legBye > 0 && (
                  <span className="extras">{data?.legBye} LB</span>
                )}
                {data?.wide > 0 && (
                  <span className="extras">{data?.wide} W</span>
                )}
                {data?.bye > 0 && <span className="extras">{data?.bye} B</span>}
                )
              </span>
            )}
          </p>
        </div>
        <div className="container--extra">
          <p>Toal Runs</p>
          <p>
            {data?.score}{" "}
            <span style={{ marginLeft: "0.15em" }}>
              ({data?.wickets}{" "}
              {`${
                data?.wickets > 1 &&
                inningsData?.teams?.[1]?.statistics?.bowling?.wickets !== 0
                  ? "wkts"
                  : "wkt"
              }`}
              , {data?.overs} ov)
            </span>
          </p>
        </div>
      </div>
      {data?.battingLine?.filter((player) => player?.wicketTypeId === 9)
        .length > 0 && (
        <div className="scorecard-container__yet-to-bat--wrapper">
          <p>Yet to bat</p>
          <div className="players--left">
            {data?.battingLine
              ?.filter((player) => player?.wicketTypeId === 9)
              .map((player, index) => (
                <span
                  onClick={() =>
                    navigate(`cricket/player/${player?.player?.id}`)
                  }
                  key={index}
                >
                  {" "}
                  {player?.player?.name}
                </span>
              ))}
          </div>
        </div>
      )}
      {data?.timeline?.find((item) => item?.type === "ball") && (
        <div className="scorecard-container__fall-of-wickets--wrapper">
          <p>Fall of wickets</p>
          <div className="fall-of-wickets">
            {_.groupBy(data?.timeline, "type")
              ?.wicket?.filter(
                (wicket) => wicket.inning === inningsData?.number
              )
              .map((wicket, index) => (
                <p key={index}>
                  {wicket?.display_score}{" "}
                  <span>
                    (
                    {wicket?.dismissal_params?.player?.name
                      .split(",")[1]
                      .charAt(1)
                      .toUpperCase()}
                    . {wicket?.dismissal_params?.player?.name.split(",")[0]},{" "}
                    {wicket?.display_overs})
                  </span>{" "}
                </p>
              ))}
          </div>
        </div>
      )}
      <div className="scorecard-container__batbowl--wrapper">
        <table>
          <thead>
            <tr>
              <td>Bowling</td>
              <td>O</td>
              <td>M</td>
              <td>R</td>
              <td>W</td>
              <td>Econ</td>
            </tr>
          </thead>
          <tbody>
            {data?.bowlingLine?.map((player, index) => (
              <tr key={index}>
                <td>
                  {" "}
                  <div className="player--info">
                    <p
                      onClick={() =>
                        navigate(`cricket/player/${player?.player?.id}`)
                      }
                    >
                      {player?.player?.name}
                    </p>
                  </div>
                </td>
                <td>{player?.over}</td>
                <td>{player?.maiden}</td>
                <td>{player?.run}</td>
                <td>{player?.wicket}</td>
                <td>{(player?.run / player?.over).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
