import React, { useRef, useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import axios from "axios";
import _ from "lodash";
import InfoNav from "../../Layouts/InfoNav";
import Fixtures from "../../Components/Fixtures/Fixtures";
import StandingsTab from "../../Components/StandingsTab/StandingsTab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHockeyPuck } from "@fortawesome/free-solid-svg-icons";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { DataContext } from "../../Helpers/DataContext";
import {
  getHkyFixturesByLeague,
  getHkyLeagueInfo,
  getHkyStandingsByLeague,
} from "../../Api/HkyRequest";
import { getCurrentSeason } from "../../Helpers/Utilities";

export default function HkyLeaguePage() {
  const params = useParams();
  let firstIncompleteRef = useRef(null);
  const [tab, setTab] = useState("Fixtures");
  const [activeIndex, setActiveIndex] = useState(0);
  const { cancelledStatus, notstartedStatus } = useContext(DataContext);

  const {
    data: hkyLeagueInfo,
    isLoading: isInfoLoading,
    isError: isError1,
  } = useQuery(
    ["hkyLeagueInfo", params?.id],
    () =>
      axios({
        ...getHkyLeagueInfo,
        params: { ...getHkyLeagueInfo.params, id: params?.id },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const {
    data: hkyLeagueFixtures,
    isLoading: isFixturesLoading,
    isError: isError2,
  } = useQuery(
    ["hkyLeagueFixtures", hkyLeagueInfo?.[0]?.name],
    () =>
      axios({
        ...getHkyFixturesByLeague,
        params: {
          ...getHkyFixturesByLeague.params,
          league: params?.id,
          season: getCurrentSeason(hkyLeagueInfo?.[0]?.seasons),
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!hkyLeagueInfo?.[0]?.name,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      onSuccess: (data) => {
        if (data) {
          const firstNotStartedFixtureIndex = data
            .filter(
              (fixture) => !cancelledStatus.includes(fixture?.status?.short)
            )
            .findIndex((fixture) =>
              notstartedStatus.includes(fixture?.status?.short)
            );
          firstIncompleteRef.current = firstNotStartedFixtureIndex;
        }
      },
    }
  );

  const {
    data: hkyLeagueStandings,
    isLoading: isStandingsLoading,
    isError: isError3,
  } = useQuery(
    ["hkyLeagueStandings", hkyLeagueInfo?.[0]?.id],
    () =>
      axios({
        ...getHkyStandingsByLeague,
        params: {
          ...getHkyStandingsByLeague.params,
          league: params?.id,
          season: getCurrentSeason(hkyLeagueInfo?.[0]?.seasons),
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: tab === "Standings" && !!hkyLeagueInfo?.[0]?.id,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  useEffect(() => {
    if (hkyLeagueFixtures?.length > 0 && firstIncompleteRef.current) {
      const { top } = firstIncompleteRef.current.getBoundingClientRect();
      window.scrollTo({ top: window.innerWidth < 1024 ? top - 270 : top - 70 });
    }
  }, [hkyLeagueFixtures, tab]);

  if (isError1 || isError2 || isError3) {
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
          data={hkyLeagueInfo?.[0]}
          setTab={setTab}
          tab={tab}
        />
      )}
      <div className="leaguePage-container__body">
        <div className="leaguePage-container__body--pseudo-margin"></div>
        <div className="leaguePage-container__body__content">
          <div className="leaguePage-container__body__content--header">
            <h4>{tab}</h4>
          </div>
          {isInfoLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faHockeyPuck}
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
                        icon={faHockeyPuck}
                        bounce
                        style={{ color: "#e5c72e" }}
                      />
                    </div>
                  ) : hkyLeagueFixtures?.length > 0 ? (
                    hkyLeagueFixtures
                      ?.filter(
                        (fixture) =>
                          !cancelledStatus.includes(fixture?.status?.short)
                      )
                      .map((fixture, index) => (
                        <Fixtures
                          ref={
                            firstIncompleteRef.current === index
                              ? firstIncompleteRef
                              : null
                          }
                          key={fixture?.id}
                          sport={"hockey"}
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
                  {isStandingsLoading ? (
                    <div className="loading-container">
                      <FontAwesomeIcon
                        className="icon"
                        icon={faHockeyPuck}
                        bounce
                        style={{ color: "#e5c72e" }}
                      />
                    </div>
                  ) : (
                    <div className="standingsTab-container__table">
                      {hkyLeagueStandings?.length > 1 && (
                        <div className="standingsTab-container__table--filter">
                          <ul>
                            {hkyLeagueStandings?.map((item, index) => (
                              <li
                                className={
                                  index === activeIndex ? "active--tabs" : ""
                                }
                                onClick={() => setActiveIndex(index)}
                                key={index}
                              >
                                {item?.[0]?.stage}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="standingsTab-container__table--content">
                        {hkyLeagueStandings?.length < 1 ? (
                          <div className="alt-container">
                            <p>No data found.</p>
                          </div>
                        ) : Object.keys(
                            _.groupBy(
                              hkyLeagueStandings?.[activeIndex],
                              "group.name"
                            )
                          ).length > 1 ? (
                          Object.keys(
                            _.groupBy(
                              hkyLeagueStandings?.[activeIndex],
                              "group.name"
                            )
                          ).map((item, index) => (
                            <div
                              key={index}
                              className="standingsTab-container__table__groups"
                            >
                              <div className="standingsTab-container__table__groups--header">
                                {item}
                              </div>
                              <div className="standingsTab-container__table__groups--content">
                                <StandingsTab
                                  sport={"hockey"}
                                  data={
                                    _.groupBy(
                                      hkyLeagueStandings?.[activeIndex],
                                      "group.name"
                                    )[item]
                                  }
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <StandingsTab
                            sport={"hockey"}
                            data={hkyLeagueStandings?.[activeIndex]}
                          />
                        )}
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
