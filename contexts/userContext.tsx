'use client'

import { createdInstance } from '@/hooks/useApi';
import { IUser } from '@/models/user';
import { secureGet, secureStore } from '@/secure/sessions';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import useImage from '@/hooks/useImage';
import { toast } from '@/hooks/use-toast';
import { getCookie, removeCookie, setCookie } from '@/secure/cookies';

// Tipo do usuário conforme especificado
// Tipo do contexto
interface UserContextType {
  user: { uid: string, email: string, name: string } | null;
  setUser: (user: { uid: string, email: string, name: string } | null) => void;
  logout: () => void;
}

// Contexto inicial
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider do contexto
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ uid: string, email: string, name: string } | null>(null);

  // Carregar o usuário do localStorage no carregamento inicial
  useEffect(() => {
    const storedUser = getCookie('secure-user')
    if (storedUser) {
      setUser(storedUser)
    }
  }, []);

  // Atualizar localStorage sempre que o usuário mudar
  useEffect(() => {
    if (user) {
      setCookie('user', user)
    } else {
      removeCookie('user')
    }
  }, [user]);

  // Função de logout
  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar o contexto
export const useUser = (userId?: string): UserContextType & {
  profile: IUser | undefined,
  setProfile: React.Dispatch<React.SetStateAction<IUser | undefined>>
  imageURL: string,
  handleProfileChange: (field: keyof IUser, value: string) => void
  handleUpdateProfile: () => Promise<void>
  selectImage: () => void
  activeImagePreview: boolean
  handleDiscardImage: () => void
  getCollaborators: () => void
  collaborators: IUser[]
  getUsersByProfileType: (param: "costumer" | "seller" | "collaborator") => void
  stores: IUser[]
  isLoadingStores: boolean
  isLoadingUpdate: boolean,
  getUser:  (id: string) => Promise<IUser | undefined>
} => {
  const context = useContext(UserContext);
  const [collaborators, setCollaborators] = useState<IUser[]>([])
  const [profile, setProfile] = useState<IUser>()
  const [imageURL, setImageURL] = useState<string>('/images/logo.png')
  const { image, actions } = useImage();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [activeImagePreview, setActiveImagePreview] = useState(false)
  const [stores, setStore] = useState<IUser[]>([])
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(false)
  const [isLoadingStores, setIsLoadingStores] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const showToast = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  useEffect(() => {
    setImageURL((profile?.photo ?? '/images/logo.png'));
  }, [profile])


  useEffect(() => {
    if (image) {
      const previewURL = URL.createObjectURL(image);
      setImageURL(previewURL);
      setActiveImagePreview(true);
    } else if (!activeImagePreview && profile?.photo) {
      // Só redefine o `imageURL` se o preview não estiver ativo
      setImageURL(profile.photo);
    }
  }, [image, profile, activeImagePreview]);

  const handleDiscardImage = () => actions.discard()

  const getProfile = useCallback(
    async (refetch: boolean = true) => {
      if (!userId && !refetch) {
        // Verificar se há cache disponível
        const haveProfileCache = getCookie('secure-profile')
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
            setCookie('profile-type', response.data.record.type)
            setCookie('secure-profile', response.data.record)
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

  const getUser = useCallback(
    async (id: string) => {
      try {
        const response = await createdInstance.get<{ message: string | null; record: IUser }>(
          `/users/${id}`
        );

        if (response.status === 200) {
          return response.data.record;
        } else {
          throw new Error(`Erro ao buscar perfil: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const getCollaborators = useCallback(async () => {
    const collaborators = await createdInstance.get<{ message?: string, record: IUser[] }>(`/users/collaborators/${userId}`)

    if (collaborators.status === 200) {
      setCollaborators(collaborators.data.record)
    }
  }, [])

  const handleUpdateProfile = useCallback(async () => {
    if (!profile) return;
    setIsLoadingUpdate(true);

    const formData = new FormData();
    formData.append("firstName", profile.firstName);
    formData.append("lastName", profile.lastName);
    formData.append("municipality", profile.municipality);
    formData.append("province", profile.province);
    formData.append("description", profile.description);
    formData.append("birthDate", String(profile.birthDate));
    formData.append("phone", profile.phone);
    formData.append("gender", profile.gender);
    formData.append("userId", userId ?? "");

    if (image) {
      const myImageConvertedToBlobFile = await actions.blob();
      if (!myImageConvertedToBlobFile) return;

      const typeFile = myImageConvertedToBlobFile.type.split("/")[1];

      formData.append("file", image)
    }

    const result = await handleUpdate(formData);

    setIsLoadingUpdate(false);
  }, [profile, image, actions, userId]);

  const handleUpdate = useCallback(async (data: FormData) => {
    try {

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
        showToast("Successo!", "Seu perfil foi atualizado com successo!")
        window.location.reload()
      }
    } catch (error) {
      showToast("Erro!", "Ocorreu algum erro ao atualizar o seu perfil, por favor verifique a sua conexão a internet e volte a tentar.\n\nCaso o problema persista contacte alguém do suporte!")
    }
  }, []);

  const handleProfileChange = useCallback(
    (field: keyof IUser, value: string) => {
      setProfile((prevProfile) => ({
        ...prevProfile!,
        [field]: value,
      }));
    },
    []
  );

  const getUsersByProfileType = useCallback(async (profileType: "seller" | "costumer" | "collaborator") => {
    setIsLoadingStores(true)
    const response = await createdInstance.get<{ message: null, record: IUser[] }>(`/users/by-type/${profileType}`, { params: { type: profileType } })
    if (response.status === 200) {
      setStore(response.data.record)
    }
    setIsLoadingStores(false)
  }, [])


  useEffect(() => {
    if (userId) getProfile()
  }, [userId])
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return {
    ...context,
    profile,
    isLoadingUpdate,
    isLoadingStores,
    getCollaborators,
    collaborators,
    setProfile,
    imageURL,
    handleUpdateProfile,
    handleProfileChange,
    selectImage: actions.selectImage,
    activeImagePreview,
    handleDiscardImage,
    getUsersByProfileType,
    stores,
    getUser
  };
};
