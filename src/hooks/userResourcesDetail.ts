import { useQuery } from "@tanstack/react-query";
import {getResource } from "@/lib/firestore";
import { queryKeys}  from "./queryKeys";

// ── User resources detail query ─────────────────────────────────────────────
/** * Custom hook to fetch the details of a specific resource by its ID.
 * This hook uses React Query to manage the data fetching and caching.
 *
 * @param id - The ID of the resource to fetch.
 * @return An object containing the resource data, loading state, and error state.
 * Example usage:
 * const { data: resource, isLoading, error } = userResourceDetail(resourceId);
 */
export function userResourceDetail(id: string) {
    // Note: This query is not expected to be used in multiple places, so we don't need to memoize the query key.
    // If we find ourselves needing to use this query in multiple places, we can consider memoizing the query key or using a custom hook that accepts the id as a parameter.
    return useQuery({
        queryKey: queryKeys.resources.detail(id),
        queryFn: () => getResource(id),
        enabled: !!id,
        staleTime: 1000 * 60 *5 //5 minutes
    });
}