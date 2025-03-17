import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import HelpDeskSVG from "./helpdeskSVG";

interface CustomerHelpdeskProps {
    classNameSVG: string,
    classNameBG: string
}

export default function CustomerHelpdesk({ classNameSVG, classNameBG }: CustomerHelpdeskProps) {
    const router = useRouter();
    const supportId = "CRYodokf8hQmL3A5lIJEmMnV4I23";
    const handleChatClick = (chatId: string) => {
        router.push(`/seller/chat/${chatId}`);
    };

    return (
        <div onClick={() => handleChatClick(supportId)} className={cn("flex absolute z-50 bottom-5 left-5 bg-yellow-500 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-100 hover:bg-yellow-400 rounded-full size-12 shadow-2xl p-2 cursor-pointer", classNameBG)}>
            <HelpDeskSVG classNameSVG={classNameSVG} />
        </div>
    );
}