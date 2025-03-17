'use client'

import { createdInstance } from '@/hooks/useApi';
import { IUser } from '@/models/user';
import { setCookie, getCookie, removeCookie } from '@/secure/cookies'
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { FileAPIURL } from '@/constants/api';
import useImage from '@/hooks/useImage';
import { toast } from '@/hooks/use-toast';
import { log } from 'console';

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
  }, [])

  useEffect(() => {
    if (user) {
      setCookie('user', user)
    } else {
      removeCookie('user')
    }
  }, [user])

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
  handleUpdateProfile: (bg?: string) => Promise<void>
  selectImage: () => void
  activeImagePreview: boolean
  handleDiscardImage: (index: number) => void
  getCollaborators: () => void
  collaborators: IUser[]
  getSupportId:  (email: string) => Promise<string | undefined>
} => {
  const context = useContext(UserContext);
  const [collaborators, setCollaborators] = useState<IUser[]>([])
  const [profile, setProfile] = useState<IUser>()
  const [imageURL, setImageURL] = useState<string>('/images/logo.png')
  const { images, actions } = useImage();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [activeImagePreview, setActiveImagePreview] = useState(false)
  const showToast = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  useEffect(() => {
    if (profile?.photo) {
      setImageURL(profile?.photo);
    }
    else setImageURL('/images/logo.png')
  }, [profile])

  const getSupportId = useCallback(
    async (email: string) => {
      try {
        const response = await createdInstance.post<{ message: string | null; supportId: string }>(
          `/support/`,
          { email }
        );
  
        if (response.status === 200) {
          return response.data.supportId;
        } else {
          throw new Error(`Erro ao buscar suporte: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  useEffect(() => {
    if (images.length > 0) {
      const previewURL = URL.createObjectURL(images[0]);
      setImageURL(previewURL);
      setActiveImagePreview(true);
    } else if (!activeImagePreview && profile?.photo) {
      // Só redefine o `imageURL` se o preview não estiver ativo
      setImageURL(profile.photo);
    }
  }, [images, profile, activeImagePreview]);

  const handleDiscardImage = (index: number) => actions.discard(index)

  const getProfile = useCallback(
    async (refetch: boolean = true) => {
      if (!userId && !refetch) {
        
        const profileCache = getCookie('secure-profile')
        if (profileCache && typeof profileCache === 'object') {
          setProfile(profileCache)
          return profileCache
        }
        return undefined
      }

      if (userId && createdInstance) {
        try {
          const response = await createdInstance.get<{ message: string | null; record: IUser }>(
            `/users/${userId}`
          )

          if (response.status === 200) {            
            setCookie('profile-type', response.data.record.type)
            setCookie('secure-profile', response.data.record)
            setProfile(response.data.record)
            return response.data.record
          } else {
            throw new Error(`Erro ao buscar perfil: ${response.status}`)
          }
        } catch (error) {
          console.error(error)
        }
      }
    },
    [userId]
  )

  const getCollaborators = useCallback(async () => {
    const collaborators = await createdInstance.get<{ message?: string, record: IUser[] }>(`/users/collaborators/${userId}`)

    if (collaborators.status === 200) {
      setCollaborators(collaborators.data.record)
    }
  }, [])

  const handleUpdateProfile = useCallback(async (bg?: string) => {
    if (!profile) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("firstName", profile.firstName);
    formData.append("lastName", profile.lastName);
    formData.append("birthDate", String(profile.birthDate));
    formData.append("municipality", profile.municipality ?? "");
    formData.append("province", profile.province ?? "");
    formData.append("description", profile.description);
    formData.append("phone", profile.phone);
    formData.append("gender", profile.gender);
    formData.append("userId", userId ?? "");
    if (bg || profile.background)
      formData.append("background", bg ?? '')

    if (images.length > 0) {
      const myImageConvertedToBlobFile = await actions.blobs();
      if (!myImageConvertedToBlobFile) return;

      formData.append("file", images[0])
    }

    await handleUpdate(formData);

    setIsLoading(false);
  }, [profile, images, actions, userId]);

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
    [setProfile]
  );


  useEffect(() => {
    if (userId) getProfile()
  }, [userId])
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return {
    ...context,
    profile,
    getCollaborators,
    collaborators,
    setProfile,
    imageURL,
    handleUpdateProfile,
    handleProfileChange,
    selectImage: actions.selectImages,
    activeImagePreview,
    handleDiscardImage,
    getSupportId
  };
};
