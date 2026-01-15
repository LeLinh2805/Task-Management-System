import { cn } from "../../lib/utils";
const Badge = ({ children, color, className }) => {
    const style = {
        gray: "bg-gray-100 text-gray-600",
        green: "bg-green-50 text-green-600",
        red: "bg-red-50 text-red-600",
        orange: "bg-orange-50 text-orange-600",
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        pink: "bg-pink-50 text-pink-600",
    }
    return (
        <span className={cn("px-2 py-1 rounded text-[11px] font-semibold border border-transparent whitespace-nowrap", style[color] && style.gray, className)}>
            {children}
        </span>
    )
}
export default Badge;