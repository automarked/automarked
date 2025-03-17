import { supportEmail } from "@/constants/credential";
import { useUser } from "@/contexts/userContext";
import { useState, useEffect } from "react";

const useSupportId = () => {
    const { getSupportId } = useUser(); // Hook must be used inside a component
    const [supportId, setSupportId] = useState<string | undefined>("CRYodokf8hQmL3A5lIJEmMnV4I23");

    useEffect(() => {
        // const fetchSupportId = async () => {
        //     if (!supportEmail) return;
        //     const id = await getSupportId(supportEmail);
        //     setSupportId(id);
        // };

        // fetchSupportId();
    }, []);

    return { supportId };
};

export default useSupportId;
