import React from "react";
import ThreeLineFormation from "./ThreeLineFormation/ThreeLineFormation";
import FourLineFormation from "./FourLineFormation/FourLineFormation";
import field from "../../Assets/lineup-1.jpg";
import yCard from "../../Assets/yellow-card.png";
import rCard from "../../Assets/red-card.png";
import { Link } from "react-router-dom";

export default function LineUp({ data, events }) {
  return (
    <div>
      {data[0].formation && data[1].formation && (
        <div className="lineup-container">
          <div className="home-team-formation-container">
            <Link className="link" to={`/football/team/${data?.[0]?.team?.id}`}>
              <div className="team--info">
                <img src={data[0].team.logo} alt="" />
                <h4>{data[0].team.name}</h4>
              </div>
            </Link>
            <div className="formation--info">
              <p>{data[0].formation}</p>
            </div>
          </div>
          <img className="pitch-img" src={field} alt="lineup"></img>
          <div className="team-one">
            {data[0].formation.split("-").length === 3 ? (
              <ThreeLineFormation events={events} data={data[0]} />
            ) : (
              <FourLineFormation events={events} data={data[0]} />
            )}
          </div>
          <div className="team-two">
            {data[1].formation.split("-").length === 3 ? (
              <ThreeLineFormation events={events} data={data[1]} />
            ) : (
              <FourLineFormation events={events} data={data[1]} />
            )}
          </div>
          <div className="away-team-formation-container">
            <Link className="link" to={`/football/team/${data?.[1]?.team?.id}`}>
              <div className="team--info">
                <img src={data[1].team.logo} alt="" />
                <h4>{data[1].team.name}</h4>
              </div>
            </Link>
            <div className="formation--info">
              <p>{data[1].formation}</p>
            </div>
          </div>
        </div>
      )}
      {!(data[0].formation && data[1].formation) && (
        <div className="lineup-container--alt">
          <div className="lineup-container--alt__header">
            <Link className="link" to={`/football/team/${data?.[0]?.team?.id}`}>
              <div className="home-team--img">
                <img src={data[0].team.logo} alt="" />
              </div>
            </Link>
            <h4>Start XI</h4>
            <Link className="link" to={`/football/team/${data?.[1]?.team?.id}`}>
              <div className="away-team--img">
                <img src={data[1].team.logo} alt="" />
              </div>
            </Link>
          </div>
          <div className="lineup-container--alt__body">
            <div className="home-team--lineup">
              {data[0].startXI.map((player, index) => (
                <div key={index} className="player">
                  <p className="player--number">{player.player.number}</p>
                  <p>{player.player.name}</p>
                  {events
                    .filter((event) => event.player.id === player.player.id)
                    .map((item, index) => (
                      <span key={index}>
                        {item.type === "subst" && (
                          <i className="fas fa-arrow-down"></i>
                        )}
                      </span>
                    ))}
                  {events
                    .filter((event) => event.player.id === player.player.id)
                    .map((item, index) => (
                      <span key={index}>
                        {item.type === "Card" && (
                          <img
                            src={item.detail === "Yellow Card" ? yCard : rCard}
                            alt=""
                          />
                        )}
                        {item.type === "Goal" &&
                          item.comments === "null" &&
                          item.detail !== "Own Goal" && (
                            <i className="fas fa-futbol"></i>
                          )}
                        {item.type === "Goal" && item.detail === "Own Goal" && (
                          <i
                            style={{ color: "red" }}
                            className="fas fa-futbol"
                          ></i>
                        )}
                      </span>
                    ))}
                </div>
              ))}
            </div>
            <div className="away-team--lineup">
              {data[1].startXI.map((player, index) => (
                <div key={index} className="player">
                  {events
                    .filter((event) => event.player.id === player.player.id)
                    .map((item, index) => (
                      <span key={index}>
                        {item.type === "Goal" &&
                          item.comments === "null" &&
                          item.detail !== "Own Goal" && (
                            <i className="fas fa-futbol"></i>
                          )}
                        {item.type === "Goal" && item.detail === "Own Goal" && (
                          <i
                            style={{ color: "red" }}
                            className="fas fa-futbol"
                          ></i>
                        )}
                        {item.type === "Card" && (
                          <img
                            src={item.detail === "Yellow Card" ? yCard : rCard}
                            alt=""
                          />
                        )}
                      </span>
                    ))}
                  {events
                    .filter((event) => event.player.id === player.player.id)
                    .map((item, index) => (
                      <span key={index}>
                        {item.type === "subst" && (
                          <i className="fas fa-arrow-down"></i>
                        )}
                      </span>
                    ))}
                  <p>{player.player.name}</p>
                  <p className="player--number">{player.player.number}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="substitutes-container">
        <div className="substitutes-container__header">
          <Link className="link" to={`/football/team/${data?.[0]?.team?.id}`}>
            <div className="home-team--img">
              <img src={data[0].team.logo} alt="" />
            </div>
          </Link>
          <h4>Substitutes</h4>
          <Link className="link" to={`/football/team/${data?.[1]?.team?.id}`}>
            <div className="away-team--img">
              <img src={data[1].team.logo} alt="" />
            </div>
          </Link>
        </div>
        <div className="substitutes-container__body">
          <div className="home-team--subst">
            {data[0].substitutes.map((subst, index) => (
              <div key={index} className="player">
                <p className="player--number">{subst.player.number}</p>
                <Link
                  className="link"
                  to={`/football/player/${subst?.player?.id}`}
                >
                  {subst.player.name}
                </Link>
                {events
                  .filter((event) => event.assist.id === subst.player.id)
                  .map((item, index) => (
                    <span key={index}>
                      {item.type === "subst" && (
                        <i className="fas fa-arrow-up"></i>
                      )}
                    </span>
                  ))}
                {events
                  .filter((event) => event.player.id === subst.player.id)
                  .map((item, index) => (
                    <span key={index}>
                      {item.type === "Card" && (
                        <img
                          src={item.detail === "Yellow Card" ? yCard : rCard}
                          alt=""
                        />
                      )}
                      {item.type === "Goal" && item.detail !== "Own Goal" && (
                        <i className="fas fa-futbol"></i>
                      )}
                      {item.type === "Goal" && item.detail === "Own Goal" && (
                        <i
                          style={{ color: "red" }}
                          className="fas fa-futbol"
                        ></i>
                      )}
                    </span>
                  ))}
              </div>
            ))}
          </div>
          <div className="away-team--subst">
            {data[1].substitutes.map((subst, index) => (
              <div key={index} className="player">
                {events
                  .filter((event) => event.player.id === subst.player.id)
                  .map((item, index) => (
                    <span key={index}>
                      {item.type === "Goal" && item.detail !== "Own Goal" && (
                        <i className="fas fa-futbol"></i>
                      )}
                      {item.type === "Goal" && item.detail === "Own Goal" && (
                        <i
                          style={{ color: "red" }}
                          className="fas fa-futbol"
                        ></i>
                      )}
                      {item.type === "Card" && (
                        <img
                          src={item.detail === "Yellow Card" ? yCard : rCard}
                          alt=""
                        />
                      )}
                    </span>
                  ))}
                {events
                  .filter((event) => event.assist.id === subst.player.id)
                  .map((item, index) => (
                    <span key={index}>
                      {item.type === "subst" && (
                        <i className="fas fa-arrow-up"></i>
                      )}
                    </span>
                  ))}
                <Link
                  className="link"
                  to={`/football/player/${subst?.player?.id}`}
                >
                  {subst.player.name}
                </Link>
                <p className="player--number">{subst.player.number}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="manager-container">
        <div className="manager-container__header">
          <Link className="link" to={`/football/team/${data?.[0]?.team?.id}`}>
            <div className="home-team--img">
              <img src={data[0].team.logo} alt="" />
            </div>
          </Link>
          <h4>Manager</h4>
          <Link className="link" to={`/football/team/${data?.[1]?.team?.id}`}>
            <div className="away-team--img">
              <img src={data[1].team.logo} alt="" />
            </div>
          </Link>
        </div>
        <div className="manager-container__body">
          <div className="home-team--manager">
            <p>{data[0].coach.name}</p>
          </div>
          <div className="away-team--manager">
            <p>{data[1].coach.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
