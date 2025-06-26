import { supportEmail } from "@/constants/credential";
import { useUser } from "@/contexts/userContext";
import { useState, useEffect } from "react";
import { toast } from "./use-toast";

const useSupportId = () => {
    const { getSupportId } = useUser();
    const [supportId, setSupportId] = useState<string | undefined>("kWxyFyf0THfAZwMLkThBpc3ABWe2");
    const showToast = (title: string, description: string) => {
        toast({
            title,
            description,
        });
    };

    useEffect(() => {
        const fetchSupportId = async () => {
            if (!supportEmail) return;
            const id = await getSupportId(supportEmail);

            if (id) {
                setSupportId(id);
                console.log("Support Id fetched: ", id); // Log the actual fetched ID
            }
        };

        fetchSupportId();
    }, [getSupportId]); // Add getSupportId as dependency

    // Optional: Log supportId changes in a separate useEffect
    useEffect(() => {
        if (supportId) {
            console.log("Support Id updated: ", supportId);
        }
    }, [supportId]);
    
    return { supportId };
};

export default useSupportId;
