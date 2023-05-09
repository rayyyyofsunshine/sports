import React from "react";
import { Link } from "react-router-dom";

export default function StandingsTab({ data, sport }) {
  function renderImage(path) {
    try {
      return sport === "cricket"
        ? require(`../../Assets/Cricket Teams/${path}.png`)
        : require(`../../Assets/A-Football Teams/${path}.gif`);
    } catch (err) {
      return "https://www.seekpng.com/png/small/28-289657_espn-soccer-team-logo-default.png";
    }
  }

  return (
    <div className="standings">
      <table>
        <thead>
          <tr>
            <td>Pos</td>
            <td>Team</td>
            <td>P</td>
            <td>W</td>
            <td>L</td>
            <td>
              {sport === "football" || sport === "cricket" ? "D" : "W (in %)"}
            </td>

            {sport !== "football" &&
              sport !== "cricket" &&
              sport !== "american-football" && <td>L (in %)</td>}
            {sport !== "american-football" && (
              <td>
                {sport === "rugby" || sport === "football"
                  ? "GF"
                  : sport !== "cricket"
                  ? "PF"
                  : "No Results"}
              </td>
            )}
            {sport !== "american-football" && (
              <td>
                {sport === "rugby" || sport === "football"
                  ? "GA"
                  : sport !== "cricket"
                  ? "PA"
                  : "NRR"}
              </td>
            )}
            {sport !== "american-football" &&
              (sport === "rugby" ||
                sport === "hockey" ||
                sport === "cricket" ||
                sport === "football") && <td>Points</td>}
            {sport !== "cricket" && sport !== "american-football" && (
              <td>Form</td>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={`${index}-${item?.team?.id}`}>
              <td>{item?.position || item?.rank}</td>
              <td>
                <Link className="link" to={`/${sport}/team/${item?.team?.id}`}>
                  <div className="team">
                    <img
                      src={
                        sport === "cricket" || sport === "american-football"
                          ? renderImage(item?.team?.name)
                          : item.team?.logo
                      }
                      alt=""
                    />
                    <p>{item.team?.name}</p>
                  </div>
                </Link>
              </td>
              <td>
                {sport === "american-football"
                  ? item?.wins + item?.losses
                  : item?.games?.played || item?.all?.played || item?.matches}
              </td>
              <td>{item?.games?.win?.total || item?.all?.win || item?.wins}</td>
              <td>
                {item?.games?.lose?.total || item?.all?.lose || item?.losses}
              </td>

              <td>
                {sport === "american-football"
                  ? (item?.percentage * 100).toFixed(2)
                  : item?.games?.win?.percentage ||
                    item?.all?.draw ||
                    item?.draws}
              </td>

              {sport !== "football" &&
                sport !== "cricket" &&
                sport !== "american-football" && (
                  <td>{item?.games?.lose?.percentage}</td>
                )}
              {sport !== "american-football" && (
                <td>
                  {item?.points?.for ||
                    item?.goals?.for ||
                    item?.all?.goals?.for ||
                    item?.noResult}
                </td>
              )}
              {sport !== "american-football" && (
                <td>
                  {item?.points?.against ||
                    item?.goals?.against ||
                    item?.all?.goals?.against ||
                    item?.netRunRate}
                </td>
              )}
              {sport !== "american-football" &&
                (sport === "rugby" ||
                  sport === "hockey" ||
                  sport === "cricket" ||
                  sport === "football") && <td>{item?.points}</td>}
              {sport !== "cricket" && sport !== "american-football" && (
                <td className="form-box">
                  {item?.form
                    ?.split("")
                    .filter((_, index) => index < 5)
                    .map((i) => (
                      <div
                        key={i + Math.random() + Math.random()}
                        className={i}
                      ></div>
                    ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
