import { useQuery } from "@tanstack/react-query";
import { getClubs } from "@/lib/firestore";
import { queryKeys } from "./queryKeys";

export function useClubs(limit = 20) {
  return useQuery({
    queryKey: queryKeys.clubs.list(limit),
    queryFn: () => getClubs(limit),
    staleTime: 1000 * 60 * 5,
  });
}
