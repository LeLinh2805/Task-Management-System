import { MoreHorizontal, Plus, ClipboardList, Hourglass, CheckCircle2 } from 'lucide-react';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';
import Button from '../common/Button';

const ICON_MAP = {
  'ClipboardList': ClipboardList,
  'Hourglass': Hourglass,
  'CheckCircle2': CheckCircle2
};

const TaskColumn = ({ title, tasks = [], color, emptyConfig, onAddTask, onCardClick }) => {
  const EmptyIcon = ICON_MAP[emptyConfig?.emptyIcon] || ClipboardList;

  return (
    <div className="flex flex-col h-full w-[350px] min-w-[350px] bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`}></div>
          <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
          <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">{tasks.length}</span>
        </div>
        <MoreHorizontal size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
      </div>

      {/* Body*/}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50/50">
        {tasks.length > 0 ? (
          tasks.map(task => <TaskCard key={task.id} task={task} />)
        ) : (
          <EmptyState 
            icon={EmptyIcon} 
            title={emptyConfig.emptyText} 
            description={emptyConfig.emptyDesc} 
          />
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <Button variant="dashed" className="w-full justify-center">
          <Plus size={16} className="mr-2" /> Add New Task
        </Button>
      </div>
    </div>
  );
};
export default TaskColumn;