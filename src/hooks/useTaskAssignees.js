import { useQuery } from "@tanstack/react-query";
import { getTaskAssignees } from "../api/tasks";

export function useTaskAssignees() {
  return useQuery({
    queryKey: ["tasks", "assignees"],
    queryFn: getTaskAssignees,
    staleTime: 30_000,
  });
}
