import React from "react";
import { Link } from "react-router-dom";
import yCard from "../../../Assets/yellow-card.png";
import rCard from "../../../Assets/red-card.png";

export default function ThreeLineFormation({ data, events }) {
  console.log(events);
  return (
    <>
      <div className="goalkeeper">
        <Link
          className="link "
          to={`/football/player/${data.startXI[0].player.id}`}
        >
          <div className="circle">
            {data.startXI[0].player.number}
            <p className="player-name">
              {data.startXI[0].player.name.split(" ")[0].split("")[0] +
                ". " +
                data.startXI[0].player.name.split(" ")[
                  data.startXI[0].player.name.split(" ").length - 1
                ]}
            </p>
            {events
              .filter((temp) => temp.player.id === data.startXI[0].player.id)
              .map((type, index) => (
                <span
                  key={index}
                  className={
                    type.type === "Goal"
                      ? "goal"
                      : type.type === "Card"
                      ? "card"
                      : type.type === "subst" && "substitute"
                  }
                >
                  {type.type === "Goal" &&
                    type.comments === null &&
                    type.detail !== "Own Goal" && (
                      <i className="fas fa-futbol"></i>
                    )}
                  {type.type === "Goal" && type.detail === "Own Goal" && (
                    <i style={{ color: "red" }} className="fas fa-futbol"></i>
                  )}
                  {type.detail === "Yellow Card" && <img src={yCard} alt="" />}
                  {type.detail === "Red Card" && <img src={rCard} alt="" />}
                  {type.type === "subst" && (
                    <i className="fas fa-arrow-circle-down"></i>
                  )}
                </span>
              ))}
          </div>
        </Link>
      </div>
      <div className="defenders-threeLine">
        {data.startXI
          .filter(
            (_, index) =>
              index > 0 && index < parseInt(data.formation.split("-")[0]) + 1
          )
          .map((item, index) => (
            <Link to={`/football/player/${item?.player?.id}`} className="link">
              <div key={index} className="circle">
                {item.player.number}
                <p className="player-name">
                  {item.player.name.split(" ")[0].split("")[0] +
                    ". " +
                    item.player.name.split(" ")[
                      item.player.name.split(" ").length - 1
                    ]}
                </p>
                {events
                  .filter((data) => data.player.id === item.player.id)
                  .map((type, index) => (
                    <span
                      key={index}
                      className={
                        type.type === "Goal"
                          ? "goal"
                          : type.type === "Card"
                          ? "card"
                          : type.type === "subst" && "substitute"
                      }
                    >
                      {type.type === "Goal" &&
                        type.comments === null &&
                        type.detail !== "Own Goal" && (
                          <i className="fas fa-futbol"></i>
                        )}
                      {type.type === "Goal" && type.detail === "Own Goal" && (
                        <i
                          style={{ color: "red" }}
                          className="fas fa-futbol"
                        ></i>
                      )}
                      {type.detail === "Yellow Card" && (
                        <img src={yCard} alt="" />
                      )}
                      {type.detail === "Red Card" && <img src={rCard} alt="" />}
                      {type.type === "subst" && (
                        <i className="fas fa-arrow-circle-down"></i>
                      )}
                    </span>
                  ))}
              </div>
            </Link>
          ))}
      </div>
      <div className="midfielders-threeLine">
        {data.startXI
          .filter(
            (_, index) =>
              index > parseInt(data.formation.split("-")[0]) &&
              index <
                parseInt(data.formation.split("-")[0]) +
                  parseInt(data.formation.split("-")[1]) +
                  1
          )
          .map((item, index) => (
            <Link to={`/football/player/${item.player.id}`} className="link">
              <div key={index} className="circle">
                {item.player.number}
                <p className="player-name">
                  {item.player.name.split(" ")[0].split("")[0] +
                    ". " +
                    item.player.name.split(" ")[
                      item.player.name.split(" ").length - 1
                    ]}
                </p>
                {events
                  .filter((data) => data.player.id === item.player.id)
                  .map((type, index) => (
                    <span
                      key={index}
                      className={
                        type.type === "Goal"
                          ? "goal"
                          : type.type === "Card"
                          ? "card"
                          : type.type === "subst" && "substitute"
                      }
                    >
                      {type.type === "Goal" &&
                        type.comments === null &&
                        type.detail !== "Own Goal" && (
                          <i classname="fas fa-futbol"></i>
                        )}
                      {type.type === "Goal" && type.detail === "Own Goal" && (
                        <i
                          style={{ color: "red" }}
                          className="fas fa-futbol"
                        ></i>
                      )}
                      {type.detail === "Yellow Card" && (
                        <img src={yCard} alt="" />
                      )}
                      {type.detail === "Red Card" && <img src={rCard} alt="" />}
                      {type.type === "subst" && (
                        <i className="fas fa-arrow-circle-down"></i>
                      )}
                    </span>
                  ))}
              </div>
            </Link>
          ))}
      </div>
      <div className="strikers-threeLine">
        {data.startXI
          .filter(
            (_, index) =>
              index >
                parseInt(data.formation.split("-")[0]) +
                  parseInt(data.formation.split("-")[1]) && index < 11
          )
          .map((item, index) => (
            <Link to={`/football/player/${item.player.id}`} className="link">
              <div key={index} className="circle">
                {item.player.number}
                <p className="player-name">
                  {item.player.name.split(" ")[0].split("")[0] +
                    ". " +
                    item.player.name.split(" ")[
                      item.player.name.split(" ").length - 1
                    ]}
                </p>
                {events
                  .filter((data) => data.player.id === item.player.id)
                  .map((type, index) => (
                    <span
                      key={index}
                      className={
                        type.type === "Goal"
                          ? "goal"
                          : type.type === "Card"
                          ? "card"
                          : type.type === "subst" && "substitute"
                      }
                    >
                      {type.type === "Goal" &&
                        type.comments === null &&
                        type.detail !== "Own Goal" && (
                          <i className="fas fa-futbol"></i>
                        )}
                      {type.type === "Goal" && type.detail === "Own Goal" && (
                        <i
                          style={{ color: "red" }}
                          className="fas fa-futbol"
                        ></i>
                      )}
                      {type.detail === "Yellow Card" && (
                        <img src={yCard} alt="" />
                      )}
                      {type.detail === "Red Card" && <img src={rCard} alt="" />}
                      {type.type === "subst" && (
                        <i className="fas fa-arrow-circle-down"></i>
                      )}
                    </span>
                  ))}
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}
