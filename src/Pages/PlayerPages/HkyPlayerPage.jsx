import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import moment from "moment";
import { instance } from "../../Api/Request";
import PlayerStatsTable from "../../Components/PlayerStatsTable/PlayerStatsTable";
import PlayerStatsFilter from "../../Components/PlayerStatsFilter/PlayerStatsFilter";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHockeyPuck } from "@fortawesome/free-solid-svg-icons";

export default function HkyPlayerPage() {
  const { id } = useParams();
  const [image, setImage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [tournamentId, setTournamentId] = useState(null);
  const [seasonId, setSeasonId] = useState(null);

  const hkyPosition = (pos) => {
    if (pos === "C") return "Center";
    else if (pos === "G") return "Goalkeeper";
    else if (pos === "W") return "Winger";
    else if (pos === "D") return "Defenseman";
  };

  const stats = [
    { property: "Appearances", value: "appearances" },
    { property: "Assists", value: "assists" },
    { property: "Goals", value: "goals" },
    { property: "Hits", value: "hits" },
    { property: "Blocked", value: "blocked" },
    { property: "Wins", value: "wins" },
    { property: "Saves", value: "saves" },
    { property: "Shifts", value: "shifts" },
    { property: "Shots", value: "shots" },
    { property: "Plus Minus", value: "plusMinus" },
    { property: "Games Started", value: "gamesStarted" },
    { property: "Shutouts", value: "shutouts" },
    { property: "Face Off Percentage", value: "faceOffPercentage" },
    { property: "Face Off Taken", value: "faceOffTaken" },
    { property: "Face Off Wins", value: "faceOffWins" },
    { property: "Goals Against", value: "goalsAgainst" },
    { property: "Overtime Goals", value: "overTimeGoals" },
    { property: "Powerplay Goals", value: "powerPlayGoals" },
    { property: "Short Handed Goals", value: "shortHandedGoals" },
    { property: "Goals Against Avg", value: "goalsAgainstAverage" },
    { property: "Game Winning Goals", value: "gameWinningGoals" },
    { property: "Points", value: "points" },
    { property: "Powerplay Points", value: "powerPlayPoints" },
    { property: "Short Handed Points", value: "shortHandedPoints" },
    { property: "Even Shots", value: "evenShots" },
    { property: "Powerplay Shots", value: "powerPlayShots" },
    { property: "Short Handed Shots", value: "shortHandedShots" },
    { property: "Shot Percentage", value: "shotPercentage" },
    { property: "Shots Against", value: "shotsAgainst" },
    { property: "Even Saves", value: "evenSaves" },
    { property: "Powerplay Saves", value: "powerPlaySaves" },
    { property: "Short Handed Saves", value: "shortHandedSaves" },
    { property: "Save Percentage", value: "savePercentage" },
    { property: "Time On Ice", value: "timeOnIce" },
    { property: "Penalty Minutes", value: "penaltyMinutes" },
    { property: "Even Time On Ice", value: "evenTimeOnIce" },
    { property: "Powerplay Time On Ice", value: "powerPlayTimeOnIce" },
    { property: "Short Handed Time On Ice", value: "shortHandedTimeOnIce" },
  ];

  const {
    data: playerData,
    isLoading: isPlayerLoading,
    isError: isError1,
  } = useQuery(
    ["playerInfo", id],
    () => instance.get(`/ice-hockey/player/${id}`).then((res) => res.data),
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
        .get(`/ice-hockey/player/${id}/statistics/season`)
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
          `/ice-hockey/player/${id}/tournament/${tournamentId}/season/${seasonId}/statistics/regularSeason`
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
            <img src={image} alt="" />
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
              {hkyPosition(playerData?.player?.position)}
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
                icon={faHockeyPuck}
                bounce
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
                    {stats.map((stat) => (
                      <PlayerStatsTable
                        key={stat?.property}
                        property={stat?.property}
                        value={
                          playerStatsData?.statistics?.[stat?.value] || "-"
                        }
                      />
                    ))}
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
