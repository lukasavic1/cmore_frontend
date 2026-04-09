/**
 * date: 9.4.2026.
 * owner: lukasavic18@gmail.com
 *
 * Wraps the paginated task query in a reusable React Query hook.
 */

import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api/tasks";

export function useTasks({
  status,
  search,
  page,
  per_page,
  assignee,
  unassigned,
}) {
  return useQuery({
    queryKey: [
      "tasks",
      { status, search, page, per_page, assignee, unassigned },
    ],
    queryFn: () =>
      getTasks({ status, search, page, per_page, assignee, unassigned }),
    placeholderData: (prev) => prev, // keep previous data while fetching next page
  });
}
