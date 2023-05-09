import React, { useState, useEffect } from "react";
import { useQuery, useInfiniteQuery } from "react-query";
import { useParams } from "react-router";
import InfoNav from "../../Layouts/InfoNav";
import Fixtures from "../../Components/Fixtures/Fixtures";
import { instance } from "../../Api/Request";
import StandingsTab from "../../Components/StandingsTab/StandingsTab";
import InfiniteScroll from "react-infinite-scroll-component";
import { isCurrentDateinRange } from "../../Helpers/Utilities";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaseballBatBall } from "@fortawesome/free-solid-svg-icons";

export default function CrcLeaguePage() {
  const params = useParams();
  const [tab, setTab] = useState("Fixtures");
  const [previousFixturesPage, setPreviousFixturesPage] = useState(0);
  const [upcomingFixturesPage, setUpcomingFixturesPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [seasonId, setSeasonId] = useState(null);
  const [fixtureType, setFixtureType] = useState("Upcoming");
  const [fixtures, setFixtures] = useState([]);

  const {
    data: crcLeagueInfo,
    isLoading: isInfoLoading,
    isError1,
  } = useQuery(
    ["crcLeagueInfo", params?.id],
    () => instance.get(`/cricket/tournament/${params?.id}`),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 30 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const { isLoading: isSeasonsLoading, isError: isError2 } = useQuery(
    ["crcLeagueSeasons", params?.id],
    () => instance.get(`/cricket/tournament/${params?.id}/seasons`),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 30 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      onSuccess: (data) => {
        if (data) {
          setSeasonId(data?.data?.seasons?.[0]?.id);
        }
      },
    }
  );

  const {
    data: crcPreviousLeagueFixtures,
    hasNextPage: hasPreviousFixtures,
    fetchNextPage: fetchPreviousFixtures,
    refetch: refetchPreviousFixtures,
    isLoading: isPreviousFixturesLoading,
    isError: isError3,
  } = useInfiniteQuery(
    ["crcPreviousLeagueFixtures", params?.id],
    async () =>
      instance.get(
        `/cricket/tournament/${params?.id}/season/${seasonId}/matches/last/${previousFixturesPage}`
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
    data: crcUpcomingLeagueFixtures,
    hasNextPage: hasUpcomingFixtures,
    fetchNextPage: fetchUpcomingFixtures,
    refetch: refetchUpcomingFixtures,
    isLoading: isUpcomingFixturesloading,
    isError: isError4,
  } = useInfiniteQuery(
    ["crcNextLeagueFixtures", params?.id],
    async () =>
      instance.get(
        `/cricket/tournament/${params?.id}/season/${seasonId}/matches/next/${upcomingFixturesPage}`
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

  useEffect(() => {
    if (crcLeagueInfo !== undefined && seasonId !== null) {
      if (isCurrentDateinRange(crcLeagueInfo?.data?.uniqueTournament)) {
        const currentDate = new Date();
        const startDate = new Date(
          crcLeagueInfo?.data?.uniqueTournament?.startDateTimestamp * 1000
        );
        const endDate = new Date(
          crcLeagueInfo?.data?.uniqueTournament?.endDateTimestamp * 1000
        );

        if (currentDate > startDate && currentDate < endDate) {
          refetchPreviousFixtures();
          refetchUpcomingFixtures();
        } else {
          refetchUpcomingFixtures();
        }
      } else {
        refetchPreviousFixtures();
      }
    }
  }, [
    seasonId,
    crcLeagueInfo,
    refetchPreviousFixtures,
    refetchUpcomingFixtures,
  ]);

  const {
    data: crcLeagueStandings,
    isLoading: isStandingsLoading,
    isError: isError5,
  } = useQuery(
    ["crcLeagueStandings", seasonId],
    () =>
      instance.get(
        `/cricket/tournament/${params?.id}/season/${seasonId}/standings/total`
      ),
    {
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      enabled: tab === "Standings" && !!seasonId,
    }
  );

  useEffect(() => {
    if (
      crcUpcomingLeagueFixtures?.pages?.[
        crcUpcomingLeagueFixtures?.pages?.length - 1
      ]?.data?.hasNextPage
    ) {
      setUpcomingFixturesPage((prev) => prev + 1);
    }
  }, [crcUpcomingLeagueFixtures]);

  useEffect(() => {
    if (
      crcPreviousLeagueFixtures?.pages?.[
        crcPreviousLeagueFixtures?.pages?.length - 1
      ]?.data?.hasNextPage
    ) {
      setPreviousFixturesPage((prev) => prev + 1);
    }
  }, [crcPreviousLeagueFixtures]);

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

  if (isError1 || isError2 || isError3 || isError3 || isError4 || isError5) {
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
          setTab={setTab}
          tab={tab}
          sport={"cricket"}
          data={crcLeagueInfo?.data?.uniqueTournament}
        />
      )}
      <div className="leaguePage-container__body">
        <div className="leaguePage-container__body--pseudo-margin"></div>
        <div className="leaguePage-container__body__content">
          <div className="leaguePage-container__body__content--header">
            <h4>{tab}</h4>
          </div>
          {tab === "Fixtures" && (
            <div
              style={{ top: window.innerWidth < 1024 ? "18.175em" : "4.1em" }}
              className="leaguePage-container__body__content--filter"
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
          {isSeasonsLoading ||
          isPreviousFixturesLoading ||
          isUpcomingFixturesloading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faBaseballBatBall}
                flip
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : (
            <div className="leaguePage-container__body__content--body">
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
            </div>
          )}
          {tab === "Standings" && (
            <div className="standingsTab-container">
              {isStandingsLoading ? (
                <div className="loading-container">
                  <FontAwesomeIcon
                    className="icon"
                    flip
                    icon={faBaseballBatBall}
                    style={{ color: "#e5c72e" }}
                  />
                </div>
              ) : (
                <div className="standingsTab-container__table">
                  {crcLeagueStandings?.data?.standings?.length > 1 && (
                    <div className="standingsTab-container__table--filter">
                      <ul>
                        {crcLeagueStandings?.data?.standings.map(
                          (item, index) => (
                            <li
                              style={{ fontSize: "0.875rem" }}
                              className={
                                index === activeIndex ? "active--tabs" : ""
                              }
                              onClick={() => setActiveIndex(index)}
                              key={index}
                            >
                              {item?.name}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {crcLeagueStandings?.data?.standings?.length ? (
                    <div className="standingsTab-container__table--content">
                      <StandingsTab
                        sport={"cricket"}
                        data={
                          crcLeagueStandings?.data?.standings?.[activeIndex]
                            ?.rows
                        }
                      />
                    </div>
                  ) : (
                    <div className="alt-container">
                      <p>No data found.</p>
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
