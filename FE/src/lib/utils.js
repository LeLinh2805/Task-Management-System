import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs){
    return twMerge(clsx(inputs));

}
export function getBadgeColor(text){
    if(!text){
        return "gray";
    } 
    const colors = ["blue", "green", "orange", "purple", "red", "pink"];
    let hash = 0;
    for (let i = 0; i < colors.length; i++){
        hash += text.charCodeAt(i);
    }
    return colors[hash % colors.length];

}