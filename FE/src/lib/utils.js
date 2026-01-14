import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import { parseISO, isPast, formatDistanceToNow, format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function cn(...inputs){
    return twMerge(clsx(inputs));

}
export function getBadgeColor(text){
    if(!text){
        return "gray";
    } 
    const colors = ["blue", "green", "orange", "purple", "red", "pink"];
    let hash = 0;
    for (let i = 0; i < text.length; i++){
        hash += text.charCodeAt(i);
    }
    return colors[hash % colors.length];

}
export const getPriorityColor = (priority) => {
  if (!priority) return 'text-gray-400';
  
  const p = priority.toLowerCase();
  
  const colors = {
    high: 'text-red-500',
    medium: 'text-amber-500',
    low: 'text-blue-500',
  };

  return colors[p] || 'text-gray-400';
};

export function formatDaysLeft(dateString) {
  if (!dateString) return null;
  const date = parseISO(dateString);
  if (isPast(date)) {
    return "Đã quá hạn";
  }
  
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
}

export function formatDateTime(dateString) {
  if (!dateString) return "Chưa đặt ngày";
  const date = parseISO(dateString);
  
  return format(date, 'HH:mm dd/MM/yyyy', { locale: vi });
}

export function formatDateForInput(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split('T')[0];
}