import React, { useRef, useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import axios from "axios";
import InfoNav from "../../Layouts/InfoNav";
import {
  getFutFixturesByLeague,
  getFutLeagueInfo,
  getFutStandingsByLeague,
  getFutTopAssistsByLeague,
  getFutTopScorersByLeague,
} from "../../Api/FutRequest";
import Fixtures from "../../Components/Fixtures/Fixtures";
import StandingsTab from "../../Components/StandingsTab/StandingsTab";
import PlayerStandings from "../../Components/PlayerStandings/PlayerStandings";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFutbol, faHandshake } from "@fortawesome/free-regular-svg-icons";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { DataContext } from "../../Helpers/DataContext";

export default function FutLeaguePage() {
  const params = useParams();
  let firstIncompleteRef = useRef(null);
  const [tab, setTab] = useState("Fixtures");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTable, setActiveTable] = useState("standings");
  const { cancelledStatus, notstartedStatus } = useContext(DataContext);

  const {
    data: futLeagueInfo,
    isLoading: isInfoLoading,
    isError: isError1,
  } = useQuery(
    ["futLeagueInfo", params?.id],
    () =>
      axios({
        ...getFutLeagueInfo,
        params: { ...getFutLeagueInfo.params, id: params?.id },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const {
    data: futLeagueFixtures,
    isLoading: isFixturesLoading,
    isError: isError2,
  } = useQuery(
    ["futLeagueFixtures", futLeagueInfo?.[0]?.league?.name],
    () =>
      axios({
        ...getFutFixturesByLeague,
        params: {
          ...getFutFixturesByLeague.params,
          league: params?.id,
          season: getSeason(futLeagueInfo?.[0]?.seasons),
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!futLeagueInfo?.[0]?.league?.name,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      onSuccess: (data) => {
        if (data) {
          const firstNotStartedFixtureIndex = data
            .filter(
              (fixture) =>
                !cancelledStatus.includes(fixture?.fixture?.status?.short)
            )
            .findIndex((fixture) =>
              notstartedStatus.includes(fixture?.fixture?.status?.short)
            );
          firstIncompleteRef.current = firstNotStartedFixtureIndex;
        }
      },
    }
  );

  const {
    data: futLeagueStandings,
    isLoading: isStandingsLoading,
    isError: isError3,
  } = useQuery(
    ["futLeagueStandings", futLeagueInfo?.[0]?.league?.id],
    () =>
      axios({
        ...getFutStandingsByLeague,
        params: {
          ...getFutStandingsByLeague.params,
          league: params?.id,
          season: getSeason(futLeagueInfo?.[0]?.seasons),
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: tab === "Standings" && !!futLeagueInfo?.[0]?.league?.id,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const getSeason = (data) => {
    let temp = data?.filter((date) => date?.current === true);
    return temp?.length > 0 ? temp?.[0]?.year : parseInt(moment().year()) - 1;
  };

  const {
    data: futTopScoresData,
    refetch: refetchFutTopScorers,
    isLoading: isTopScorersLoading,
    isError: isError4,
  } = useQuery(
    "topScorers",
    () =>
      axios({
        ...getFutTopScorersByLeague,
        params: {
          ...getFutTopScorersByLeague.params,
          league: params?.id,
          season: getSeason(futLeagueInfo?.[0]?.seasons),
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const {
    data: futTopAssistsData,
    refetch: refetchFutTopAssists,
    isLoading: isTopAssistsLoading,
    isError: isError5,
  } = useQuery(
    "topAssists",
    () =>
      axios({
        ...getFutTopAssistsByLeague,
        params: {
          ...getFutTopAssistsByLeague.params,
          league: params?.id,
          season: getSeason(futLeagueInfo?.[0]?.seasons),
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  useEffect(() => {
    if (futLeagueFixtures !== undefined && firstIncompleteRef.current) {
      const { top } = firstIncompleteRef.current.getBoundingClientRect();
      window.scrollTo({ top: window.innerWidth < 1024 ? top - 270 : top - 70 });
    }
  }, [futLeagueFixtures]);

  if (isError1 || isError2 || isError3 || isError4 || isError5) {
    return (
      <div className="error-container">
        Too many requests, come back after some time or another day. :(
      </div>
    );
  }

  return (
    <div className="leaguePage-container">
      {isInfoLoading ? (
        <InfoSkeletonLoading />
      ) : (
        <InfoNav
          type={"league"}
          data={futLeagueInfo?.[0]}
          setTab={setTab}
          tab={tab}
        />
      )}
      <div className="leaguePage-container__body">
        <div className="leaguePage-container__body--pseudo-margin"></div>
        <div className="leaguePage-container__body__content">
          <div className="leaguePage-container__body__content--header">
            <h4>{tab}</h4>
            {tab === "Standings" && (
              <div className="change--filter">
                <FontAwesomeIcon
                  onClick={() => {
                    setActiveTable("standings");
                  }}
                  className={`icon ${
                    activeTable === "standings" ? "active-class" : ""
                  }`}
                  icon={faTable}
                />
                <FontAwesomeIcon
                  onClick={() => {
                    refetchFutTopAssists();
                    setActiveTable("assists");
                  }}
                  className={`icon ${
                    activeTable === "assists" ? "active-class" : ""
                  }`}
                  icon={faHandshake}
                />
                <FontAwesomeIcon
                  onClick={() => {
                    refetchFutTopScorers();
                    setActiveTable("goals");
                  }}
                  className={`icon ${
                    activeTable === "goals" ? "active-class" : ""
                  }`}
                  icon={faFutbol}
                />
              </div>
            )}
          </div>
          {isInfoLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faFutbol}
                bounce
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : (
            <div className="leaguePage-container__body__content--body">
              {tab === "Fixtures" && (
                <div className="fixturesTab-container">
                  {isFixturesLoading ? (
                    <div className="loading-container">
                      <FontAwesomeIcon
                        className="icon"
                        icon={faFutbol}
                        bounce
                        style={{ color: "#e5c72e" }}
                      />
                    </div>
                  ) : futLeagueFixtures?.length > 0 ? (
                    futLeagueFixtures
                      ?.filter(
                        (fixture) =>
                          !cancelledStatus.includes(
                            fixture?.fixture?.status?.short
                          )
                      )
                      .map((fixture, index) => (
                        <Fixtures
                          ref={
                            firstIncompleteRef.current === index
                              ? firstIncompleteRef
                              : null
                          }
                          key={fixture?.fixture?.id}
                          sport={"football"}
                          fixture={fixture}
                        />
                      ))
                  ) : (
                    <div className="alt-container">
                      <p>No data found.</p>
                    </div>
                  )}
                </div>
              )}
              {tab === "Standings" && (
                <div className="standingsTab-container">
                  {activeTable === "standings" &&
                    (isStandingsLoading ? (
                      <div className="loading-container">
                        <FontAwesomeIcon
                          className="icon"
                          icon={faFutbol}
                          bounce
                          style={{ color: "#e5c72e" }}
                        />
                      </div>
                    ) : (
                      <div className="standingsTab-container__table">
                        <div className="standingsTab-container__table--filter">
                          <ul>
                            {futLeagueStandings?.[0]?.league?.standings.map(
                              (item, index) => (
                                <li
                                  className={
                                    index === activeIndex ? "active--tabs" : ""
                                  }
                                  onClick={() => setActiveIndex(index)}
                                  key={index}
                                >
                                  {item?.[0]?.stage}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                        <div className="standingsTab-container__table--content">
                          {futLeagueStandings?.[0]?.league?.standings.length >
                          1 ? (
                            futLeagueStandings?.[0]?.league?.standings?.map(
                              (item, index) => (
                                <div
                                  key={index}
                                  className="standingsTab-container__table__groups"
                                >
                                  <div className="standingsTab-container__table__groups--header">
                                    {item?.[0]?.group}
                                  </div>
                                  <div className="standingsTab-container__table__groups--content">
                                    <StandingsTab
                                      sport={"football"}
                                      data={item}
                                    />
                                  </div>
                                </div>
                              )
                            )
                          ) : futLeagueStandings?.[0]?.league?.standings
                              ?.length > 0 ? (
                            <StandingsTab
                              sport={"football"}
                              data={
                                futLeagueStandings?.[0]?.league?.standings?.[
                                  activeIndex
                                ]
                              }
                            />
                          ) : (
                            <div className="alt-container">
                              <p>No data found.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  {activeTable !== "standings" && (
                    <div className="standingsTab-container__table">
                      <div className="standingsTab-container__table--content">
                        {activeTable === "assists" &&
                          (isTopScorersLoading ? (
                            <div className="loading-container">
                              <FontAwesomeIcon
                                className="icon"
                                icon={faFutbol}
                                bounce
                                style={{ color: "#e5c72e" }}
                              />
                            </div>
                          ) : futTopAssistsData?.length > 0 ? (
                            <PlayerStandings item={futTopAssistsData} />
                          ) : (
                            <div className="alt-container">
                              <p>No data found.</p>
                            </div>
                          ))}
                        {activeTable === "goals" &&
                          (isTopAssistsLoading ? (
                            <div className="loading-container">
                              <FontAwesomeIcon
                                className="icon"
                                icon={faFutbol}
                                bounce
                                style={{ color: "#e5c72e" }}
                              />
                            </div>
                          ) : futTopScoresData?.length > 0 ? (
                            <PlayerStandings item={futTopScoresData} />
                          ) : (
                            <div className="alt-container">
                              <p>No data found.</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
