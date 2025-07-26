import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Check, X, Edit3 } from 'lucide-react';
import ProjectLayout from './ProjectLayout';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskManager-tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
      setTasks(parsedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskManager-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        priority: 'medium',
        createdAt: new Date()
      };
      setTasks([task, ...tasks]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim() && editingId) {
      setTasks(tasks.map(task => 
        task.id === editingId ? { ...task, text: editText.trim() } : task
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const setPriority = (id: string, priority: 'low' | 'medium' | 'high') => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, priority } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <ProjectLayout
      title="Task Manager Pro"
      description="A fully functional task management application"
      githubUrl="https://github.com/yourusername/task-manager"
      technologies={["React", "TypeScript", "Tailwind CSS", "Local Storage"]}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center">
              Task Manager Pro
            </CardTitle>
            <p className="text-center text-blue-100 mt-2">
              Stay organized and boost your productivity
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Add Task Section */}
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                className="flex-1"
              />
              <Button onClick={addTask} className="px-6">
                <Plus size={20} />
                Add
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-orange-600">{totalCount - completedCount}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </Card>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 mb-6">
              {(['all', 'active', 'completed'] as const).map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? 'default' : 'outline'}
                  onClick={() => setFilter(filterType)}
                  className="capitalize"
                >
                  {filterType}
                </Button>
              ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-lg">No tasks found</p>
                  <p className="text-sm">Add a task to get started!</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <Card key={task.id} className={`transition-all duration-200 hover:shadow-md ${task.completed ? 'opacity-75' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Checkbox */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTask(task.id)}
                          className={`w-6 h-6 rounded-full border-2 p-0 ${
                            task.completed 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {task.completed && <Check size={14} />}
                        </Button>

                        {/* Task Content */}
                        <div className="flex-1">
                          {editingId === task.id ? (
                            <div className="flex gap-2">
                              <Input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                className="flex-1"
                                autoFocus
                              />
                              <Button size="sm" onClick={saveEdit}>
                                <Check size={16} />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                <X size={16} />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                {task.text}
                              </span>
                              
                              {/* Priority Badge */}
                              <Badge 
                                className={`${getPriorityColor(task.priority)} text-white cursor-pointer`}
                                onClick={() => {
                                  const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
                                  const currentIndex = priorities.indexOf(task.priority);
                                  const nextPriority = priorities[(currentIndex + 1) % priorities.length];
                                  setPriority(task.id, nextPriority);
                                }}
                              >
                                {task.priority}
                              </Badge>

                              {/* Action Buttons */}
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEdit(task.id, task.text)}
                                >
                                  <Edit3 size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteTask(task.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Clear Completed */}
            {completedCount > 0 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setTasks(tasks.filter(task => !task.completed))}
                  className="text-red-500 hover:text-red-700"
                >
                  Clear Completed ({completedCount})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
};

export default TaskManager;
