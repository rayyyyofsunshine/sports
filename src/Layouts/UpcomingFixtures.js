import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import Carousel from "./Carousel";
import {
  flagTournaments,
  getScoreValue,
  isCurrentDateinRange,
} from "../Helpers/Utilities";
import { instance } from "../Api/Request";
import { Link } from "react-router-dom";
import { DataContext } from "../Helpers/DataContext";
import UpcomingSkeletonLoading from "../Components/SkeletonLoading/UpcomingSkeletonLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function UpcomingFixtures({
  leagueId,
  tournamentId,
  sport,
  url,
  fetchUrl,
}) {
  let rightCarousel = useRef(null);
  let nextArrowRef = useRef(null);
  let previousArrowRef = useRef(null);
  const currentDate = new Date();
  const [flag, setFlag] = useState(null);
  const {
    upcomingFixture,
    setUpcomingFixture,
    finishedStatus,
    notstartedStatus,
  } = useContext(DataContext);
  const [seasonId, setSeasonId] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(null);

  const {
    data: leagueInfo,
    isLoading: isInfoLoading,
    isError: isError1,
  } = useQuery(
    ["leagues", leagueId],
    () =>
      sport === "cricket" || sport === "american-football"
        ? instance.get(url)
        : axios({
            ...fetchUrl,
            params: {
              id: leagueId,
            },
          }).then((res) => res.data),
    {
      onSuccess: (data) => {
        if (sport === "cricket" || sport === "american-football") {
          setFlag(isCurrentDateinRange(data?.data?.uniqueTournament));
          refetchSeasons();
        } else {
          getCurrentSeason(data?.response?.[0]?.seasons);
        }
      },
      refetchOnWindowFocus: false,
      enabled: !!leagueId,
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );

  const {
    refetch: refetchUpcomingLeagues,
    isLoading: isUpcomingLeaguesLoading,
    isError: isError2,
  } = useQuery(
    ["upcomingLeagues", leagueId],
    () =>
      axios({
        ...url,
        params: {
          league: leagueId,
          ...(sport === "football"
            ? currentSeason?.current
              ? { next: "5" }
              : { last: "5" }
            : { season: currentSeason?.year ?? currentSeason?.season }),
        },
      }),
    {
      onSuccess: (data) => {
        if (data) {
          const filteredFixtures = filterFixtures(data?.data?.response);
          setUpcomingFixture((prevState) => ({
            ...prevState,
            [leagueId]: filteredFixtures,
          }));
        }
      },
      refetchOnWindowFocus: false,
      enabled: false,
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );

  const {
    refetch: refetchUpcomingTournament,
    isLoading: isUpcomingTournamnetLoading,
    isError: isError3,
  } = useQuery(
    [`${sport}-tournaments`, leagueId],
    () => {
      return instance.get(
        `/${sport}/tournament/${leagueId}/season/${seasonId}/matches/${
          flag ? "next" : "last"
        }/0`
      );
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
      cacheTime: Infinity,
      staleTime: Infinity,
      onSuccess: (data) => {
        if (data) {
          const filteredFixtures = filterFixtures(data?.data?.events);
          setUpcomingFixture((prevState) => ({
            ...prevState,
            [leagueId]: filteredFixtures,
          }));
        }
      },
    }
  );

  const { refetch: refetchSeasons, isError: isError4 } = useQuery(
    [`${sport}-seasons`, leagueId],
    () => instance.get(`/${sport}/tournament/${leagueId}/seasons`),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      cacheTime: Infinity,
      staleTime: Infinity,
      onSuccess: (data) => {
        if (data) {
          setSeasonId(data?.data?.seasons?.[0]?.id);
        }
      },
    }
  );

  const getCurrentSeason = (seasons) => {
    const currSeason = seasons?.find((season) => {
      const startDate = new Date(season.start);
      const endDate = new Date(season.end);
      return currentDate >= startDate && currentDate <= endDate;
    });

    if (currSeason) {
      setCurrentSeason({
        ...currSeason,
        current: true,
      });
    } else {
      const sortedSeasons = [...seasons].sort(
        (a, b) => new Date(b.end) - new Date(a.end)
      );
      setCurrentSeason({
        ...sortedSeasons[0],
        current: false,
      });
    }
  };

  const filterFixtures = (data) => {
    let fixtures = [];
    if (currentSeason?.current || flag) {
      fixtures = data
        ?.filter((item) =>
          notstartedStatus.includes(
            item?.fixture?.status?.short ??
              item?.status?.short ??
              item?.status?.type
          )
        )
        .slice(0, 5);
    } else {
      fixtures = data
        ?.filter((item) =>
          finishedStatus.includes(
            item?.fixture?.status?.short ??
              item?.status?.short ??
              item?.status?.type
          )
        )
        .slice(0, 5);
    }
    return fixtures;
  };

  useEffect(() => {
    if (currentSeason !== null) {
      refetchUpcomingLeagues();
    } else if (seasonId !== null) {
      refetchUpcomingTournament();
    }
  }, [
    currentSeason,
    refetchUpcomingLeagues,
    refetchUpcomingTournament,
    seasonId,
  ]);

  useEffect(() => {
    if (upcomingFixture?.[leagueId]?.length > 0) {
      const track = rightCarousel?.current;
      const slides = Array.from(track?.children);
      const slideWidth = slides?.[0]?.getBoundingClientRect().width;
      slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + "px";
      });
      track.parentElement.previousElementSibling.children[1].children[0].style.visibility =
        "hidden";
    }
  }, [leagueId, rightCarousel, upcomingFixture]);

  const moveToSlide = (currentSlide, targetSlide, carousel) => {
    carousel.style.transform = `translateX(-${targetSlide.style.left})`;
    currentSlide.classList.remove("current-card");
    targetSlide.classList.add("current-card");
  };

  const handleLeftClick = (e) => {
    let currentSlide = "";
    for (let i = 0; i < rightCarousel.current.children.length; i++) {
      if (
        rightCarousel.current.children[i].className.includes("current-card")
      ) {
        currentSlide = rightCarousel.current.children[i];
        break;
      }
    }
    const prevSlide = currentSlide.previousElementSibling;
    if (prevSlide !== null) {
      moveToSlide(currentSlide, prevSlide, rightCarousel.current);
    }
    if (prevSlide.previousElementSibling === null) {
      previousArrowRef.current.style.visibility = "hidden";
    }
    if (nextArrowRef.current.style.visibility === "hidden") {
      nextArrowRef.current.style.visibility = "visible";
    }
  };

  const hanldeRightClick = () => {
    let currentSlide = "";
    for (let i = 0; i < rightCarousel.current.children.length; i++) {
      if (
        rightCarousel.current.children[i].className.includes("current-card")
      ) {
        currentSlide = rightCarousel.current.children[i];
        break;
      }
    }
    const nextSlide = currentSlide.nextElementSibling;
    if (nextSlide !== null) {
      moveToSlide(currentSlide, nextSlide, rightCarousel.current);
    }
    if (nextSlide.nextElementSibling === null) {
      nextArrowRef.current.style.visibility = "hidden";
    }
    if (previousArrowRef.current.style.visibility === "hidden") {
      previousArrowRef.current.style.visibility = "visible";
    }
  };

  if (isError1 || isError2 || isError3 || isError4) {
    return (
      <div className="error-container">
        Too many requests, come back after some time or another day. :(
      </div>
    );
  }

  return (
    <div>
      {isInfoLoading ||
      isUpcomingLeaguesLoading ||
      isUpcomingTournamnetLoading ? (
        <UpcomingSkeletonLoading />
      ) : (
        <div className="upcomingFixture-container">
          <div className="upcomingFixture-container__header">
            <Link
              className="link"
              to={`/${sport}/league/${leagueId || tournamentId}`}
            >
              <div className="upcomingFixture-container__header__league--details">
                <img
                  src={
                    leagueInfo?.response?.[0]?.logo ??
                    leagueInfo?.response?.[0]?.league?.logo ??
                    flagTournaments?.[leagueInfo?.data?.uniqueTournament?.name]
                  }
                  alt=""
                />
                <h5>
                  {leagueInfo?.response?.[0]?.name ??
                    leagueInfo?.response?.[0]?.league?.name ??
                    leagueInfo?.data?.uniqueTournament?.name}
                </h5>
              </div>
            </Link>
            <div className="upcomingFixture-container__header__arrows">
              <button
                ref={previousArrowRef}
                onClick={() => handleLeftClick()}
                className="navigate"
              >
                <FontAwesomeIcon className="icon" icon={faArrowLeft} />
              </button>
              <button
                ref={nextArrowRef}
                onClick={() => hanldeRightClick()}
                className="navigate"
              >
                <FontAwesomeIcon className="icon" icon={faArrowRight} />
              </button>
            </div>
          </div>
          <div className="upcomingFixture-container__content--container">
            <div
              ref={rightCarousel}
              className="upcomingFixture-container__content--carousel"
            >
              {upcomingFixture?.[leagueId]?.map((data, index) => (
                <Carousel
                  toggle={index === 0 ? true : false}
                  key={index}
                  sport={sport}
                  teams={data?.teams}
                  homeTeam={data?.homeTeam?.name}
                  awayTeam={data?.awayTeam?.name}
                  date={
                    data?.date ?? data?.fixture?.date ?? data?.startTimestamp
                  }
                  homeScores={getScoreValue(
                    data,
                    sport,
                    sport === "cricket" || sport === "american-football"
                      ? "homeScore"
                      : "home"
                  )}
                  awayScores={getScoreValue(
                    data,
                    sport,
                    sport === "cricket" || sport === "american-football"
                      ? "awayScore"
                      : "away"
                  )}
                  homeWickets={data?.homeScore?.innings?.inning1?.wickets}
                  awayWickets={data?.awayScore?.innings?.inning1?.wickets}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
