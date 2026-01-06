import { MessageSquare, Clock, MoreHorizontal } from 'lucide-react';
import Badge from '../common/Badge';
import  {getBadgeColor}  from '../../lib/utils';

const TaskCard = ({ task }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer mb-3 group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-wrap gap-2">
          {task.tags?.map((tag, i) => (
            <Badge key={i} color={getBadgeColor(tag)}>{tag}</Badge>
          ))}
        </div>
        <MoreHorizontal size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <h3 className="text-gray-800 font-semibold text-sm mb-1 leading-snug">{task.title}</h3>
      
      {task.image && (
        <div className="mb-3 mt-2 rounded-lg overflow-hidden h-32 w-full border border-gray-100">
           <img src={task.image} alt="Task Cover" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Progress Bar */}
      {task.progress !== undefined && (
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3 mt-2">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${task.progress}%` }}></div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <div className="flex -space-x-2">
           <img className="w-6 h-6 rounded-full border-2 border-white" src={`https://i.pravatar.cc/150?img=${task.id + 10}`} alt=""/>
           {task.assignees > 1 && (
             <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-medium">+{task.assignees - 1}</div>
           )}
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
            {task.daysLeft && <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded"><Clock size={12}/> {task.daysLeft}</span>}
            {task.comments > 0 && <span className="flex items-center gap-1"><MessageSquare size={14}/> {task.comments}</span>}
        </div>
      </div>
    </div>
  );
};
export default TaskCard;