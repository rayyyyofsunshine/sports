import React, { useState, useEffect } from "react";
import { useQuery, useInfiniteQuery } from "react-query";
import { instance } from "../../Api/Request";
import { useParams } from "react-router";
import InfoNav from "../../Layouts/InfoNav";
import PlayersTab from "../../Components/PlayersTab/PlayersTab";
import InfiniteScroll from "react-infinite-scroll-component";
import Fixtures from "../../Components/Fixtures/Fixtures";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaseballBatBall } from "@fortawesome/free-solid-svg-icons";

export default function CrcTeamPage() {
  const params = useParams();
  const [tab, setTab] = useState("Fixtures");
  const [previousFixturesPage, setPreviousFixturesPage] = useState(0);
  const [upcomingFixturesPage, setUpcomingFixturesPage] = useState(0);
  const [fixtureType, setFixtureType] = useState("Upcoming");
  const [fixtures, setFixtures] = useState([]);

  const {
    data: crcTeamInfo,
    isLoading: isInfoLoading,
    isError: isError1,
  } = useQuery(
    ["crcTeamsInfo", params?.id],
    () => instance.get(`/cricket/team/${params?.id}`),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const {
    data: crcPreviousTeamFixtures,
    hasNextPage: hasPreviousFixtures,
    fetchNextPage: fetchPreviousFixtures,
    refetch: refetchPreviousFixtures,
    isLoading: isPreviousFixturesLoading,
    isError: isError2,
  } = useInfiniteQuery(
    ["crcPreviousTeamFixtures", params?.id],
    async () =>
      instance.get(
        `/cricket/team/${params?.id}/matches/previous/${previousFixturesPage}`
      ),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      getNextPageParam: (lastPage) => lastPage?.data?.hasNextPage,
      onSuccess: (data) => {
        setFixtures((prevState) => [
          ...prevState,
          data?.pages?.[0]?.data?.events,
        ]);
      },
    }
  );

  const {
    data: crcUpcomingTeamFixtures,
    hasNextPage: hasUpcomingFixtures,
    fetchNextPage: fetchUpcomingFixtures,
    refetch: refetchUpcomingFixtures,
    isLoading: isUpcomingFixturesLoading,
    isError: isError3,
  } = useInfiniteQuery(
    ["crcNextTeamFixtures", params?.id],
    async () =>
      instance.get(
        `/cricket/team/${params?.id}/matches/next/${upcomingFixturesPage}`
      ),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      getNextPageParam: (lastPage) => lastPage?.data?.hasNextPage,
      onSuccess: (data) => {
        setFixtures((prevState) => [
          ...prevState,
          data?.pages?.[0]?.data?.events,
        ]);
      },
    }
  );

  const {
    data: crcTeamPlayers,
    isLoading: isPlayerLoading,
    isError: isError4,
  } = useQuery(
    ["crcTeamPlayers", params?.id],
    () => instance.get(`/cricket/team/${params?.id}/players`),
    {
      refetchOnWindowFocus: false,
      staleTime: 30 * 60 * 1000, // 30 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      enabled: tab === "Players" && !!params?.id,
    }
  );

  useEffect(() => {
    if (fixtureType === "Upcoming") {
      refetchUpcomingFixtures();
    } else {
      refetchPreviousFixtures();
    }
  }, [fixtureType, refetchPreviousFixtures, refetchUpcomingFixtures]);

  useEffect(() => {
    if (
      crcUpcomingTeamFixtures?.pages?.[
        crcUpcomingTeamFixtures?.pages?.length - 1
      ]?.data?.hasNextPage
    ) {
      setUpcomingFixturesPage((prev) => prev + 1);
    }
  }, [crcUpcomingTeamFixtures]);

  useEffect(() => {
    if (
      crcPreviousTeamFixtures?.pages?.[
        crcPreviousTeamFixtures?.pages?.length - 1
      ]?.data?.hasNextPage
    ) {
      setPreviousFixturesPage((prev) => prev + 1);
    }
  }, [crcPreviousTeamFixtures]);

  const getFilteredFixtures = (fixtures, fixtureType) =>
    fixtures
      .flat()
      .filter((fixture) =>
        fixtureType === "Previous"
          ? fixture?.status?.type === "finished"
          : fixture?.status?.type === "notstarted"
      )
      .filter((fixture) => fixture?.status?.type !== "canceled")
      .map((fixture) => (
        <Fixtures key={fixture?.id} sport={"cricket"} fixture={fixture} />
      ));

  if (isError1 || isError2 || isError3 || isError3 || isError4) {
    return (
      <div className="error-container">
        Too many request, come back after some time or another day. :(
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
          sport={"cricket"}
          type={"team"}
          data={crcTeamInfo?.data?.team}
        />
      )}
      <div className="teamPage-container__body">
        <div className="teamPage-container__body--pseudo-margin"></div>
        <div className="teamPage-container__body__content">
          <div className="teamPage-container__body__content--header">
            <h4>{tab}</h4>
          </div>
          {tab === "Fixtures" && (
            <div
              style={{ top: window.innerWidth < 1024 ? "18.175em" : "4.1em" }}
              className="teamPage-container__body__content--filter"
            >
              <p
                className={fixtureType === "Previous" ? "active" : ""}
                onClick={() => setFixtureType("Previous")}
              >
                Previous
              </p>
              <p
                className={fixtureType === "Upcoming" ? "active" : ""}
                onClick={() => setFixtureType("Upcoming")}
              >
                Upcoming
              </p>
            </div>
          )}
          {isPreviousFixturesLoading || isUpcomingFixturesLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faBaseballBatBall}
                flip
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : (
            <div className="teamPage-container__body__content--body">
              {tab === "Fixtures" && fixtures?.length > 0 && (
                <div className="fixturesTab-container">
                  {fixtures?.filter(Boolean)?.length ? (
                    fixtureType === "Upcoming" ? (
                      fixtures
                        ?.filter(Boolean)
                        ?.flat()
                        .filter(
                          (fixture) => fixture.status.type === "notstarted"
                        ).length ? (
                        <InfiniteScroll
                          dataLength={fixtures.filter(Boolean).length}
                          next={fetchUpcomingFixtures}
                          hasMore={hasUpcomingFixtures}
                        >
                          {getFilteredFixtures(fixtures, fixtureType)}
                        </InfiniteScroll>
                      ) : (
                        <div className="alt-container">No fixtures found.</div>
                      )
                    ) : fixtures
                        ?.filter(Boolean)
                        ?.flat()
                        .filter((fixture) => fixture.status.type === "finished")
                        .length ? (
                      <InfiniteScroll
                        dataLength={fixtures.filter(Boolean).length}
                        next={fetchPreviousFixtures}
                        hasMore={hasPreviousFixtures}
                      >
                        {getFilteredFixtures(fixtures, fixtureType)}
                      </InfiniteScroll>
                    ) : (
                      <div className="alt-container">No fixtures found.</div>
                    )
                  ) : (
                    <div className="alt-container">No fixtures found.</div>
                  )}
                </div>
              )}
              {tab === "Players" &&
                (isPlayerLoading ? (
                  <div className="loading-container">
                    <FontAwesomeIcon
                      className="icon"
                      icon={faBaseballBatBall}
                      flip
                      style={{ color: "#e5c72e" }}
                    />
                  </div>
                ) : (
                  <PlayersTab
                    sport={"cricket"}
                    players={crcTeamPlayers?.data?.players}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
