'use client'

import { ChevronLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function GoBack({ className }: { className?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const isRootPage = pathname === '/seller' || pathname === '/Invited';

    return (
        <div
            onClick={() => !isRootPage && router.back()}
            className={`fixed top-2 left-2 z-20 p-1 rounded-full bg-white border-[1px] border-gray-200 
            ${isRootPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 cursor-pointer'} ${className}`}
        >
            <ChevronLeft />
        </div>
    );
}