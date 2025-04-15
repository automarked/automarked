'use client'

import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/contexts/userContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext";
import useImage from "@/hooks/useImage";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { AUTHORIZED_ADMINS } from "@/constants/auth";
import { profileType } from "@/utils/profileType";

const ProfileForm = () => {
    const {
        user,
        logout
    } = useAuth()
    const {
        profile,
        logout: signout,
        imageURL,
        handleProfileChange,
        handleUpdateProfile,
        selectImage,
        activeImagePreview,
        handleDiscardImage
    } = useUser(user?.uid ?? '')
    const [isLoading, setIsLoading] = useState(false);
    const { images, actions } = useImage()
    const [imagePreview, setImagePreview] = useState<string>()
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        const verifyAccess = () => {

            // Verify admin credentials and role
            const isAuthorizedAdmin = AUTHORIZED_ADMINS.some(
                admin => admin.email === profile?.email &&
                    admin.permissions.includes('CREATE_USERS')
            );

            if (isAuthorizedAdmin) {
                setIsAuthorized(true)
            }
        };

        verifyAccess();
    }, [profile, router]);


    const handleLogout = useCallback(async () => {
        await logout()
        signout()
        window.location.href = "/login-with-credentials"
    }, []);

    const handleEditProfile = useCallback(() => {

        if (imagePreview) {
            actions.saveAll().then(urls => {
                if (urls) {

                    handleProfileChange('background', urls[0])

                    handleUpdateProfile(urls[0])
                }
            })
        } else handleUpdateProfile()
    }, [imagePreview, handleProfileChange, handleUpdateProfile, profile])

    useEffect(() => {
        if (images.length > 0) {
            const preview = URL.createObjectURL(images[0]);
            setImagePreview(preview)
        }
        console.log(profile);

    }, [images, profile])

    useEffect(() => {
        console.log("PROFILE", imageURL);

    }, [imageURL])
    console.log(profile?.municipality)

    if (profile)
        return (
            <ScrollArea className="container mx-auto p-6 w-full max-w-2xl">
                <div className="container mx-auto p-6">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative flex items-center gap-2 flex-col">
                            <Image
                                src={imageURL}
                                alt="User Avatar"
                                width={150}
                                height={150}
                                className="w-28 border-[var(--black)] p-1 border-2 h-28 object-cover rounded-full "
                            />
                            <Badge variant={"outline"}>{profileType[profile.type]}</Badge>

                            {profile.type === "seller" && <button
                                data-preview={activeImagePreview}
                                className="absolute bottom-8 -right-2 data-[preview=false]:bg-black data-[preview=true]:bg-red-900 text-white w-8 h-8 rounded-lg p-2"
                                onClick={() => activeImagePreview ? handleDiscardImage(0) : selectImage()}
                            >
                                {activeImagePreview ? (
                                    <FontAwesomeIcon icon={faTrash} />
                                ) : (
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                )}
                            </button>}
                        </div>
                        <br />
                        <strong className="font-bold text-[var(--black)]">{profile.companyName}</strong>
                    </div>

                    <div className="mb-4 space-y-[24px]">
                        <Input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => handleProfileChange('firstName', e.target.value)}
                            className="border-[1px] border-gray-200 px-4 py-6"
                            placeholder="Primeiro nome"
                        />
                        <Input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => handleProfileChange('lastName', e.target.value)}
                            className="border-[1px] border-gray-200 px-4 py-6"
                            placeholder="Apelido"
                        />
                        <Input
                            type="text"
                            value={profile.municipality}
                            onChange={(e) => handleProfileChange('municipality', e.target.value ?? "")}
                            className="border-[1px] border-gray-200 px-4 py-6"
                            placeholder="Município"
                        />
                        <Input
                            type="text"
                            value={profile.province}
                            onChange={(e) => handleProfileChange('province', e.target.value ?? "")}
                            className="border-[1px] border-gray-200 px-4 py-6"
                            placeholder="Província"
                        />
                    </div>

                    <div className="mb-4 space-y-[24px]">
                        <Input
                            type="text"
                            value={profile.email}
                            className="border-[1px] border-gray-200 px-4 py-6"
                            disabled
                        />
                    </div> <div className="mb-4 space-y-[24px]">
                        <Input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => handleProfileChange('firstName', e.target.value)}
                            className="border-[1px] border-gray-200 px-4 py-6"
                            placeholder="Primeiro nome"
                        />
                        <Input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => handleProfileChange('lastName', e.target.value)}
                            className="border-[1px] border-gray-200 px-4 py-6"
                            placeholder="Apelido"
                        />
                        <Input
                            type="text"
                            value={profile.companyName}
                            onChange={(e) => handleProfileChange('companyName', e.target.value)}
                            className="border-[1px] border-gray-200 px-4 py-6"
                            placeholder="Nome da empresa"
                        />
                        <Input
                            type="text"
                            value={profile.municipality}
                            onChange={(e) => handleProfileChange('municipality', e.target.value ?? "")}
                            className="border-[1px] border-gray-200 px-4 py-6"
                            placeholder="Município"
                        />
                        <Input
                            type="text"
                            value={profile.province}
                            onChange={(e) => handleProfileChange('province', e.target.value ?? "")}
                            className="border-[1px] border-gray-200 px-4 py-6"
                            placeholder="Província"
                        />
                    </div>

                    <div className="mb-4 space-y-[24px]">
                        <Input
                            type="text"
                            value={profile.email}
                            className="border-[1px] border-gray-200 px-4 py-6"
                            disabled
                        />
                    </div>

                    <div className="flex items-center mb-4">
                        <div className="flex w-full bg-[var(--input)] rounded-md py-0 pl-0 items-center">
                            <input
                                type="date"
                                value={profile.birthDate.toString()}
                                onChange={(e) => handleProfileChange('birthDate', e.target.value)}
                                className="p-0 w-full m-0 rounded-md bg-[var(--input)] shadow-sm border-none outline-none py-[14px] px-[16px] outline-offset-0"
                                placeholder="Data de nascimento"
                            />
                        </div>
                    </div>

                    <div className="mb-4 space-y-[24px]">
                        <Input
                            type="text"
                            value={profile.phone}
                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                            className="border-[1px] border-gray-200 px-4 py-6"
                            placeholder="Número de telefone"
                        />
                    </div>
                    <div className="mb-4 space-y-[24px]">
                        <select
                            name="gender"
                            id="gender"
                            value={profile.gender}
                            onChange={(e) => handleProfileChange('gender', e.target.value)}
                            className="p-0 w-full m-0 rounded-md shadow-sm border-none outline-none py-[14px] px-[16px]"
                        >
                            <option value="male">Masculino</option>
                            <option value="fame">Feminino</option>
                        </select>
                        <Textarea
                            value={profile.description}
                            onChange={(e) => handleProfileChange('description', e.target.value)}
                            className="border-[1px] border-gray-200 px-4 py-6"
                            placeholder="Decrição do seu perfil"
                        />
                    </div>

                    <strong className="font-bold text-[var(--black)] mb-4">Foto de Capa</strong>
                    <div className="border relative w-full h-32 mb-12">
                        {!imagePreview && profile.background && (
                            <Image width={500} height={300} alt="Foto de Capa" src={profile.background} className="w-full h-full object-cover" />
                        )}
                        {imagePreview && (
                            <Image width={500} height={300} alt="Foto de Capa" src={imagePreview} className="w-full h-full object-cover" />
                        )}
                        {profile.type === "seller" &&
                            <button
                                data-preview={imagePreview ? true : false}
                                className="absolute bottom-8 -right-2 data-[preview=false]:bg-black data-[preview=true]:bg-red-900 text-white w-8 h-8 rounded-lg p-2"
                                onClick={() => imagePreview ? (() => {
                                    actions.discard(0)
                                    setImagePreview(undefined)
                                })() : actions.selectImages()}
                            >
                                {imagePreview ? (
                                    <FontAwesomeIcon icon={faTrash} />
                                ) : (
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                )}
                            </button>
                        }
                    </div>
                    <div className="flex flex-col w-full justify-center gap-4">
                        <button
                            className="w-full bg-[var(--black)] text-white py-3 rounded-full"
                            onClick={handleEditProfile}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Continuar"}
                        </button>
                        <button
                            className="w-full bg-red-900 text-white py-3 rounded-full"
                            onClick={handleLogout}
                        >
                            Sair
                        </button>
                        {isAuthorized && (
                            <button
                                className="w-full bg-blue-950 text-white py-3 rounded-full mt-6"
                                onClick={() => router.push("/signup/seller")}
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Cadastrar usuário"}
                            </button>
                        )}
                    </div>
                    <br /><br />
                    {profile.type === "seller" || profile.type === "collaborator" && (
                        <>
                            <strong className="font-bold text-[var(--black)]">Sobre a Empresa</strong>
                            <br /><br />
                            <div className="mb-4 space-y-[24px]">
                                <Input
                                    type="text"
                                    value={profile.companyName}
                                    className="border-[1px] border-gray-200 px-4 py-6"
                                    disabled={profile.type === "collaborator"}
                                />
                            </div>

                            <div className="mb-4 space-y-[24px]">
                                <Input
                                    type="text"
                                    value={profile.bankName}
                                    className="border-[1px] border-gray-200 px-4 py-6"
                                    disabled={profile.type === "collaborator"}
                                />
                            </div>

                            <div className="mb-4 space-y-[24px]">
                                <Input
                                    type="text"
                                    value={profile.IBAN}
                                    className="border-[1px] border-gray-200 px-4 py-6"
                                    disabled={profile.type === "collaborator"}
                                />
                            </div>

                            <div className="mb-4 space-y-[24px]">
                                <Input
                                    type="text"
                                    value={profile.alvara}
                                    className="border-[1px] border-gray-200 px-4 py-6"
                                    disabled={profile.type === "collaborator"}
                                />
                            </div>

                            <div className="mb-4 space-y-[24px]">
                                <Input
                                    type="text"
                                    value={profile.certificado}
                                    className="border-[1px] border-gray-200 px-4 py-6"
                                    disabled={profile.type === "collaborator"}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="h-[100px]" />
            </ScrollArea>
        );
};

export default ProfileForm;
