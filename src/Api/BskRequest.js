import moment from "moment";

const api_key = process.env.REACT_APP_API_KEY;

const todaysDate = moment().format("YYYY-MM-DD").toString();

export const getBskCountries = {
  method: "get",
  url: `https://v1.basketball.api-sports.io/countries`,
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.basketball.api-sports.io",
  },
};

export const getBskLeagues = {
  method: "get",
  url: `https://v1.basketball.api-sports.io/leagues`,
  params: {
    country: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.basketball.api-sports.io",
  },
};

export const getBskLeagueInfo = {
  method: "get",
  url: `https://v1.basketball.api-sports.io/leagues`,
  params: {
    id: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.basketball.api-sports.io",
  },
};

export const getBskTeamInfo = {
  method: "get",
  url: `https://v1.basketball.api-sports.io/teams`,
  params: {
    id: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.basketball.api-sports.io",
  },
};

export const getBskTeamSeasons = {
  method: "get",
  url: `https://v1.basketball.api-sports.io/seasons`,
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.basketball.api-sports.io",
  },
};

export const getBskTeamStats = {
  method: "get",
  url: `https://v1.basketball.api-sports.io/statistics`,
  params: {
    team: "",
    league: "",
    season: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.basketball.api-sports.io",
  },
};

export const getBskFixturesByDate = {
  method: "get",
  url: `https://v1.basketball.api-sports.io/games`,
  params: {
    date: todaysDate,
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.basketball.api-sports.io",
  },
};

export const getBskFixturesByLeague = {
  method: "get",
  url: `https://v1.basketball.api-sports.io/games`,
  params: {
    league: "",
    season: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.basketball.api-sports.io",
  },
};

export const getBskFixturesByTeam = {
  method: "get",
  url: `https://v1.basketball.api-sports.io/games`,
  params: {
    team: "",
    season: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.basketball.api-sports.io",
  },
};

export const getBskStandingsByLeague = {
  method: "get",
  url: `https://v1.basketball.api-sports.io/standings`,
  params: {
    league: "",
    season: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.basketball.api-sports.io",
  },
};

export const getUpcomingBskFixturesByLeagues = {
  method: "get",
  url: `https://v1.basketball.api-sports.io/games`,
  params: {
    league: "",
    season: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.basketball.api-sports.io",
  },
};
