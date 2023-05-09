import moment from "moment";

const api_key = process.env.REACT_APP_API_KEY;

const todaysDate = moment().format("YYYY-MM-DD").toString();

export const getFutCountries = {
  method: "get",
  url: `https://v3.football.api-sports.io/countries`,
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutFixturesByDate = {
  method: "get",
  url: `https://v3.football.api-sports.io/fixtures`,
  params: {
    date: todaysDate,
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutLeagueInfo = {
  method: "get",
  url: `https://v3.football.api-sports.io/leagues`,
  params: {
    id: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutLeagues = {
  method: "get",
  url: `https://v3.football.api-sports.io/leagues`,
  params: {
    country: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutDetailFixtures = {
  method: "get",
  url: `https://v3.football.api-sports.io/fixtures`,
  params: {
    id: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getUpcomingFutFixturesByLeague = {
  method: "get",
  url: `https://v3.football.api-sports.io/fixtures`,
  params: {
    league: "",
    next: "5",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getPreviousFutFixturesByLeague = {
  method: "get",
  url: `https://v3.football.api-sports.io/fixtures`,
  params: {
    league: "",
    last: "5",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutFixturesByLeague = {
  method: "get",
  url: `https://v3.football.api-sports.io/fixtures`,
  params: {
    season: "",
    league: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutFixturesByTeam = {
  method: "get",
  url: `https://v3.football.api-sports.io/fixtures`,
  params: {
    season: "",
    team: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutStandingsByLeague = {
  method: "get",
  url: `https://v3.football.api-sports.io/standings`,
  params: {
    season: "",
    league: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutStandingsByTeam = {
  method: "get",
  url: `https://v3.football.api-sports.io/standings`,
  params: {
    season: "",
    team: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutTopScorersByLeague = {
  method: "get",
  url: `https://v3.football.api-sports.io/players/topscorers`,
  params: { season: "", league: "" },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.io",
  },
};

export const getFutTopAssistsByLeague = {
  method: "get",
  url: `https://v3.football.api-sports.io/players/topassists`,
  params: { season: "", league: "" },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.io",
  },
};

export const getFutTeamInfo = {
  method: "get",
  url: `https://v3.football.api-sports.io/teams`,
  params: {
    id: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutTeamSeasons = {
  method: "get",
  url: `https://v3.football.api-sports.io/teams/seasons`,
  params: {
    team: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutTeamPlayers = {
  method: "get",
  url: `https://v3.football.api-sports.io/players/squads`,
  params: {
    team: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutStatsInfo = {
  method: "get",
  url: `https://v3.football.api-sports.io/teams/statistics`,
  params: {
    team: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutPlayerSeasons = {
  method: "get",
  url: `https://v3.football.api-sports.io/players/seasons`,
  params: {
    player: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};

export const getFutPlayerStats = {
  method: "get",
  url: `https://v3.football.api-sports.io/players`,
  params: {
    id: "",
    season: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v3.football.api-sports.i0",
  },
};
