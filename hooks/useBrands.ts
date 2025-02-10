import { Brand } from "@/models/brand";
import { useCallback, useEffect, useState } from "react";
import { createdInstance } from "./useApi";

export default function useBrands() {
    const [brandsList, setBrandsList] = useState<Brand[]>([])

    const getAll = useCallback(async () => {
        const response = await createdInstance.get<{record: Brand[]}>('/brands')

        console.log(response.data);
        setBrandsList(response.data.record)
    }, [])

    useEffect(() => {
        getAll()
    }, [])

    return {
        brandsList
    }
}