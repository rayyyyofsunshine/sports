import React, { useState, useEffect, useRef, useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router";
import {
  getBsbFixturesByTeam,
  getBsbTeamInfo,
  getBsbTeamStats,
  getBsbSeasons,
} from "../../Api/BsbRequest";
import InfoNav from "../../Layouts/InfoNav";
import Fixtures from "../../Components/Fixtures/Fixtures";
import StatsTab from "../../Components/StatsTab/StatsTab";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaseball } from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../../Helpers/DataContext";

export default function BsbTeamPage() {
  const params = useParams();
  let merged = useRef(null);
  let firstIncompleteRef = useRef(null);
  const [leagueId, setLeagueId] = useState(0);
  const [tab, setTab] = useState("Fixtures");
  const { cancelledStatus, notstartedStatus } = useContext(DataContext);

  const {
    data: bsbTeamsInfo,
    isLoading: isInfoLoading,
    isError: isError1,
  } = useQuery(
    ["bsbTeamsInfo", params?.id],
    () =>
      axios({
        ...getBsbTeamInfo,
        params: { ...getBsbTeamInfo.params, id: params?.id },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const { data: bsbSeasons, isError: isError2 } = useQuery(
    ["bsbSeasons", params?.id],
    () => axios(getBsbSeasons).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const {
    data: bsbTeamFixtures,
    isLoading: isFixturesLoading,
    isError: isError3,
  } = useQuery(
    ["bsbTeamFixtures", bsbSeasons?.[bsbSeasons?.length - 1]],
    () =>
      axios({
        ...getBsbFixturesByTeam,
        params: {
          ...getBsbFixturesByTeam.params,
          team: params?.id,
          season: bsbSeasons?.[bsbSeasons?.length - 1],
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!bsbSeasons?.[bsbSeasons?.length - 1],
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
    if (bsbTeamFixtures !== undefined) {
      const leagueIds = [
        ...new Set(bsbTeamFixtures.map((item) => item.league.id)),
      ];
      const leagueNames = [
        ...new Set(bsbTeamFixtures.map((item) => item.league.name)),
      ];
      merged.current = leagueIds.map((item, index) => [
        leagueNames[index],
        item,
      ]);
      setLeagueId(merged?.current?.[0]?.[1]);
    }
  }, [bsbTeamFixtures]);

  const {
    data: bsbTeamStats,
    isLoading: isStatsLoading,
    isError: isError4,
  } = useQuery(
    ["bsbTeamStats", !!leagueId],
    () =>
      axios({
        ...getBsbTeamStats,
        params: {
          ...getBsbTeamStats.params,
          team: params?.id,
          league: leagueId,
          season: bsbSeasons?.[bsbSeasons?.length - 1],
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
    if (bsbTeamFixtures?.length > 0 && firstIncompleteRef.current) {
      const { top } = firstIncompleteRef.current.getBoundingClientRect();
      window.scrollTo({ top: window.innerWidth < 1024 ? top - 270 : top - 70 });
    }
  }, [bsbTeamFixtures]);

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
          data={bsbTeamsInfo?.[0]}
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
                icon={faBaseball}
                bounce
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : (
            <div className="teamPage-container__body__content--body">
              {tab === "Fixtures" && (
                <div className="fixturesTab-container">
                  {isFixturesLoading ? (
                    <div className="loading-container">
                      <FontAwesomeIcon
                        icon={faBaseball}
                        className="icon"
                        bounce
                        style={{ color: "#e5c72e" }}
                      />
                    </div>
                  ) : bsbTeamFixtures?.length > 1 ? (
                    bsbTeamFixtures
                      ?.filter(
                        (fixture) =>
                          !cancelledStatus.includes(fixture?.status?.short)
                      )
                      .map((fixture, index) => (
                        <Fixtures
                          key={fixture?.id}
                          sport={"baseball"}
                          fixture={fixture}
                          ref={
                            firstIncompleteRef.current === index
                              ? firstIncompleteRef
                              : null
                          }
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
                <div className="loading-container">
                  <FontAwesomeIcon
                    className="icon"
                    bounce
                    icon={faBaseball}
                    style={{ color: "#e5c72e" }}
                  />
                </div>
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
                    {bsbTeamStats !== undefined ? (
                      <StatsTab data={bsbTeamStats} />
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
