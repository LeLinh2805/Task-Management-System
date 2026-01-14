import { MessageSquare, MoreHorizontal, Flag, Calendar} from 'lucide-react';
import Badge from '../common/Badge';
import { getBadgeColor, getPriorityColor, formatDateTime } from '../../lib/utils';

const TaskCard = ({ task, onClick }) => {
  return (
    <div
      onClick={()=>{
        onClick();
      }}
      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer mb-3 group relative"
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex flex-wrap gap-2 items-center flex-1">
          {task.priority && (
            <div className={`mr-1 ${getPriorityColor(task.priority)}`} title={`Độ ưu tiên: ${task.priority}`}>
              <Flag size={16} fill="currentColor" className="opacity-90" />
            </div>
          )}
          {task.tags?.map((tag, i) => (
            <Badge key={i} color={getBadgeColor(tag)}>{tag}</Badge>
          ))}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="p-1 rounded-md hover:bg-gray-100 -mr-1"
        >
          <MoreHorizontal size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
      <h3 className="text-gray-800 font-semibold text-sm mb-3 leading-snug pr-2">
        {task.title}
      </h3>

      {task.progress !== undefined && task.progress !== null && (
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
          <div
            className={`h-1.5 rounded-full ${task.progress === 100 ? 'bg-green-500' : 'bg-purple-500'}`}
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        
        <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
          {task.dueDate && (
            <span className="flex items-center gap-1 hover:text-gray-600 transition-colors" title="Ngày hết hạn">
              <Calendar size={14} className="text-gray-500" />
              {formatDateTime(task.dueDate)}
            </span>
          )}
          {task.comments > 0 && (
            <span className="flex items-center gap-1 hover:text-gray-600 transition-colors" title="Bình luận">
              <MessageSquare size={14} className="text-gray-500" />
              {task.comments}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;