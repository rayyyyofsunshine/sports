import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { getFutDetailFixtures } from "../../Api/FutRequest";
import LineUp from "../../Components/LineUp/LineUp";
import FixtureStatistics from "../../Components/FixtureStatistics/FixtureStatistics";
import FixtureDetail from "../../Layouts/FixtureDetail";
import PlayByPlay from "../../Components/PlayByPlay/PlayByPlay";
import FixtureDetailSkeletonLoading from "../../Components/SkeletonLoading/FixtureDetailSkeletonLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFutbol } from "@fortawesome/free-regular-svg-icons";

export default function FutFixturePage() {
  const { id } = useParams();
  const [tab, setTab] = useState("Stats");

  const {
    data: detailFixtureData,
    isLoading,
    isError,
  } = useQuery(
    ["futDetailFixture", id],
    () =>
      axios({
        ...getFutDetailFixtures,
        params: {
          id: id,
        },
      }),
    { refetchOnWindowFocus: false, enabled: !!id }
  );

  if (isError) {
    return (
      <div className="error-container">
        Too many requests, come back after some time or another day. :(
      </div>
    );
  }

  return (
    <div className="fixturePage-container">
      {isLoading ? (
        <FixtureDetailSkeletonLoading />
      ) : (
        <FixtureDetail
          sport={"football"}
          tab={tab}
          setTab={setTab}
          fixture={detailFixtureData?.data?.response?.[0]}
          homeScore={detailFixtureData?.data?.response?.[0]?.goals?.home}
          awayScore={detailFixtureData?.data?.response?.[0]?.goals?.away}
          detailedFixture={
            detailFixtureData !== undefined &&
            detailFixtureData?.data?.response?.[0]
          }
        />
      )}
      <div className="fixturePage-container--tabs">
        {tab === "Lineups" &&
          (isLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                bounce
                icon={faFutbol}
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : detailFixtureData?.data?.response?.[0]?.lineups?.length ? (
            <LineUp
              events={
                detailFixtureData?.data?.response?.[0]?.fixture?.status
                  ?.short !== "NS" &&
                detailFixtureData?.data?.response?.[0]?.events
              }
              data={detailFixtureData?.data?.response?.[0]?.lineups}
            />
          ) : (
            <div className="tabs-container--alt">
              <h4>No lineups found for this fixture.</h4>
            </div>
          ))}
        {tab === "Stats" &&
          (isLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                bounce
                icon={faFutbol}
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : detailFixtureData?.data?.response?.[0]?.statistics?.length ? (
            <div className="stats-container__wrapper">
              <div className="stats-container__wrapper--header">
                <Link
                  className="link"
                  to={`/football/team/${detailFixtureData?.data?.response?.[0]?.teams?.home?.id}`}
                >
                  <div className="home--team">
                    <img
                      src={
                        detailFixtureData?.data?.response?.[0]?.teams?.home
                          ?.logo
                      }
                      alt="team-logo"
                    />
                    <h4>
                      {
                        detailFixtureData?.data?.response?.[0]?.teams?.home
                          ?.name
                      }
                    </h4>
                  </div>
                </Link>
                <Link
                  className="link"
                  to={`/football/team/${detailFixtureData?.data?.response?.[0]?.teams?.away?.id}`}
                >
                  <div className="away--team">
                    <h4>
                      {
                        detailFixtureData?.data?.response?.[0]?.teams?.away
                          ?.name
                      }
                    </h4>
                    <img
                      src={
                        detailFixtureData?.data?.response?.[0]?.teams?.away
                          ?.logo
                      }
                      alt="team-logo"
                    />
                  </div>
                </Link>
              </div>
              <FixtureStatistics
                sports={"football"}
                stats={detailFixtureData?.data?.response?.[0]?.statistics}
              />
              )
            </div>
          ) : (
            <div className="tabs-container--alt">
              <h4>No Stats found for this match.</h4>
            </div>
          ))}
        {tab === "Plays" &&
          (isLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                bounce
                icon={faFutbol}
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : detailFixtureData?.data?.response?.[0]?.events?.length ? (
            <div>
              <PlayByPlay
                sport={"football"}
                playerData={detailFixtureData?.data?.response?.[0]?.players}
                fixtureData={detailFixtureData?.data?.response?.[0]}
                data={detailFixtureData?.data?.response?.[0]?.events}
              />
            </div>
          ) : (
            <div className="tabs-container--alt">
              <h4>No timeline for this match</h4>
            </div>
          ))}
      </div>
    </div>
  );
}
