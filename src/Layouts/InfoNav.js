import React from "react";
import { flagTournaments } from "../Helpers/Utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUser } from "@fortawesome/free-regular-svg-icons";
import { faTable } from "@fortawesome/free-solid-svg-icons";

export default function InfoNav({ type, data, setTab, tab, sport }) {
  function renderImage(path) {
    try {
      return sport === "cricket"
        ? require(`../Assets/Cricket Teams/${path}.png`)
        : require(`../Assets/A-Football Teams/${path}.gif`);
    } catch (err) {
      return "https://www.seekpng.com/png/small/28-289657_espn-soccer-team-logo-default.png";
    }
  }

  return (
    <div className="info-container">
      <div className="info-container__header"></div>
      <div className="info-container__body">
        <img
          src={
            sport !== "cricket" && sport !== "american-football"
              ? data?.league?.logo || data?.logo
              : type === "team"
              ? renderImage(data?.name)
              : flagTournaments?.[data?.category?.flag]
          }
          alt={data?.league?.name || data?.name + "-logo"}
        />
        <p>
          {sport !== "cricket" && sport !== "american-football"
            ? data?.country?.name || data?.country
            : data?.category?.name}
        </p>
        <h2>{data?.league?.name || data?.name || data?.competition?.name}</h2>
      </div>
      {window.innerWidth < 1024 ? (
        <div className="info-container__footer--mobile">
          <p
            className={`tab ${tab === "Fixtures" && "tab--active"}`}
            onClick={() => setTab("Fixtures")}
          >
            Fixtures
          </p>
          {(sport === "cricket" ||
            sport === "american-football" ||
            sport === "football") &&
            type === "team" && (
              <p
                className={`tab ${tab === "Players" && "tab--active"}`}
                onClick={() => setTab("Players")}
              >
                Players
              </p>
            )}
          {sport !== "cricket" &&
            sport !== "american-football" &&
            type === "team" && (
              <p
                className={`tab ${tab === "Stats" && "tab--active"}`}
                onClick={() => setTab("Stats")}
              >
                Statistics
              </p>
            )}
          {type !== "team" && (
            <p
              className={`tab ${tab === "Standings" && "tab--active"}`}
              onClick={() => setTab("Standings")}
            >
              Standings
            </p>
          )}
        </div>
      ) : (
        <div className="info-container__footer">
          <div
            onClick={() => setTab("Fixtures")}
            className={
              tab === "Fixtures"
                ? "info-container__footer__tab tab--active"
                : "info-container__footer__tab"
            }
          >
            <FontAwesomeIcon className="icon" icon={faCalendar} />
            <p>Fixtures</p>
          </div>
          {(sport === "cricket" ||
            sport === "american-football" ||
            sport === "football") &&
            type === "team" && (
              <div
                onClick={() => setTab("Players")}
                className={
                  tab === "Players"
                    ? "info-container__footer__tab tab--active"
                    : "info-container__footer__tab"
                }
              >
                <FontAwesomeIcon className="icon" icon={faUser} />
                <p>Players</p>
              </div>
            )}
          {sport !== "cricket" &&
            sport !== "american-football" &&
            type === "team" && (
              <div
                onClick={() => setTab("Stats")}
                className={
                  tab === "Stats"
                    ? "info-container__footer__tab tab--active"
                    : "info-container__footer__tab"
                }
              >
                <FontAwesomeIcon className="icon" icon={faTable} />
                <p>Statistics</p>
              </div>
            )}
          {type !== "team" && (
            <div
              onClick={() => setTab("Standings")}
              className={
                tab === "Standings"
                  ? "info-container__footer__tab tab--active"
                  : "info-container__footer__tab"
              }
            >
              <FontAwesomeIcon className="icon" icon={faTable} />
              <p>Standings</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
