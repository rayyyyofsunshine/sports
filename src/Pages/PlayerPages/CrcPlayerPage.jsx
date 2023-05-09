import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import moment from "moment";
import { instance } from "../../Api/Request";
import PlayerStatsTable from "../../Components/PlayerStatsTable/PlayerStatsTable";
import PlayerStatsFilter from "../../Components/PlayerStatsFilter/PlayerStatsFilter";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaseballBatBall } from "@fortawesome/free-solid-svg-icons";

export default function CrcPlayerPage() {
  const { id } = useParams();
  const [image, setImage] = useState("");
  const [statsType, setStatsType] = useState("Bat");
  const [activeIndex, setActiveIndex] = useState(0);
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [tournamentId, setTournamentId] = useState(null);
  const [seasonId, setSeasonId] = useState(null);

  const cricketPosition = (pos) => {
    if (pos === "BM") return "Batsman";
    else if (pos === "B") return "Bowler";
    else if (pos === "AR") return "All Rounder";
    else if (pos === "WK") return "Wicket Keeper";
  };

  const battingStats = [
    { property: "Appearances", value: "appearances" },
    { property: "Runs", value: "runsScored" },
    { property: "Fours", value: "fours" },
    { property: "Sixes", value: "sixes" },
    { property: "Avg", value: "avgRunsPerGame" },
    { property: "Fifties", value: "fifties" },
    { property: "Hundreds", value: "hundreds" },
    { property: "Strike Rate", value: "battingStrikeRate" },
    { property: "Highest Score", value: "highestScore" },
  ];

  const bowlingStats = [
    { property: "Appearances", value: "appearances" },
    { property: "Balls", value: "balls" },
    { property: "Avg", value: "avgWicketsPerGame" },
    { property: "Econ", value: "economy" },
    { property: "Wickets", value1: "avgWicketsPerGame", value2: "appearances" },
  ];

  const {
    data: playerData,
    isLoading: isPlayerLoading,
    isError: isError1,
  } = useQuery(
    ["playerInfo", id],
    () => instance.get(`/cricket/player/${id}`).then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  useEffect(() => {
    instance
      .get(`/player/${id}/image`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setImage(imageUrl);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, [id]);

  const {
    data: playerStatsSeasons,
    isLoading: isSeasonsLoading,
    isError: isError2,
  } = useQuery(
    ["playerSeason", id],
    () =>
      instance
        .get(`/cricket/player/${id}/statistics/seasons`)
        .then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
      onSuccess: (data) => {
        if (data) {
          setSeasonId(data?.uniqueTournamentSeasons?.[0]?.seasons?.[0]?.id);
          setTournamentId(
            data?.uniqueTournamentSeasons?.[0]?.uniqueTournament?.id
          );
        }
      },
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const {
    data: playerStatsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
    isError: isError3,
  } = useQuery(
    [
      "playerStats",
      playerStatsSeasons?.uniqueTournamentSeasons?.[0]?.seasons?.[0]?.id,
    ],
    () =>
      instance
        .get(
          `/cricket/player/${id}/tournament/${tournamentId}/season/${seasonId}/statistics/overall`
        )
        .then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      enabled:
        !!playerStatsSeasons?.uniqueTournamentSeasons?.[0]?.seasons?.[0]?.id,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  if (isError1 || isError2 || isError3) {
    return (
      <div className="error-container">
        Too many requests, come back after some time or another day. :(
      </div>
    );
  }

  return (
    <div className="playerPage-container">
      {isPlayerLoading ? (
        <InfoSkeletonLoading />
      ) : (
        <div className="info-container">
          <div
            style={{
              height: "inherit",
              justifyContent: "center",
            }}
            className="info-container__body"
          >
            <img src={image} alt="player-img" />
            <h2 style={{ fontSize: "1.25rem", padding: "0 0.5em" }}>
              {playerData?.player?.name}
            </h2>
            <p
              style={{
                textTransform: "capitalize",
                paddingTop: "0.25em",
                color: "#333",
              }}
            >
              {cricketPosition(playerData?.player?.position)}
            </p>
            <p>Jersey No: {playerData?.player?.jerseyNumber}</p>
            <p>Team: {playerData?.player?.team?.name}</p>
            <p style={{ paddingTop: "0.25em" }}>
              DOB:{" "}
              {moment
                .unix(playerData?.player?.dateOfBirthTimestamp)
                .utc()
                .format("DD-MM-YYYY")}
            </p>
            <p style={{ paddingTop: "0.25em" }}>
              Nationality: {playerData?.player?.country?.name}
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
          {isSeasonsLoading || isStatsLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faBaseballBatBall}
                flip
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : (
            <>
              <div className="playerPage-container__body__content--filter">
                {playerStatsSeasons?.uniqueTournamentSeasons?.length > 1 && (
                  <PlayerStatsFilter
                    seasons={playerStatsSeasons}
                    activeIndex={activeIndex}
                    seasonIndex={seasonIndex}
                    setActiveIndex={(activeIndex) =>
                      setActiveIndex(activeIndex)
                    }
                    setSeasonIndex={(seasonIndex) =>
                      setSeasonIndex(seasonIndex)
                    }
                    setSeasonId={(seasonId) => setSeasonId(seasonId)}
                    setTournamentId={(tournamentId) =>
                      setTournamentId(tournamentId)
                    }
                    refetchStats={refetchStats}
                  />
                )}
                {playerStatsSeasons?.uniqueTournamentSeasons?.length === 1 &&
                  playerStatsSeasons?.uniqueTournamentSeasons?.[0]?.seasons
                    ?.length > 1 && (
                    <PlayerStatsFilter
                      seasons={playerStatsSeasons}
                      activeIndex={activeIndex}
                      seasonIndex={seasonIndex}
                      setSeasonIndex={(seasonIndex) =>
                        setSeasonIndex(seasonIndex)
                      }
                      setSeasonId={(seasonId) => setSeasonId(seasonId)}
                      setTournamentId={(tournamentId) =>
                        setTournamentId(tournamentId)
                      }
                      refetchStats={refetchStats}
                    />
                  )}
              </div>
              <div className="playerPage-container__body__content--body">
                <div className="player__stats-container">
                  <div className="stats--table">
                    <div className="stats--table__filter">
                      <ul>
                        <li
                          onClick={() => setStatsType("Bat")}
                          className={statsType === "Bat" ? "active" : ""}
                        >
                          Batting
                        </li>
                        <li
                          onClick={() => setStatsType("Bowl")}
                          className={statsType === "Bowl" ? "active" : ""}
                        >
                          Bowling
                        </li>
                      </ul>
                    </div>
                    {statsType === "Bat" && (
                      <div className="stats--table__wrapper">
                        {battingStats?.map((stat) => (
                          <PlayerStatsTable
                            key={stat?.property}
                            property={stat?.property}
                            value={
                              playerStatsData?.statistics?.[stat?.value] || "-"
                            }
                          />
                        ))}
                      </div>
                    )}
                    {statsType === "Bowl" && (
                      <div className="stats--table__wrapper">
                        {bowlingStats?.map((stat) => (
                          <PlayerStatsTable
                            key={stat?.property}
                            property={stat?.property}
                            value={
                              playerStatsData?.statistics?.[stat?.value] !==
                              undefined
                                ? playerStatsData?.statistics?.[stat?.value]
                                : playerStatsData?.statistics?.[stat?.value1] *
                                  playerStatsData?.statistics?.[stat?.value2]
                            }
                          />
                        ))}
                      </div>
                    )}
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
