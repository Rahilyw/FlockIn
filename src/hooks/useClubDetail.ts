import { useQuery } from "@tanstack/react-query";
import { getClub } from "@/lib/firestore";
import { queryKeys } from "./queryKeys";

export function useClubDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.clubs.detail(id),
    queryFn: () => getClub(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
