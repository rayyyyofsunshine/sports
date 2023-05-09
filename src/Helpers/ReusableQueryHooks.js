import { useQuery } from "react-query";
import { instance } from "../Api/Request";
import { useContext } from "react";
import { DataContext } from "./DataContext";

export function useFetchBskData(date) {
  const { setBskData } = useContext(DataContext);

  const { isLoading, isError, refetch } = useQuery(
    ["bskFixturesData", date],
    async ({ queryKey: [_key, date] }) => {
      const response = await instance.get(`/basketball/matches/${date}`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setBskData((prevState) => ({
          ...prevState,
          [date]: data,
        }));
      },
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  return { isLoading, isError, refetch };
}

export function useFetchBsbData(date) {
  const { setBsbData } = useContext(DataContext);

  const { isLoading, isError, refetch } = useQuery(
    ["bsbFixturesData", date],
    async ({ queryKey: [_key, date] }) => {
      const response = await instance.get(`/baseball/matches/${date}`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setBsbData((prevState) => ({
          ...prevState,
          [date]: data,
        }));
      },
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  return { isLoading, isError, refetch };
}

export function useFetchHkyData(date) {
  const { setHkyData } = useContext(DataContext);

  const { isLoading, isError, refetch } = useQuery(
    ["hkyFixturesData", date],
    async ({ queryKey: [_key, date] }) => {
      const response = await instance.get(`/ice-hockey/matches/${date}`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setHkyData((prevState) => ({
          ...prevState,
          [date]: data,
        }));
      },
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  return { isLoading, isError, refetch };
}

export function useFetchRgyData(date) {
  const { setRgyData } = useContext(DataContext);

  const { isLoading, isError, refetch } = useQuery(
    ["rgyFixturesData", date],
    async ({ queryKey: [_key, date] }) => {
      const response = await instance.get(`/rugby/matches/${date}`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setRgyData((prevState) => ({
          ...prevState,
          [date]: data,
        }));
      },
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  return { isLoading, isError, refetch };
}
