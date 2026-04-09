/**
 * date: 9.4.2026.
 * owner: lukasavic18@gmail.com
 *
 * Defines React Query mutations for creating, updating, deleting, and
 * moving tasks.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, updateTask, deleteTask, toggleTask } from "../api/tasks";

function useInvalidate() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  };
}

export function useCreateTask(options = {}) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: createTask,
    onSuccess: (...args) => {
      invalidate();
      options.onSuccess?.(...args);
    },
  });
}

export function useUpdateTask(options = {}) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, ...payload }) => updateTask(id, payload),
    onSuccess: (...args) => {
      invalidate();
      options.onSuccess?.(...args);
    },
  });
}

export function useDeleteTask(options = {}) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (...args) => {
      invalidate();
      options.onSuccess?.(...args);
    },
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTask,
    // Optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const snapshots = queryClient.getQueriesData({ queryKey: ["tasks"] });

      queryClient.setQueriesData({ queryKey: ["tasks"] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: task.status === "completed" ? "todo" : "completed",
                }
              : task,
          ),
        };
      });

      return { snapshots };
    },
    onError: (_err, _id, context) => {
      context?.snapshots?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
