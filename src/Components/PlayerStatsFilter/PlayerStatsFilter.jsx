import React from "react";

const PlayerStatsFilter = ({
  seasons,
  activeIndex,
  seasonIndex,
  setActiveIndex,
  setSeasonId,
  setSeasonIndex,
  setTournamentId,
  refetchStats,
}) => {
  return (
    <>
      <ul>
        {seasons?.uniqueTournamentSeasons?.length > 1 &&
          seasons?.uniqueTournamentSeasons?.map((tournament, i) => (
            <li
              onClick={() => {
                setActiveIndex(i);
                setTournamentId(tournament?.uniqueTournament?.id);
                setSeasonId(tournament?.seasons?.[0]?.id);
                setSeasonIndex(0);
                setTimeout(() => {
                  refetchStats();
                }, 0);
              }}
              className={activeIndex === i && "active"}
              key={tournament?.uniqueTournament?.id}
            >
              {tournament?.uniqueTournament?.name}
            </li>
          ))}
      </ul>
      {seasons?.uniqueTournamentSeasons?.[activeIndex]?.seasons?.length > 1 && (
        <ul style={{ padding: "2em 0" }}>
          {seasons?.uniqueTournamentSeasons?.[activeIndex]?.seasons?.map(
            (season, i) => (
              <li
                onClick={() => {
                  setSeasonIndex(i);
                  setSeasonId(season?.id);
                  setTournamentId(
                    seasons?.uniqueTournamentSeasons?.[0]?.uniqueTournament?.id
                  );
                  setTimeout(() => {
                    refetchStats();
                  }, 0);
                }}
                className={seasonIndex === i && "season--active"}
                key={season?.id}
              >
                {season?.name}
              </li>
            )
          )}
        </ul>
      )}
    </>
  );
};

export default PlayerStatsFilter;
