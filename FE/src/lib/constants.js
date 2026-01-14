import { LayoutDashboard, CheckSquare, Calendar, Users, Settings } from 'lucide-react';

export const SIDEBAR_MENU = [
  {
    label: 'Board',
    path: '/dashboard',
    icon: LayoutDashboard
  }
  
]

export const BOARD_COLUMNS = [
  {
    id: 'TODO', 
    title: 'To Do',
    color: 'bg-gray-400',
    emptyIcon: 'ClipboardList',
    emptyText: 'No tasks yet',
    emptyDesc: 'Add a new task to get started on your project.'
  },
  {
    id: 'IN_PROGRESS',
    title: 'In Progress',
    color: 'bg-yellow-400',
    emptyIcon: 'Hourglass',
    emptyText: 'No active tasks',
    emptyDesc: 'Drag tasks here to start working.'
  },
  {
    id: 'DONE', 
    title: 'Done',
    color: 'bg-green-500',
    emptyIcon: 'CheckCircle2',
    emptyText: 'No finished tasks',
    emptyDesc: 'Completed tasks will appear here. Keep up the good work!'
  }
];