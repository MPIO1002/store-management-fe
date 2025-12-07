import { useQuery } from "@tanstack/react-query";
import { StatisticApi } from "../lib/api";

const statisticApi = new StatisticApi();

export function useGetRevenueQuery(params?: { year?: number; month?: number; day?: number }) {
  return useQuery({
    queryKey: ["revenue", params],
    queryFn: async () => {
      const response = await statisticApi.getDailyRevenue({
        year: params?.year,
        month: params?.month,
        day: params?.day,
      });
      return response.data;
    },
    refetchInterval: 30000, // Auto refetch every 30 seconds
    refetchOnWindowFocus: true,
  });
}

export function useGetTopSellerProductQuery(top: number) {
  return useQuery({
    queryKey: ["top-seller", top],
    queryFn: async () => {
      const response = await statisticApi.getTopSellerProduct({ top });
      return response.data;
    },
    enabled: top > 0,
    refetchInterval: 30000, // Auto refetch every 30 seconds
    refetchOnWindowFocus: true,
  });
}
