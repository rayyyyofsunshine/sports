import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import moment from "moment";
import { instance } from "../../Api/Request";
import PlayerStatsTable from "../../Components/PlayerStatsTable/PlayerStatsTable";
import PlayerStatsFilter from "../../Components/PlayerStatsFilter/PlayerStatsFilter";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { faBaseball } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BsbPlayerPage() {
  const { id } = useParams();
  const [image, setImage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [tournamentId, setTournamentId] = useState(null);
  const [statsType, setStatsType] = useState("P");
  const [seasonId, setSeasonId] = useState(null);

  const bsbPosition = (pos) => {
    if (pos === "P") return "Pitcher";
    else if (pos === "LF") return "Left Fielder";
    else if (pos === "RF") return "Right Fielder";
    else if (pos === "CF") return "Center Fielder";
    else if (pos === "SS") return "Shortstop";
    else if (pos === "1B") return "1st Baseman";
    else if (pos === "2B") return "2nd Baseman";
    else if (pos === "3B") return "3rd Baseman";
    else if (pos === "C") return "Center";
  };

  const hittingStats = [
    {
      property: "Plate Appearences",
      value: "hittingPlateAppearances",
    },
    { property: "At Bats", value: "hittingAtBats" },
    { property: "Runs", value: "hittingRuns" },
    { property: "Hits", value: "hittingHits" },
    { property: "Doubles", value: "hittingDoubles" },
    { property: "Triples", value: "hittingTriples" },
    { property: "Home Runs", value: "hittingHomeRuns" },
    { property: "Runs Batted In", value: "hittingRbi" },
    { property: "Hit By Pitch", value: "hittingHitByPitch" },
    { property: "Stolen Bases", value: "hittingStolenBases" },
    { property: "Caught Stealing", value: "hittingCaughtStealing" },
    { property: "Sacrifice Bunts", value: "hittingSacBunts" },
    { property: "Sacrifice Flies", value: "hittingSacFlies" },
    {
      property: "Ground Into Double Play",
      value: "hittingGroundIntoDoublePlay",
    },
    { property: "Ground Out / Air Out", value: "hittingGroundOutsToAirouts" },
    { property: "Base On Balls", value: "hittingBaseOnBalls" },
    { property: "Intentional Walks", value: "hittingIntentionalWalks" },
    { property: "Strike Outs", value: "hittingStrikeOuts" },
    { property: "Batting Avg", value: "hittingAvg" },
    { property: "Batting Avg On Balls In Play (BABIP)", value: "hittingBabip" },
    { property: "On Base Percentage", value: "hittingObp" },
    { property: "Slugging Percentage", value: "hittingOps" },
    {
      property: "At Bats / Home Run",
      value1: "hittingAtBats",
      value2: "hittingHomeRuns",
    },
    {
      property: "walk To Strikeout Rate",
      value1: "hittingIntentionalWalks",
      value2: "hittingStrikeOuts",
    },
    {
      property: "Walk Percentage",
      value1: "hittingIntentionalWalks",
      value2: "hittingPlateAppearances",
    },
    {
      property: "Strike Outs Percentage",
      value1: "hittingStrikeOuts",
      value2: "hittingPlateAppearances",
    },
  ];

  const pitchingStats = [
    { property: "Total Batters Faced", value: "pitchingBattersFaced" },
    { property: "No. of Pitches", value: "pitchingNumberOfPitches" },
    { property: "Wins", value: "pitchingWins" },
    { property: "Losses", value: "pitchingLosses" },
    { property: "Pitches Per Inning", value: "pitchingPitchesPerInning" },
    { property: "Earned Run Avg", value: "pitchingEra" },
    { property: "Games Started", value: "pitchingGamesStarted" },
    { property: "Games Finished", value: "pitchingGamesFinished" },
    { property: "Shutouts", value: "pitchingShutouts" },
    { property: "Saves", value: "pitchingSaves" },
    { property: "Save Oppurtunities", value: "pitchingSaveOpputunities" },
    { property: "Holds", value: "pitchingHolds" },
    { property: "Hits Batsman", value: "pitchingHitsBatsmen" },
    { property: "Intentional Walks", value: "pitchingIntentionalWalks" },
    { property: "Strike Outs", value: "pitchingStrikeOuts" },
    { property: "Wild Pitches", value: "pitchingWildPitches" },
    { property: "Balks", value: "pitchingBalks" },
    {
      property: "Ground Out Into Double Play",
      value: "pitchingGroundIntoDoublePlay",
    },
    { property: "Ground Out / Air Out", value: "pitchingGroundOutsToAirouts" },
    { property: "Strike Outs Per 9IP", value: "pitchingStrikeoutsPer9Inn" },
    { property: "Walks Per 9IP", value: "pitchingWalksPer9Inn" },
    { property: "Strikeout to Walk Rate", value: "pitchingStrikeoutWalkRatio" },
    { property: "Stolen Bases", value: "pitchingStolenBases" },
    { property: "Caught Stealing", value: "pitchingCaughtStealing" },
    { property: "Pick Offs", value: "pitchingPickoffs" },
    { property: "WHIP", value: "pitchingWhip" },
    { property: "Batting Avg Againts", value: "pitchingAvg" },
  ];

  const fieldingStats = [
    { property: "Games Started", value: "fieldingGamesStarted" },
    { property: "Assists", value: "fieldingAssists" },
    { property: "Chances", value: "fieldingChances" },
    { property: "Errors", value: "fieldingErrors" },
    { property: "Innings", value: "fieldingInnings" },
    { property: "Put Outs", value: "fieldingPutOuts" },
    { property: "Fielding", value: "fieldingFielding" },
    { property: "Double Plays", value: "fieldingDoublePlays" },
    { property: "Range Factor Per Game", value: "fieldingRangeFactorPerGame" },
  ];

  const {
    data: playerData,
    isLoading: isPlayerLoading,
    isError: isError1,
  } = useQuery(
    ["playerInfo", id],
    () => instance.get(`/baseball/player/${id}`).then((res) => res.data),
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
        .get(`/baseball/player/${id}/statistics/seasons`)
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
          `/baseball/player/${id}/tournament/${tournamentId}/season/${seasonId}/statistics/regularSeason`
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
            <h2 style={{ fontSize: "1.25rem", padding: "0.5em 0.5em 0" }}>
              {playerData?.player?.name}
            </h2>
            <p
              style={{
                textTransform: "capitalize",
                paddingTop: "0.25em",
                color: "#333",
              }}
            >
              {bsbPosition(playerData?.player?.position)}
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
                icon={faBaseball}
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
                    <div className="stats--table__filter">
                      <ul>
                        <li
                          onClick={() => setStatsType("1B")}
                          className={
                            ["1B", "2B", "3B", "CF", "LF", "RF"].includes(
                              statsType
                            )
                              ? "active"
                              : ""
                          }
                        >
                          Hitting
                        </li>
                        <li
                          onClick={() => setStatsType("P")}
                          className={statsType === "P" ? "active" : ""}
                        >
                          Pitching
                        </li>
                        <li
                          onClick={() => setStatsType("C")}
                          className={
                            ["C", "SS"].includes(statsType) ? "active" : ""
                          }
                        >
                          Fielding
                        </li>
                      </ul>
                    </div>
                    {["1B", "2B", "3B", "CF", "LF", "RF"].includes(
                      statsType
                    ) && (
                      <div className="stats--table__wrapper">
                        {hittingStats?.map((stat) => (
                          <PlayerStatsTable
                            key={stat?.property}
                            property={stat?.property}
                            value={
                              playerStatsData?.statistics?.[stat?.value] ===
                              undefined
                                ? Math.round(
                                    (playerStatsData?.statistics?.[
                                      stat?.value1
                                    ] /
                                      playerStatsData?.statistics?.[
                                        stat?.value2
                                      ]) *
                                      100
                                  ) / 100
                                : playerStatsData?.statistics?.[stat?.value] ||
                                  "-"
                            }
                          />
                        ))}
                      </div>
                    )}
                    {statsType === "P" && (
                      <div className="stats--table__wrapper">
                        {pitchingStats?.map((stat) => (
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
                    {["C", "SS"].includes(statsType) && (
                      <div className="stats--table__wrapper">
                        {fieldingStats?.map((stat) => (
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
