import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import axios from "axios";
import { getFutPlayerSeasons, getFutPlayerStats } from "../../Api/FutRequest";
import { Link } from "react-router-dom";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFutbol } from "@fortawesome/free-solid-svg-icons";

export default function FutPlayerPage({ sport }) {
  const { id } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [seasonId, setSeasonId] = useState(0);

  const {
    data: playerStatsSeasons,
    isLoading: isSeaonsLoading,
    isError: isError1,
  } = useQuery(
    ["playerSeason", id],
    () =>
      axios({
        ...getFutPlayerSeasons,
        params: { ...getFutPlayerSeasons.params, player: id },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  const {
    data: playerStatsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
    isError: isError2,
  } = useQuery(
    ["playerStats", playerStatsSeasons?.[playerStatsSeasons?.length - 1]],
    () =>
      axios({
        ...getFutPlayerStats,
        params: {
          ...getFutPlayerStats.params,
          id: id,
          season:
            seasonId === 0
              ? playerStatsSeasons?.[playerStatsSeasons?.length - 1]
              : seasonId,
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!playerStatsSeasons?.[playerStatsSeasons?.length - 1],
    }
  );

  if (isError1 || isError2) {
    return (
      <div className="error-container">
        Too many requests, come back after some time or another day. :(
      </div>
    );
  }

  console.log(playerStatsData);

  return (
    <div className="playerPage-container">
      {isStatsLoading || isSeaonsLoading ? (
        <InfoSkeletonLoading />
      ) : (
        <div className="info-container player-info">
          <div
            style={{
              height: "inherit",
              justifyContent: "center",
            }}
            className="info-container__body"
          >
            <img src={playerStatsData?.[0]?.player?.photo} alt="player-img" />
            <h2 style={{ fontSize: "1.25rem", padding: "0 0.5em" }}>
              {playerStatsData?.[0]?.player?.name}
            </h2>
            <p>Age: {playerStatsData?.[0]?.player?.age}</p>
            <p style={{ paddingTop: "0.25em" }}>
              DOB: {playerStatsData?.[0]?.player?.birth?.date}
            </p>
            <p style={{ paddingTop: "0.25em" }}>
              Nationality: {playerStatsData?.[0]?.player?.nationality}
            </p>
          </div>
        </div>
      )}
      <div className="playerPage-container__body">
        <div className="playerPage-container__body--pseudo-margin"></div>
        <div className="playerPage-container__body__content">
          <div className="playerPage-container__body__content--header">
            <h4>Stats</h4>
          </div>
          {isStatsLoading || isSeaonsLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faFutbol}
                bounce
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : (
            <>
              <div className="playerPage-container__body__content--filter">
                {playerStatsData?.[0]?.statistics?.length > 1 && (
                  <ul>
                    {playerStatsData?.[0]?.statistics?.map((tournament, i) => (
                      <li
                        onClick={() => setActiveIndex(i)}
                        className={activeIndex === i ? "active" : ""}
                        key={tournament?.league?.id}
                      >
                        {tournament?.league?.name}
                      </li>
                    ))}
                  </ul>
                )}
                {playerStatsSeasons?.length > 1 && (
                  <ul
                    className="fut--season-stats"
                    style={{
                      padding:
                        playerStatsData?.[0]?.statistics?.length > 1 && "2em 0",
                    }}
                  >
                    {[...playerStatsSeasons]?.reverse()?.map((season, i) => (
                      <li
                        onClick={() => {
                          setSeasonId(season);
                          setSeasonIndex(i);
                          setActiveIndex(0);
                          setTimeout(() => {
                            refetchStats();
                          }, 0);
                        }}
                        className={seasonIndex === i ? "season--active" : ""}
                        key={season}
                      >
                        {season}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="playerPage-container__body__content--body">
                <div className="player__stats-container">
                  <div className="stats--table">
                    <div className="stats--table__value">
                      <p>Appearences</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.games
                            ?.appearences
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Position</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.games
                            ?.position
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Rating</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.games
                            ?.rating
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Lineups</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.games
                            ?.lineups
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Team</p>
                      <Link
                        className="link"
                        to={`/${sport}/team/${playerStatsData?.[0]?.statistics?.[activeIndex]?.team?.id}`}
                      >
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.team
                            ?.name
                        }
                      </Link>
                    </div>
                    <div className="stats--table__value">
                      <p>Yellow Cards</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.cards
                            ?.yellow
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Red Cards</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.cards
                            ?.red
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Goals</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.goals
                            ?.total
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Assists</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.goals
                            ?.assists
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Goals Conceded</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.goals
                            ?.conceded
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Saves</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.goals
                            ?.saves
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Pass Accuracy</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]
                            ?.passes?.accuracy
                        }
                        %
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Shots O/T</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.shots
                            ?.on
                        }{" "}
                        /{" "}
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.shots
                            ?.total
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Total Tackles</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]
                            ?.tackles?.total
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Tackles Blocked</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]
                            ?.tackles?.blocked
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Tackles Intercepted</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]
                            ?.tackles?.interceptions
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Dribbles S/A</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]
                            ?.dribbles?.success
                        }{" "}
                        /{" "}
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]
                            ?.dribbles?.attempts
                        }
                      </p>
                    </div>
                    <div className="stats--table__value">
                      <p>Duels W/T</p>
                      <p>
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.duels
                            ?.won
                        }{" "}
                        /{" "}
                        {
                          playerStatsData?.[0]?.statistics?.[activeIndex]?.duels
                            ?.total
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
