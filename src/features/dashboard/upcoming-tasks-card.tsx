'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckSquare, Plus, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn } from '@/lib/utils';

export function UpcomingTasksCard() {
  const { tasks, toggleTaskCompleted, addTask } = usePrototypeStore();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title, priority);
    setTitle('');
    setAdding(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setAdding((v) => !v)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
          <Link
            href="/workspace"
            className="text-info inline-flex items-center gap-1 text-xs font-medium hover:underline"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {adding && (
          <form
            onSubmit={handleAdd}
            className="rounded-btn border-border-subtle bg-app/70 mb-3 flex flex-wrap gap-2 border p-2.5"
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Approve fintech outreach drafts..."
              className="rounded-control border-border-subtle bg-surface text-text-primary focus:border-brand h-8 min-w-[160px] flex-1 border px-2.5 text-xs focus:outline-none"
            />
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as 'High' | 'Medium' | 'Low')
              }
              aria-label="Task priority"
              className="rounded-control border-border-subtle bg-surface text-text-primary h-8 border px-2 text-xs"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <Button type="submit" size="xs">
              Save
            </Button>
          </form>
        )}

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-btn border-border-subtle bg-app/45 hover:border-border-strong flex items-center justify-between gap-3 border px-3 py-2.5 transition-colors"
            >
              <div className="flex min-w-0 items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleTaskCompleted(task.id)}
                  aria-label={
                    task.completed
                      ? `Mark "${task.title}" incomplete`
                      : `Mark "${task.title}" complete`
                  }
                  className="text-text-secondary hover:text-brand mt-0.5"
                >
                  {task.completed ? (
                    <CheckSquare className="text-success h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
                <div className="min-w-0">
                  <Link
                    href={task.href}
                    className={cn(
                      'hover:text-brand block truncate text-xs font-medium',
                      task.completed
                        ? 'text-text-disabled line-through'
                        : 'text-text-primary',
                    )}
                  >
                    {task.title}
                  </Link>
                  <p className="text-text-secondary text-[11px]">
                    {task.resourceLabel}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <span className="bg-elevated text-text-secondary hidden rounded-full px-2 py-0.5 text-[10px] font-medium sm:inline-block">
                  {task.dueLabel}
                </span>
                <Badge
                  variant={
                    task.priority === 'High'
                      ? 'danger'
                      : task.priority === 'Medium'
                        ? 'warning'
                        : 'default'
                  }
                >
                  {task.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
