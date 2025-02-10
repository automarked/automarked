'use client'

import SearchInput from "@/components/both/input-search";
import ScrollableTabs from "@/components/scrollable-tabs";
import Link from "next/link";
import { useState } from "react";

export default function page() {
    const [text, setText] = useState('')
    return (
        <div className="p-2">
            <SearchInput value={text} setValue={setText} />
            <div className='flex justify-between mb-2 mt-10 px-2'>
                <strong className='font-bold text-lg'>
                    Principais ofertas
                </strong>

                <Link href="/seller/cars/all" className='underline text-blue-500'>Ver tudo</Link>
            </div>
            <ScrollableTabs />
            <div className="mt-12"></div>
        </div>
    )
}