import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../api/tasks";

export function useAllTasks({ status = "", search = "" } = {}) {
  return useQuery({
    queryKey: ["tasks", "all", { status, search }],
    queryFn: () => getAllTasks({ status, search, per_page: 100 }),
    staleTime: 10_000,
  });
}
