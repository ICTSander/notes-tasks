"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/TopBar";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TaskCard } from "@/components/TaskCard";
import {
  mockTasks,
  getTodayTasks,
  getTomorrowTasks,
  getLaterTasks,
} from "@/lib/mock";

const SEGMENTS = ["Today", "Upcoming", "All"];

export default function TasksPage() {
  const [segment, setSegment] = useState("Today");
  const [tasks, setTasks] = useState(mockTasks);

  function handleToggle(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  const todayTasks = useMemo(() => getTodayTasks(tasks), [tasks]);
  const tomorrowTasks = useMemo(() => getTomorrowTasks(tasks), [tasks]);
  const laterTasks = useMemo(() => getLaterTasks(tasks), [tasks]);

  function renderGroup(title: string, items: typeof tasks) {
    if (items.length === 0) return null;
    return (
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-t3 uppercase tracking-wider px-1">
          {title}
        </h3>
        {items.map((task, i) => (
          <TaskCard key={task.id} task={task} onToggle={handleToggle} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <TopBar title="Tasks" showAvatar={false} showSearch={false} />

      <SegmentedControl items={SEGMENTS} active={segment} onChange={setSegment} />

      <div className="space-y-6">
        {segment === "Today" && (
          <>
            {todayTasks.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-t3 text-sm">No tasks for today</p>
              </div>
            ) : (
              renderGroup("Today", todayTasks)
            )}
          </>
        )}

        {segment === "Upcoming" && (
          <>
            {renderGroup("Today", todayTasks)}
            {renderGroup("Tomorrow", tomorrowTasks)}
            {renderGroup("Later", laterTasks)}
            {todayTasks.length === 0 && tomorrowTasks.length === 0 && laterTasks.length === 0 && (
              <div className="text-center py-16">
                <p className="text-t3 text-sm">No upcoming tasks</p>
              </div>
            )}
          </>
        )}

        {segment === "All" && (
          <>
            {tasks.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-t3 text-sm">No tasks yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task, i) => (
                  <TaskCard key={task.id} task={task} onToggle={handleToggle} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
