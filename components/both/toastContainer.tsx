import { toast } from "@/hooks/use-toast"
import { ToastAction } from "../ui/toast"

export const ToastResult = ({ title, message, label, type, time, html }: { html?: React.ReactNode, time?: number, title: string, message: string, label: string, type: 'error' | 'success' | 'warning' }) => {
    if (type === 'error') {
        toast({
            title: title,
            description: message,
            className: "left-0 border-none bg-[var(--redError)] text-white font-medium shadow-md h-20 bottom-[50%]",
            duration: time ?? 14000,//5 min
            action: (
                <>
                    {html ?? (
                        <ToastAction altText="Goto schedule to undo" className="bg-red-500 text-white">{label}</ToastAction>
                    )}
                </>
            )
        })
    } else if (type === 'success') {
        toast({
            title,
            description: message,
            className: "left-0 border-none bg-green-500 text-white font-medium shadow-md h-20 bottom-[50%]",
            duration: time ?? 14000,//5 min
            action: (
                <>
                    {html ?? (
                        <ToastAction altText="Goto schedule to undo" className="bg-green-800 text-white">{label}</ToastAction>
                    )}
                </>
            )
        })
    } else {
        toast({
            title,
            description: message,
            className: "left-0 border-none bg-orange-400 text-white font-medium shadow-md h-20 bottom-[50%]",
            duration: time ?? 14000,//5 min
            action: (
                <>
                    {html ?? (
                        <ToastAction altText="Goto schedule to undo" className="bg-orange-600 text-white">{label}</ToastAction>
                    )}
                </>
            )
        })
    }
}