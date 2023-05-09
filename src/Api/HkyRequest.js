import moment from "moment";

const api_key = process.env.REACT_APP_API_KEY;

const todaysDate = moment().format("YYYY-MM-DD").toString();

export const getHkyCountries = {
  method: "get",
  url: `https://v1.hockey.api-sports.io/countries`,
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.hockey.api-sports.io",
  },
};

export const getHkyLeagues = {
  method: "get",
  url: `https://v1.hockey.api-sports.io/leagues`,
  params: {
    country: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.hockey.api-sports.io",
  },
};
export const getHkySeasons = {
  method: "get",
  url: `https://v1.hockey.api-sports.io/seasons`,
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.hockey.api-sports.io",
  },
};

export const getHkyLeagueInfo = {
  method: "get",
  url: `https://v1.hockey.api-sports.io/leagues`,
  params: {
    id: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.hockey.api-sports.io",
  },
};

export const getHkyTeamInfo = {
  method: "get",
  url: `https://v1.hockey.api-sports.io/teams`,
  params: {
    id: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.hockey.api-sports.io",
  },
};

export const getHkyTeamStats = {
  method: "get",
  url: `https://v1.hockey.api-sports.io/teams/statistics`,
  params: {
    league: "",
    team: "",
    season: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.hockey.api-sports.io",
  },
};

export const getHkyFixturesByDate = {
  method: "get",
  url: `https://v1.hockey.api-sports.io/games`,
  params: {
    date: todaysDate,
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.hockey.api-sports.io",
  },
};

export const getHkyFixturesByLeague = {
  method: "get",
  url: `https://v1.hockey.api-sports.io/games`,
  params: {
    season: "",
    league: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.hockey.api-sports.io",
  },
};

export const getHkyFixturesByTeam = {
  method: "get",
  url: `https://v1.hockey.api-sports.io/games`,
  params: {
    team: "",
    season: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.hockey.api-sports.io",
  },
};

export const getUpcomingHkyFixturesByLeagues = {
  method: "get",
  url: `https://v1.hockey.api-sports.io/games`,
  params: {
    season: "",
    league: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.hockey.api-sports.io",
  },
};

export const getHkyStandingsByLeague = {
  method: "get",
  url: `https://v1.hockey.api-sports.io/standings`,
  params: {
    season: "",
    league: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.hockey.api-sports.io",
  },
};
