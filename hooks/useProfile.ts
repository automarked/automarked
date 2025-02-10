import { useCallback, useEffect, useState } from "react";
//import { Alert, Platform } from "react-native";
import useImage from "./useImage";
import { IUser } from "@/models/user";
/* import { secureGet, secureStore } from "@/secure/sessions"; */
import { createdInstance } from "./useApi";

//const isWeb = Platform.OS === "web";

export default function useProfile(userId?: string) {
    //const { image, actions } = useImage();
   /*  const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [profile, setProfile] = useState<IUser | undefined>();

    const getAllProfiles = useCallback(async () => {
        if (!createdInstance) return [];
        const response = await createdInstance.get<IUser[]>("/users");
        return response.data ?? [];
    }, []);

    const handleUpdateProfile = useCallback(async () => {
        if (!profile) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append("firstName", profile.firstName);
        formData.append("lastName", profile.lastName);
        formData.append("birthDate", String(profile.birthDate));
        formData.append("phone", profile.phone);
        formData.append("gender", profile.gender);
        formData.append("userId", userId ?? "");

        if (image) {
            const myImageConvertedToBlobFile = await actions.blob();
            if (!myImageConvertedToBlobFile) return;

            const typeFile = myImageConvertedToBlobFile.type.split("/")[1];
            if (isWeb)
                formData.append("file", myImageConvertedToBlobFile, `profile_image.${typeFile}`);
            else
                formData.append(
                    "file",
                    JSON.parse(
                        JSON.stringify({
                            uri: image,
                            type: typeFile,
                            name: `profile_image.${typeFile}`,
                        })
                    )
                );
        }

        const result = await handleUpdate(formData);
        if (!result) {
            setError(true);
        } else {
            Alert.alert("Sucesso", "Imagem enviada com sucesso!");
        }
        setIsLoading(false);
    }, [profile, image, actions, userId]);

    const handleUpdate = useCallback(async (data: FormData) => {
        if (!createdInstance) return;
        const response = await createdInstance.put<{ message: string | null; record: IUser }>(
            "/users",
            data,
            {
                headers: {
                    "Content-Type": `multipart/form-data`,
                },
            }
        );
        if (response.status === 204) {
            await getProfile(true);
        }
        return response.status === 204;
    }, []);

    const handleProfileChange = useCallback(
        (field: keyof IUser, value: string) => {
            if (profile) {
                setProfile({
                    ...profile,
                    [field]: value,
                });
            }
        },
        [profile]
    );

    const getProfile = useCallback(
        async (refetch: boolean = true) => {
            if (!userId && !refetch) {
                // Verificar se há cache disponível
                const haveProfileCache = await secureGet("secure-profile", { JSONParse: true });
                if (haveProfileCache && typeof haveProfileCache === "object") {
                    setProfile(haveProfileCache);
                    return haveProfileCache;
                }
                return undefined; // Caso não haja cache, retornar undefined
            }

            if (userId && createdInstance) {
                try {
                    const response = await createdInstance.get<{ message: string | null; record: IUser }>(
                        `/users/${userId}`
                    );

                    if (response.status === 200) {
                        await secureStore("profile-type", response.data.record.type);
                        await secureStore("secure-profile", JSON.stringify(response.data.record));
                        setProfile(response.data.record);
                        return response.data.record;
                    } else {
                        throw new Error(`Erro ao buscar perfil: ${response.status}`);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        },
        [userId]
    );

    useEffect(() => {
        getProfile(true);
    }, [getProfile]);

    return {
        profile: { ...profile, uri: image },
        states: {
            isLoading,
            error,
        },
        actions: {
            selectImage: actions.selectImage,
            set: handleProfileChange,
            update: handleUpdateProfile,
            getProfile,
            getAllProfiles,
            setProfile,
        },
    }; */
    return {}
}
