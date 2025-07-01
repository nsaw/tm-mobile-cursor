import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Clock, CheckSquare, Square, Calendar, Filter, Check } from "lucide-react";
import { useLocation } from "wouter";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { ThoughtmarkWithBin } from "@shared/schema";
import { FloatingNewButton } from "@/components/floating-new-button";

export default function TasksPage() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<"all" | "overdue" | "active" | "completed">("all");
  const queryClient = useQueryClient();

  const { data: thoughtmarks = [], isLoading } = useQuery<ThoughtmarkWithBin[]>({
    queryKey: ["/api/thoughtmarks"],
  });

  const toggleCompletionMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest("PATCH", `/api/thoughtmarks/${taskId}/toggle-completion`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
    },
  });

  const tasks = thoughtmarks.filter(t => t.isTask);
  const now = new Date();
  
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case "overdue":
        return !task.isCompleted && task.dueDate && new Date(task.dueDate) < now;
      case "active":
        return !task.isCompleted && (!task.dueDate || new Date(task.dueDate) >= now);
      case "completed":
        return task.isCompleted;
      default:
        return true;
    }
  });

  const overdueTasks = tasks.filter(t => !t.isCompleted && t.dueDate && new Date(t.dueDate) < now);
  const activeTasks = tasks.filter(t => !t.isCompleted && (!t.dueDate || new Date(t.dueDate) >= now));
  const completedTasks = tasks.filter(t => t.isCompleted);

  const handleToggleCompletion = async (taskId: number) => {
    try {
      await toggleCompletionMutation.mutateAsync(taskId);
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
  };

  const renderTask = (task: ThoughtmarkWithBin) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < now && !task.isCompleted;
    
    return (
      <div
        key={task.id}
        className={`glass-surface transition-all duration-200 ${
          isOverdue
            ? "border-red-500/30"
            : task.isCompleted
            ? "border-green-500/30"
            : ""
        }`}
      >
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                onClick={() => handleToggleCompletion(task.id)}
                className="tm-completion-toggle"
                data-completed={task.isCompleted}
                title={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                aria-label={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleCompletion(task.id);
                  }
                }}
              >
                <Check className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-medium text-sm truncate ${
                    task.isCompleted ? "line-through text-gray-400" : "text-white"
                  }`}
                >
                  {task.title || "Untitled Task"}
                </h3>
                {task.content && (
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                    {task.content}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <span
                        className={`text-xs ${
                          isOverdue ? "text-red-400" : "text-gray-500"
                        }`}
                      >
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {task.binName && (
                    <span className="text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                      {task.binName}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation(`/thoughtmarks/${task.id}`)}
              className="text-gray-400 hover:text-white"
            >
              View
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <PageLayout title="Task Hit-List" showBackButton={true} showNewButton={false}>
        <div className="max-w-2xl mx-auto space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-surface">
              <div className="h-20 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent animate-pulse rounded-lg" />
            </div>
          ))}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Task Hit-List" showBackButton={true} showNewButton={false}>
      <div className="max-w-2xl mx-auto">
        {/* Filter Tabs with glass surface effect */}
        <div className="glass-surface mb-6">
          <div className="card-content">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">TASK FILTERS</div>
            <div className="flex gap-2 overflow-x-auto">
              {[
                { key: "all", label: "All", count: tasks.length },
                { key: "overdue", label: "Overdue", count: overdueTasks.length },
                { key: "active", label: "Active", count: activeTasks.length },
                { key: "completed", label: "Completed", count: completedTasks.length },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === key
                      ? "bg-[#C6D600] text-black"
                      : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="glass-surface">
            <div className="card-content text-center py-8">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {filter === "completed"
                  ? "No completed tasks"
                  : filter === "overdue"
                  ? "No overdue tasks"
                  : filter === "active"
                  ? "No active tasks"
                  : "No tasks found"}
              </h3>
              <p className="text-gray-400 text-sm">
                {filter === "all"
                  ? "Create a thoughtmark and mark it as a task to get started"
                  : "All caught up!"}
              </p>
              {filter === "all" && (
                <Button
                  onClick={() => setLocation("/thoughtmarks/create")}
                  className="mt-4 bg-[#C6D600] hover:bg-[#B5C100] text-black"
                >
                  Create Your First Task
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map(renderTask)}
          </div>
        )}
      </div>
      <FloatingNewButton />
    </PageLayout>
  );
}