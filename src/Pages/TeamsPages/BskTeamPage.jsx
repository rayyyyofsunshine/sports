import React, { useState, useRef, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router";
import {
  getBskFixturesByTeam,
  getBskTeamInfo,
  getBskTeamStats,
  getBskTeamSeasons,
} from "../../Api/BskRequest";
import InfoNav from "../../Layouts/InfoNav";
import Fixtures from "../../Components/Fixtures/Fixtures";
import StatsTab from "../../Components/StatsTab/StatsTab";
import { faBasketball } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { DataContext } from "../../Helpers/DataContext";

export default function BskTeamPage() {
  const params = useParams();
  let merged = useRef();
  let firstIncompleteRef = useRef(null);
  const [leagueId, setLeagueId] = useState(0);
  const [tab, setTab] = useState("Fixtures");
  const { cancelledStatus, notstartedStatus } = useContext(DataContext);

  const {
    data: bskTeamsInfo,
    isLoading: isInfoLoading,
    isError: isError1,
  } = useQuery(
    ["bskTeamsInfo", params?.id],
    () =>
      axios({
        ...getBskTeamInfo,
        params: { ...getBskTeamInfo.params, id: params?.id },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );
  const { data: bskTeamSeasons, isError: isError2 } = useQuery(
    ["bskTeamSeasons", params?.id],
    () => axios(getBskTeamSeasons).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const {
    data: bskTeamFixtures,
    isLoading: isFixturesLoading,
    isError: isError3,
  } = useQuery(
    ["bskTeamFixtures", bskTeamSeasons?.[bskTeamSeasons?.length - 2]],
    () =>
      axios({
        ...getBskFixturesByTeam,
        params: {
          ...getBskFixturesByTeam.params,
          team: params?.id,
          season: bskTeamSeasons?.[bskTeamSeasons?.length - 2],
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!bskTeamSeasons?.[bskTeamSeasons?.length - 2],
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

  useEffect(() => {
    if (bskTeamFixtures !== undefined) {
      const leagueIds = [
        ...new Set(bskTeamFixtures.map((item) => item.league.id)),
      ];
      const leagueNames = [
        ...new Set(bskTeamFixtures.map((item) => item.league.name)),
      ];
      merged.current = leagueIds.map((item, index) => [
        leagueNames[index],
        item,
      ]);
      setLeagueId(merged?.current?.[0]?.[1]);
    }
  }, [bskTeamFixtures]);

  const {
    data: bskTeamStats,
    isLoading: isStatsLoading,
    isError: isError4,
  } = useQuery(
    ["bskTeamStats", leagueId],
    () =>
      axios({
        ...getBskTeamStats,
        params: {
          ...getBskTeamStats.params,
          team: params?.id,
          league: leagueId,
          season: bskTeamSeasons?.[bskTeamSeasons?.length - 2],
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: tab === "Stats" && !!leagueId,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  useEffect(() => {
    if (bskTeamFixtures !== undefined && firstIncompleteRef.current) {
      const { top } = firstIncompleteRef.current.getBoundingClientRect();
      window.scrollTo({ top: window.innerWidth < 1024 ? top - 270 : top - 70 });
    }
  }, [bskTeamFixtures]);

  if (isError1 || isError2 || isError3 || isError4) {
    return (
      <div className="error-container">
        Too many requests, come back after some time or another day. :(
      </div>
    );
  }

  return (
    <div className="teamPage-container">
      {isInfoLoading ? (
        <InfoSkeletonLoading />
      ) : (
        <InfoNav
          setTab={setTab}
          tab={tab}
          type={"team"}
          data={bskTeamsInfo?.[0]}
        />
      )}
      <div className="teamPage-container__body">
        <div className="teamPage-container__body--pseudo-margin"></div>
        <div className="teamPage-container__body__content">
          <div className="teamPage-container__body__content--header">
            <h4>{tab}</h4>
          </div>
          {isInfoLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faBasketball}
                bounce
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : (
            <div className="teamPage-container__body__content--body">
              {tab === "Fixtures" && (
                <div className="fixturesTab-container">
                  {isFixturesLoading ? (
                    <FontAwesomeIcon
                      className="icon"
                      icon={faBasketball}
                      bounce
                      style={{ color: "#e5c72e" }}
                    />
                  ) : bskTeamFixtures?.length > 0 ? (
                    bskTeamFixtures
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
                          sport={"basketball"}
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
              {tab === "Stats" && isStatsLoading ? (
                <FontAwesomeIcon
                  className="icon"
                  icon={faBasketball}
                  bounce
                  style={{ color: "#e5c72e" }}
                />
              ) : (
                <div className="statsTab-container">
                  <div className="statsTab-container--filter">
                    {merged?.current?.map((item, index) => (
                      <h4
                        className={
                          merged?.current?.length > 1 && item?.[1] === leagueId
                            ? "active"
                            : ""
                        }
                        onClick={() => setLeagueId(item?.[1])}
                        key={index}
                      >
                        {item?.[0]}
                      </h4>
                    ))}
                  </div>
                  <div className="statsTab-container--content">
                    {bskTeamStats !== undefined ? (
                      <StatsTab data={bskTeamStats} />
                    ) : (
                      <div className="alt-container">
                        <p>No data found.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
