import moment from "moment/moment";
import React, { useState } from "react";
import { setPoints } from "../../Helpers/Utilities";
import yCard from "../../Assets/yellow-card.png";
import rCard from "../../Assets/red-card.png";
import playerPhoto from "../../Assets/profile-picture.png";
import { Link } from "react-router-dom";

export default function PlayByPlay({ data, fixtureData, sport, lineups }) {
  let chunkIndex = 0;
  const [periodWiseIndex, setPeriodWiseIndex] = useState(0);

  const periodWiseData = data?.incidents?.reduce((resultArray, item) => {
    if (item?.incidentType === "period") {
      if (!resultArray[chunkIndex + 1]) {
        resultArray[chunkIndex + 1] = [];
      }
      chunkIndex++;
    } else {
      resultArray[chunkIndex].push(item);
    }

    return resultArray;
  }, []);

  const playerImage = (team, player) => {
    let id =
      team === fixtureData?.players?.[0]?.team?.id
        ? fixtureData?.players?.[0]?.players?.find(
            (p) => p?.player?.id === player
          )
        : fixtureData?.players?.[1]?.players?.find(
            (p) => p?.player?.id === player
          );

    return id === undefined ? playerPhoto : id?.player?.photo;
  };

  function renderImage(path) {
    try {
      return require(`../../Assets/A-Football Teams/${path}.gif`);
    } catch (err) {
      return "https://www.seekpng.com/png/small/28-289657_espn-soccer-team-logo-default.png";
    }
  }

  return (
    <div className="plays-container__wrapper">
      <div className="plays-container__wrapper--filter">
        {sport !== "football" &&
          periodWiseData
            ?.filter((item) => Array.isArray(item))
            ?.map((_, index) => (
              <p
                key={index}
                onClick={() => {
                  setPeriodWiseIndex(index);
                }}
                className={periodWiseIndex === index && "active"}
              >
                {sport !== "basketball"
                  ? moment.localeData().ordinal(index + 1)
                  : `Q${index + 1}`}
              </p>
            ))}
      </div>
      <div className="plays-container__wrapper--contents">
        <div className="plays-table">
          <table>
            <thead>
              <tr>
                <td>
                  <Link
                    className="link"
                    to={`/${sport}/team/${
                      fixtureData?.teams?.home?.id ?? fixtureData?.homeTeam?.id
                    }`}
                  >
                    <div
                      style={{ justifyContent: "flex-start" }}
                      className="team--info"
                    >
                      <img
                        src={
                          sport === "american-football"
                            ? renderImage(fixtureData?.homeTeam?.name)
                            : fixtureData?.teams?.home?.logo
                        }
                        alt=""
                      />
                      <h4>
                        {fixtureData?.teams?.home?.name ||
                          fixtureData?.homeTeam?.name}
                      </h4>
                    </div>
                  </Link>
                </td>
                <td></td>
                <td>
                  <Link
                    className="link"
                    to={`/${sport}/team/${
                      fixtureData?.teams?.away?.id ?? fixtureData?.awayTeam?.id
                    }`}
                  >
                    <div
                      style={{ justifyContent: "flex-end" }}
                      className="team--info"
                    >
                      <h4>
                        {fixtureData?.teams?.away?.name ||
                          fixtureData?.awayTeam?.name}
                      </h4>
                      <img
                        src={
                          sport === "american-football"
                            ? renderImage(fixtureData?.awayTeam?.name)
                            : fixtureData?.teams?.away?.logo
                        }
                        alt=""
                      />
                    </div>
                  </Link>
                </td>
              </tr>
            </thead>
            <tbody>
              {sport !== "football"
                ? periodWiseData
                    ?.reverse()
                    ?.[periodWiseIndex]?.filter(
                      (data) => data?.incidentType !== "injuryTime"
                    )
                    ?.map((data) => (
                      <tr key={data?.id || Math.random()}>
                        <td>
                          {lineups?.home?.players?.find(
                            (player) => player?.player?.id === data?.player?.id
                          ) && (
                            <div
                              style={{ justifyContent: "flex-end" }}
                              className="detailed--info"
                            >
                              <p>
                                <Link
                                  className="link"
                                  to={`/${sport}/player/${
                                    data?.player?.id ?? data?.id
                                  }`}
                                >
                                  {data?.player?.name || data?.playerName}
                                </Link>
                                {" - " +
                                  (sport === "hockey" ||
                                  sport === "american-football"
                                    ? "Goal"
                                    : setPoints(data?.incidentClass))}
                              </p>
                              <img
                                src={
                                  sport === "american-football"
                                    ? renderImage(fixtureData?.homeTeam?.name)
                                    : fixtureData?.teams?.home?.logo
                                }
                                alt=""
                              />
                            </div>
                          )}
                        </td>
                        <td className="time" style={{ textAlign: "center" }}>
                          {data?.incidentType === "goal" && (
                            <p className="play--score">
                              <span
                                style={{
                                  color:
                                    lineups?.home?.players?.find(
                                      (player) =>
                                        player?.player?.id === data?.player?.id
                                    ) && "#333",
                                }}
                              >
                                {data?.homeScore}
                              </span>{" "}
                              -
                              <span
                                style={{
                                  color:
                                    lineups?.away?.players?.find(
                                      (player) =>
                                        player?.player?.id === data?.player?.id
                                    ) && "#333",
                                }}
                              >
                                {data?.awayScore}
                              </span>
                            </p>
                          )}
                          <p>{data?.time + " : 00"}</p>
                          {sport === "basketball" && (
                            <i className="fas fa-basketball-ball"></i>
                          )}
                          {(sport === "rugby" ||
                            sport === "american-football") && (
                            <i className="fas fa-football-ball"></i>
                          )}
                        </td>
                        <td>
                          {lineups?.away?.players?.find(
                            (player) => player?.player?.id === data?.player?.id
                          ) && (
                            <div
                              style={{ justifyContent: "flex-start" }}
                              className="detailed--info"
                            >
                              <img
                                src={
                                  sport === "american-football"
                                    ? renderImage(fixtureData?.awayTeam?.name)
                                    : fixtureData?.teams?.away?.logo
                                }
                                alt=""
                              />
                              <p>
                                <Link
                                  className="link"
                                  to={`/${sport}/player/${
                                    data?.player?.id ?? data?.playerId
                                  }`}
                                >
                                  {data?.player?.name || data?.playerName}
                                </Link>
                                {" - " +
                                  (sport === "hockey" ||
                                  sport === "american-football"
                                    ? "Goal"
                                    : setPoints(data?.incidentClass))}
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                : [...data]?.reverse()?.map((item, i) => (
                    <tr key={i}>
                      <td>
                        {fixtureData?.teams?.home?.id === item?.team?.id && (
                          <div
                            style={{ justifyContent: "flex-end" }}
                            className="detailed--info"
                          >
                            {item?.type === "subst" ? (
                              <div
                                style={{
                                  justifySelf: "flex-end",
                                }}
                                className="subst--info"
                              >
                                <div
                                  style={{ justifyContent: "flex-end" }}
                                  className="subst--in"
                                >
                                  <p>
                                    Subst in -
                                    <Link
                                      className="link"
                                      to={`/${sport}/player/${item?.assist?.id}`}
                                    >
                                      {item?.assist?.name}
                                    </Link>
                                  </p>
                                  <Link
                                    to={`/${sport}/player/${item?.assist?.id}`}
                                  >
                                    <img
                                      className="player-photo"
                                      src={playerImage(
                                        item?.team?.id,
                                        item?.assist?.id
                                      )}
                                      alt="player-img"
                                    />
                                  </Link>
                                </div>
                                <div
                                  style={{ justifyContent: "flex-end" }}
                                  className="subst--out"
                                >
                                  <p>
                                    Subst Out -
                                    <Link
                                      className="link"
                                      to={`/${sport}/player/${item?.player?.id}`}
                                    >
                                      {item?.player?.name}
                                    </Link>
                                  </p>
                                  <Link
                                    to={`/${sport}/player/${item?.player?.id}`}
                                  >
                                    <img
                                      className="player-photo"
                                      src={playerImage(
                                        item?.team?.id,
                                        item?.player?.id
                                      )}
                                      alt="player-img"
                                    />
                                  </Link>
                                </div>
                              </div>
                            ) : (
                              <div className="stats--info">
                                <p>
                                  {item?.detail + " - "}
                                  {
                                    <Link
                                      className="link"
                                      to={`/${sport}/player/${item?.player?.id}`}
                                    >
                                      {item?.player?.name}
                                    </Link>
                                  }
                                </p>
                                <Link
                                  to={`/${sport}/player/${item?.player?.id}`}
                                >
                                  <img
                                    className="player-photo"
                                    src={playerImage(
                                      item?.team?.id,
                                      item?.player?.id
                                    )}
                                    alt="player-img"
                                  />
                                </Link>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }} className="time">
                        {item?.type === "Goal" && (
                          <p className="play--score">
                            <span
                              style={{
                                color:
                                  item?.team?.id ===
                                    fixtureData?.fixture?.teams?.home?.id &&
                                  "#333",
                              }}
                            >
                              {item?.homeScore}
                            </span>{" "}
                            -
                            <span
                              style={{
                                color:
                                  item?.team?.id ===
                                    fixtureData?.fixture?.teams?.away?.id &&
                                  "#333",
                              }}
                            >
                              {item?.awayScore}
                            </span>
                          </p>
                        )}
                        <p>
                          {item?.time?.elapsed +
                            `${
                              item?.time?.extra > 0
                                ? ": 0" + item?.time?.extra
                                : ": 00"
                            }`}
                        </p>
                        {item?.type === "subst" && (
                          <div className="subst--icon">
                            <i
                              style={{
                                color: "#33a132",
                                fontSize: "0.875rem",
                                marginBottom: "5px",
                              }}
                              className="fas fa-long-arrow-alt-up"
                            ></i>
                            <i
                              style={{
                                color: "#d31129",
                                fontSize: "0.875rem",
                                marginTop: "5px",
                              }}
                              className="fas fa-long-arrow-alt-down"
                            ></i>
                          </div>
                        )}
                        {item?.detail === "Penalty" ? (
                          <i className="fas fa-futbol">
                            <span>P</span>
                          </i>
                        ) : item?.detail === "Own Goal" ? (
                          <i
                            style={{ color: "red" }}
                            className="fas fa-futbol"
                          ></i>
                        ) : (
                          item?.type === "Goal" && (
                            <i className="fas fa-futbol"></i>
                          )
                        )}
                        {item?.type === "Card" && (
                          <img
                            style={{
                              marginTop: "0.25em",
                              transform: "rotate(-30deg)",
                              width: "11.5px",
                              height: "16.5px",
                              boxShadow: "0 0 5px -1px rgba(0, 0, 0, 0.2)",
                            }}
                            src={item?.detail === "Yellow Card" ? yCard : rCard}
                            alt="card"
                          />
                        )}
                        {item?.type === "Var" && (
                          <i
                            style={{ color: "rgba(0,0,0, 0.75)" }}
                            className="fas fa-tv"
                          ></i>
                        )}
                      </td>
                      <td>
                        {fixtureData?.teams?.away?.id === item?.team?.id && (
                          <div
                            style={{
                              justifyContent: "flex-start",
                            }}
                            className="detailed--info"
                          >
                            {item?.type === "subst" ? (
                              <div
                                style={{
                                  justifyItems: "flex-start",
                                }}
                                className="subst--info"
                              >
                                <div
                                  style={{ justifyContent: "flex-start" }}
                                  className="subst--in"
                                >
                                  <Link
                                    to={`/${sport}/player/${item?.assist?.id}`}
                                  >
                                    <img
                                      className="player-photo"
                                      src={playerImage(
                                        item?.team?.id,
                                        item?.assist?.id
                                      )}
                                      alt="player-img"
                                    />
                                  </Link>
                                  <p>
                                    <Link
                                      className="link"
                                      to={`/${sport}/player/${item?.assist?.id}`}
                                    >
                                      {item?.assist?.name}
                                    </Link>{" "}
                                    - Subst in
                                  </p>
                                </div>
                                <div
                                  style={{ justifyContent: "flex-start" }}
                                  className="subst--out"
                                >
                                  <Link
                                    to={`/${sport}/player/${item?.player?.id}`}
                                  >
                                    <img
                                      className="player-photo"
                                      src={playerImage(
                                        item?.team?.id,
                                        item?.player?.id
                                      )}
                                      alt="player-img"
                                    />
                                  </Link>
                                  <p>
                                    <Link
                                      className="link"
                                      to={`/${sport}/player/${item?.player?.id}`}
                                    >
                                      {item?.player?.name}
                                    </Link>{" "}
                                    - Subst Out
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="stats--info">
                                <Link
                                  to={`/${sport}/player/${item?.player?.id}`}
                                >
                                  <img
                                    className="player-photo"
                                    src={playerImage(
                                      item?.team?.id,
                                      item?.player?.id
                                    )}
                                    alt="player-img"
                                  />
                                </Link>
                                <p>
                                  {
                                    <Link
                                      className="link"
                                      to={`/${sport}/player/${item?.player?.id}`}
                                    >
                                      {item?.player?.name}
                                    </Link>
                                  }
                                  {" - " + item?.detail}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
