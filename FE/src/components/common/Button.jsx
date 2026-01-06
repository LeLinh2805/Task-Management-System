import {cn} from "../../lib/utils";
const Button = ({children, className, variant = "primary", ...props}) =>{
    const variants = {
        primary: "bg-blue-600 text-while hover:bg-blue-700 shadow-sm",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
        outline: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700",
        dashed: "border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    };
    return (
        <button className={cn("inline-flex items-center justify-center rounded-lg text-sm font-medium h-9 px-4 py-2", variants[variant], className)} {...props}>
            {children}
        </button>
    );
}
export default Button;