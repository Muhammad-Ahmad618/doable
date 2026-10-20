"use client";

import { GeneratedSubTask, Priority, Status } from "@/types/task";
import {
  AlertTriangle,
  CheckSquare,
  GripVertical,
  ListTodo,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  useDeleteSubtask,
  useGenerateTaskBreakDown,
  useGetSubTasks,
  useSaveSubtasks,
  useToggleSubtask,
} from "@/hooks/user/tasks";
import { getPriorityColor } from "./priority-color";
import { ApiSubTask } from "@/types/task";

const normalizeSubtasks = (raw: ApiSubTask[]): GeneratedSubTask[] =>
  raw.map((item, index) => ({
    task_id: String(item.task_id ?? item.id ?? `subtask-${index}`),
    title: item.title ?? "",
    description: item.description ?? "",
    priority: item.priority ?? "medium",
    status: item.status ?? (item.completed ? "completed" : "pending"),
  }));

export const AiTaskBreakDown = ({ task_id }: { task_id: number }) => {
  const [subtasks, setSubtasks] = useState<GeneratedSubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newSubtaskDesc, setNewSubtaskDesc] = useState("");
  const [newSubtaskPriority, setNewSubtaskPriority] =
    useState<Priority>("medium");
  const [showAddForm, setShowAddForm] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showRegenDialog, setShowRegenDialog] = useState(false);

  // ── Server data ──────────────────────────────────────────────────────────
  const { data: serverSubtasks, isLoading: isLoadingSubtasks } =
    useGetSubTasks(task_id);

  // Sync server → local state during render (avoids useEffect cascade).
  // React docs pattern: track the previous value and update inline.
  const [prevServerSubtasks, setPrevServerSubtasks] = useState(serverSubtasks);
  if (
    prevServerSubtasks !== serverSubtasks &&
    serverSubtasks &&
    serverSubtasks.length > 0
  ) {
    setPrevServerSubtasks(serverSubtasks);
    setSubtasks(normalizeSubtasks(serverSubtasks as ApiSubTask[]));
  }

  // ── Mutations ────────────────────────────────────────────────────────────
  const { mutateAsync: generatedSubtasks, isPending: isGenerating } =
    useGenerateTaskBreakDown();

  const { mutate: saveSubtasks, isPending: isSaving } = useSaveSubtasks();
  const { mutate: updateSubtaskStatus } = useToggleSubtask();
  const { mutate: deleteSubtask } = useDeleteSubtask();

  // ── Drag & drop ──────────────────────────────────────────────────────────
  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragOverIndex(null);
      return;
    }
    setSubtasks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // ── Computed ─────────────────────────────────────────────────────────────
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(
    (s) => s.status === "completed",
  ).length;
  const completionPercentage =
    totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

  // ── Generate breakdown ───────────────────────────────────────────────────
  const runGenerate = async (regen?: boolean) => {
    try {
      const result = await generatedSubtasks({ task_id, regen });
      if (result && result.length > 0) {
        setSubtasks(normalizeSubtasks(result as ApiSubTask[]));
      }
    } catch {
      // API signals breakdown already exists — show regen confirm dialog
      setShowRegenDialog(true);
    }
  };

  const handleGenerateClick = () => {
    // If subtasks already loaded, ask before overwriting
    if (subtasks.length > 0) {
      setShowRegenDialog(true);
    } else {
      runGenerate();
    }
  };

  const handleConfirmRegen = async () => {
    setShowRegenDialog(false);
    await runGenerate(true);
  };

  // ── Toggle ───────────────────────────────────────────────────────────────
  const toggleSubtask = (subtask_id?: string) => {
    if (!subtask_id) return;

    const current = subtasks.find((s) => s.task_id === subtask_id);
    const newStatus = current?.status === "completed" ? "pending" : "completed";

    setSubtasks((prev) =>
      prev.map((s) =>
        s.task_id === subtask_id ? { ...s, status: newStatus } : s,
      ),
    );

    const numericId = Number(subtask_id);
    if (!isNaN(numericId)) {
      updateSubtaskStatus({
        task_id,
        subtask_id: numericId,
        status: newStatus,
      });
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDeleteSubtask = (subtask_id?: string) => {
    if (!subtask_id) return;
    const numericId = Number(subtask_id);
    setSubtasks((prev) => prev.filter((sub) => sub.task_id !== subtask_id));
    if (!isNaN(numericId)) {
      deleteSubtask({ task_id, subtask_id: numericId });
    }
  };

  // ── Add manually ─────────────────────────────────────────────────────────
  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSub: GeneratedSubTask = {
      task_id: `subtask-manual-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      description: newSubtaskDesc.trim(),
      priority: newSubtaskPriority,
      status: "pending",
    };

    setSubtasks((prev) => [...prev, newSub]);
    setNewSubtaskTitle("");
    setNewSubtaskDesc("");
    setNewSubtaskPriority("medium");
    setShowAddForm(false);
    toast.success("Subtask added");
  };

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSaveSubtasks = () => {
    if (subtasks.length === 0) return;
    saveSubtasks({ task_id, subtasks });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 mt-2">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 animate-pulse" />
          AI Task Breakdown
        </label>

        {!isGenerating && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateClick}
            className="h-8 text-xs font-semibold text-primary hover:text-primary hover:bg-primary/5 border-primary/20 hover:border-primary/40 rounded-lg cursor-pointer bg-linear-to-r from-primary/5 to-purple-500/5 hover:from-primary/10 hover:to-purple-500/10 transition-all duration-300"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
            {subtasks.length > 0 ? "Regenerate" : "Generate Breakdown"}
          </Button>
        )}
      </div>

      {/* ── Regen confirm dialog ─────────────────────────────────────────── */}
      {showRegenDialog && (
        <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5 h-7 w-7 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">
                Subtasks already generated
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                A breakdown already exists for this task. Do you want to
                regenerate and replace all current subtasks?
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowRegenDialog(false)}
              className="shrink-0 text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowRegenDialog(false)}
              className="h-7 text-xs rounded-md"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmRegen}
              disabled={isGenerating}
              className="h-7 px-3 text-xs font-semibold rounded-md bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
            >
              {isGenerating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Yes, Regenerate
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ── Loading skeleton (fetching persisted subtasks) ───────────────── */}
      {isLoadingSubtasks && (
        <div className="border border-border/60 rounded-xl p-5 bg-muted/10 space-y-3">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Loading subtasks...
            </span>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-9 rounded-lg bg-muted/30 animate-pulse"
                style={{ opacity: 1 - i * 0.2 }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Generating AI breakdown ──────────────────────────────────────── */}
      {isGenerating && (
        <div className="border border-border/60 rounded-xl p-5 bg-muted/10 space-y-3">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Generating AI task breakdown...
            </span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-purple-500 w-[65%] animate-pulse" />
          </div>
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {!isLoadingSubtasks && !isGenerating && subtasks.length === 0 && (
        <div className="border border-dashed border-border/60 rounded-xl p-6 bg-muted/5 flex flex-col items-center justify-center gap-3 text-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ListTodo className="h-5 w-5 text-primary/60" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-foreground">
              No subtasks found
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
              Generate an AI-powered breakdown to split this task into
              actionable steps.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => runGenerate()}
            className="h-8 px-4 text-xs font-semibold rounded-lg cursor-pointer mt-1"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Generate Breakdown
          </Button>
        </div>
      )}

      {/* ── Subtask checklist ────────────────────────────────────────────── */}
      {!isLoadingSubtasks && subtasks.length > 0 && (
        <div className="border border-border/60 rounded-xl p-4 bg-muted/5 space-y-4 transition-all">
          {/* Progress indicator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-muted-foreground">
                Subtask progress ({completedSubtasks}/{totalSubtasks})
              </span>
              <span className="font-semibold text-primary">
                {completionPercentage}% Completed
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out bg-linear-to-r from-primary to-purple-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Subtask list */}
          <div className="space-y-2">
            {subtasks.map((sub, index) => (
              <div key={sub.task_id || index}>
                {/* Drop indicator above */}
                {dragOverIndex === index &&
                  dragIndex !== null &&
                  dragIndex > index && (
                    <div className="h-0.5 mx-1 rounded-full bg-primary/60 mb-1 transition-all" />
                  )}

                <div
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-start gap-2.5 group/subitem p-2.5 rounded-lg border border-border/40 bg-background/50 hover:bg-background/90 transition-all select-none ${
                    dragIndex === index
                      ? "opacity-40 scale-[0.98] border-primary/40"
                      : "hover:border-border"
                  }`}
                >
                  {/* Drag handle */}
                  <span className="mt-1 opacity-0 group-hover/subitem:opacity-100 text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing transition shrink-0">
                    <GripVertical className="h-4 w-4" />
                  </span>

                  {/* Toggle completion */}
                  <button
                    type="button"
                    onClick={() => toggleSubtask(sub.task_id)}
                    className="mt-0.5 text-muted-foreground hover:text-primary transition shrink-0 cursor-pointer"
                  >
                    {sub?.status === "completed" ? (
                      <CheckSquare className="h-4.5 w-4.5 text-primary fill-primary/10" />
                    ) : (
                      <Square className="h-4.5 w-4.5" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-semibold text-foreground leading-normal ${
                          sub?.status === "completed"
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {sub.title}
                      </span>

                      {/* Priority badge */}
                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getPriorityColor(
                          sub.priority,
                        )}`}
                      >
                        {sub.priority}
                      </span>
                    </div>

                    {/* Description */}
                    {sub.description && (
                      <p
                        className={`text-xs text-muted-foreground leading-relaxed ${
                          sub?.status === "completed"
                            ? "line-through opacity-75"
                            : ""
                        }`}
                      >
                        {sub.description}
                      </p>
                    )}
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(sub.task_id)}
                    className="opacity-0 group-hover/subitem:opacity-100 text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/10 transition shrink-0 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Drop indicator below */}
                {dragOverIndex === index &&
                  dragIndex !== null &&
                  dragIndex < index && (
                    <div className="h-0.5 mx-1 rounded-full bg-primary/60 mt-1 transition-all" />
                  )}
              </div>
            ))}
          </div>

          {/* Add Subtask Form / Toggle */}
          {showAddForm ? (
            <form
              onSubmit={handleAddSubtask}
              className="p-3 border border-primary/20 rounded-lg bg-background/80 space-y-2.5 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  New Custom Subtask
                </span>
                <select
                  value={newSubtaskPriority}
                  onChange={(e) =>
                    setNewSubtaskPriority(e.target.value as Priority)
                  }
                  className="text-xs px-2 py-1 rounded-md border border-border bg-background font-medium focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Subtask title..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="w-full h-8 rounded-md border border-border/80 px-2.5 text-xs bg-background focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none"
                required
              />

              <textarea
                placeholder="Description (optional)..."
                value={newSubtaskDesc}
                onChange={(e) => setNewSubtaskDesc(e.target.value)}
                className="w-full rounded-md border border-border/80 p-2 text-xs bg-background focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none resize-none h-14"
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="h-7 text-xs rounded-md"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-7 px-3 text-xs font-semibold cursor-pointer rounded-md"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Subtask
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(true)}
                className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Subtask
              </Button>

              {/* Save subtasks button */}
              <Button
                type="button"
                size="sm"
                onClick={handleSaveSubtasks}
                disabled={isSaving || subtasks.length === 0}
                className="h-8 px-4 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer transition-all"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Save Subtasks
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
