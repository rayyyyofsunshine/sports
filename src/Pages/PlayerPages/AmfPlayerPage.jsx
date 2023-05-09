import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import moment from "moment";
import { instance } from "../../Api/Request";
import PlayerStatsTable from "../../Components/PlayerStatsTable/PlayerStatsTable";
import PlayerStatsFilter from "../../Components/PlayerStatsFilter/PlayerStatsFilter";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFootball } from "@fortawesome/free-solid-svg-icons";

export default function AmfPlayerPage() {
  const { id } = useParams();
  const [image, setImage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [tournamentId, setTournamentId] = useState(null);
  const [statsType, setStatsType] = useState("DB");
  const [seasonId, setSeasonId] = useState(null);

  const amfPosition = (pos) => {
    if (pos === "QB") return "Quarterback";
    else if (pos === "RB") return "Running Back";
    else if (pos === "TE") return "Tight End";
    else if (pos === "WR") return "Wide Receiver";
    else if (pos === "LB") return "Linebacker";
    else if (pos === "SAF") return "Safety";
    else if (pos === "K") return "Kicker";
    else if (pos === "P") return "Punter";
    else if (pos === "C") return "Center";
    else if (pos === "G") return "Guard";
    else if (pos === "T") return "Tackle";
    else if (pos === "FB") return "Full Back";
    else if (pos === "FS") return "Free Safety";
    else if (pos === "CB") return "Corner Back";
    else if (pos === "DB") return "Defensive Back";
    else if (pos === "DE") return "Defensive End";
    else if (pos === "DT") return "Defensive Tackle";
    else if (pos === "MLB") return "Middle Linebacker";
    else if (pos === "OLB") return "Outside Linebacker";
    else if (pos === "OT") return "Offensive Tackle";
    else if (pos === "OG") return "Offensive Guard";
  };

  const defensiveStats = [
    {
      property: "Assist Tackles",
      value: "defensiveAssistTackles",
    },
    { property: "Combine Tackles", value: "defensiveCombineTackles" },
    { property: "Extra Blocked", value: "defensiveExtraBlocked" },
    { property: "Forced Fumbles", value: "defensiveForcedFumbles" },
    { property: "Passes Defensed", value: "defensivePassesDefensed" },
    { property: "Punt Blocked", value: "defensivePuntBlocked" },
    { property: "Sacks", value: "defensiveSacks" },
    { property: "Safeties", value: "defensiveSafeties" },
    { property: "Total Tackles", value: "defensiveTotalTackles" },
  ];

  const fumblesStats = [
    {
      property: "Fumbles",
      value: "fumblesFumbles",
    },
    { property: "Fumbles Outbounds", value: "fumblesOutbounds" },
    { property: "Fumbles Touchback", value: "fumblesTouchback" },
    { property: "Lost", value: "fumblesLost" },
    { property: "Recovery", value: "fumblesRecovery" },
    { property: "Safety", value: "fumblesSafety" },
    {
      property: "Teammate Fumble Recovery",
      value: "fumblesTeammateFumbleRecovery",
    },
    {
      property: "Teammate Fumble Touchdowns",
      value: "fumblesTeammateFumbleTd",
    },
    { property: "Teammate Fumble Yards", value: "fumblesTeammateFumbleYards" },
    { property: "Touchdown Returns", value: "fumblesTouchdownReturns" },
  ];

  const passingStats = [
    {
      property: "Attempts",
      value: "passingAttempts",
    },
    { property: "Completion", value: "passingCompletion" },
    { property: "Completion Percentage", value: "passingCompletionPercentage" },
    { property: "First Down", value: "passingFirstDown" },
    { property: "First Down Percentage", value: "passingFirstDownPercentage" },
    { property: "Forty Plus", value: "passingFortyPlus" },
    { property: "Interceptions", value: "passingInterceptions" },
    {
      property: "Interception Percentage",
      value: "passingInterceptionPercentage",
    },
    { property: "Longest", value: "passingLongest" },
    { property: "Passer Rating", value: "passingPasserRating" },
    { property: "Sacked", value: "passingSacked" },
    { property: "Sacked Yards Lost", value: "passingSackedYardsPerLost" },
    { property: "Touchdown", value: "passingTouchdown" },
    {
      property: "Touchdown Interception Ratio",
      value: "passingTouchdownInterceptionRatio",
    },
    { property: "Touchdown Percentage", value: "passingTouchdownPercentage" },
    { property: "Yards", value: "passingYards" },
    { property: "Net Yards", value: "passingNetYards" },
    { property: "Yards Lost Per Sack", value: "passingYardsLostPerSack" },
    { property: "Yards Per Attempt", value: "passingYardsPerAttempt" },
    { property: "Yards Per Game", value: "passingYardsPerGame" },
  ];

  const receivingStats = [
    { property: "First Downs", value: "rushing" },
    {
      property: "First Downs Percentage",
      value: "receivingFirstDownsPercentage",
    },
    { property: "Forty Plus", value: "receivingFortyPlus" },
    { property: "Fumbles", value: "receivingFumbles" },
    { property: "Longest", value: "receivingLongest" },
    { property: "Twenty Plus", value: "receivingTwentyPlus" },
    { property: "Receptions", value: "receivingReceptions" },
    { property: "Games Finished", value: "receivingGamesFinished" },
    { property: "Targets", value: "receivingTargets" },
    { property: "Touchdowns", value: "receivingTouchdowns" },
    { property: "Yards", value: "receivingYards" },
    { property: "Yards Per Reception", value: "receivingYardsPerReception" },
  ];

  const rushingStats = [
    { property: "First Downs", value: "rushingFirstDowns" },
    {
      property: "First Downs Percentage",
      value: "rushingFirstDownsPercentage",
    },
    { property: "Forty Plus", value: "rushingFortyPlus" },
    { property: "Fumbles", value: "rushingFumbles" },
    { property: "Longest", value: "rushingLongest" },
    { property: "Twenty Plus", value: "rushingTwentyPlus" },
    { property: "Touchdowns", value: "rushingTouchdowns" },
    { property: "Yards", value: "rushingYards" },
    { property: "Yards Per Attempt", value: "rushingYardsPerAttempt" },
    { property: "Yards Per Game", value: "rushingYardsPerGame" },
  ];

  const {
    data: playerData,
    isLoading: isPlayerLoading,
    isError: isError1,
  } = useQuery(
    ["playerInfo", id],
    () =>
      instance.get(`/american-football/player/${id}`).then((res) => res.data),
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
        .get(`/american-football/player/${id}/statistics/season`)
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
          `/american-football/player/${id}/tournament/${tournamentId}/season/${seasonId}/statistics/regularSeason`
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
              {amfPosition(playerData?.player?.position)}
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
                icon={faFootball}
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
                          onClick={() => setStatsType("DB")}
                          className={
                            [
                              "DT",
                              "DE",
                              "DB",
                              "LB",
                              "NT",
                              "OT",
                              "T",
                              "SS",
                              "FS",
                              "SAF",
                              "CB",
                            ].includes(statsType)
                              ? "active"
                              : ""
                          }
                        >
                          Defense
                        </li>
                        <li
                          onClick={() => setStatsType("F")}
                          className={["F"].includes(statsType) ? "active" : ""}
                        >
                          Fumbles
                        </li>
                        <li
                          onClick={() => setStatsType("C")}
                          className={
                            ["K", "C", "G", "T", "P"].includes(statsType)
                              ? "active"
                              : ""
                          }
                        >
                          Passing
                        </li>
                        <li
                          onClick={() => setStatsType("WR")}
                          className={
                            ["PR", "WR", "TE", "RB"].includes(statsType)
                              ? "active"
                              : ""
                          }
                        >
                          Receiving
                        </li>
                        <li
                          onClick={() => setStatsType("QB")}
                          className={
                            ["DE", "OLB", "MLB", "QB"].includes(statsType)
                              ? "active"
                              : ""
                          }
                        >
                          Rushing
                        </li>
                      </ul>
                    </div>
                    {[
                      "DT",
                      "DE",
                      "DB",
                      "MLB",
                      "OLB",
                      "LB",
                      "NT",
                      "OT",
                      "T",
                      "SS",
                      "FS",
                      "CB",
                    ].includes(statsType) && (
                      <div className="stats--table__wrapper">
                        {defensiveStats?.map((stat) => (
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
                    {["DE", "OLB", "MLB", "QB"].includes(statsType) && (
                      <div className="stats--table__wrapper">
                        {rushingStats?.map((stat) => (
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
                    {["PR", "WR", "TE", "RB"].includes(statsType) && (
                      <div className="stats--table__wrapper">
                        {receivingStats?.map((stat) => (
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
                    {["K", "C", "G", "T", "P"].includes(statsType) && (
                      <div className="stats--table__wrapper">
                        {passingStats?.map((stat) => (
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
                    {["F"].includes(statsType) && (
                      <div className="stats--table__wrapper">
                        {fumblesStats?.map((stat) => (
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
