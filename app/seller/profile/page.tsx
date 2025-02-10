'use client'

import React, { useCallback, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useUser } from "@/contexts/userContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext";
import { createdInstance } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/loader";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

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
        isLoadingUpdate,
        activeImagePreview,
        handleDiscardImage
    } = useUser(user?.uid ?? '')

    const showToast = (title: string, description: string) => {
        toast({
            title,
            description,
        });
    };

    const [isLoading, setIsLoading] = useState(false);
    const handleLogout = useCallback(async () => {
        await logout()
        signout()
        window.location.href = "/login-with-credentials"
    }, []);

    const handleChangePassword = useCallback(async () => {
        showToast(`Enviamos um email para ${user?.email} com instruções para mudar sua senha!`, "")
        await createdInstance.put(`/auth/change-password/${user?.email}`)
    }, []);
    console.log(user)

    if (profile)
        return (
            <div>
                <div className="container mx-auto p-6 w-full">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative flex items-center gap-2 flex-col">
                            <Image
                                src={imageURL}
                                alt="Profile"
                                width={150}
                                height={150}
                                className="w-28 border-[var(--black)] p-1 border-2 h-28 object-cover rounded-full bg-gray-200"
                            />
                            <Badge variant="outline">{profile.type === "seller" ? "Concessonário" : "Cliente"}</Badge>

                            <button
                                data-preview={activeImagePreview}
                                className="absolute bottom-8 -right-2 data-[preview=false]:bg-black data-[preview=true]:bg-red-900 text-white w-8 h-8 rounded-lg p-2"
                                onClick={activeImagePreview ? handleDiscardImage : selectImage}
                            >
                                {activeImagePreview ? (
                                    <FontAwesomeIcon icon={faTrash} />
                                ) : (
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                )}
                            </button>

                        </div>
                        {isLoadingUpdate && (
                            <Loader />
                        )}
                        <br />
                        <strong className="font-bold text-[var(--black)]">{profile.companyName}</strong>
                    </div>

                    <div className="mb-4 space-y-[24px]">
                        <Input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => handleProfileChange('firstName', e.target.value)}
                            className="mobile-input"
                            placeholder="Primeiro nome"
                        />
                        <Input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => handleProfileChange('lastName', e.target.value)}
                            className="mobile-input"
                            placeholder="Apelido"
                        />
                        <Input
                            type="text"
                            value={profile.municipality}
                            onChange={(e) => handleProfileChange('municipality', e.target.value)}
                            className="mobile-input"
                            placeholder="Município"
                        />
                        <Input
                            type="text"
                            value={profile.province}
                            onChange={(e) => handleProfileChange('province', e.target.value)}
                            className="mobile-input"
                            placeholder="Província"
                        />
                    </div>

                    <div className="mb-4 space-y-[24px]">
                        <Input
                            type="text"
                            value={profile.email}
                            className="mobile-input"
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
                            className="mobile-input"
                            placeholder="Número de telefone"
                        />                       
                        <select
                            name="gender"
                            id="gender"
                            value={profile.gender}
                            onChange={(e) => handleProfileChange('gender', e.target.value)}
                            className="p-0 w-full m-0 rounded-md bg-[var(--input)] shadow-sm border-none outline-none py-[14px] px-[16px]"
                        >
                            <option value="male">Masculino</option>
                            <option value="fame">Feminino</option>
                        </select>
                        <Textarea
                            value={profile.description}
                            onChange={(e) => handleProfileChange('description', e.target.value)}
                            className="mobile-input"
                            placeholder="Decrição do seu perfil"
                        />
                    </div>
                    <div className="flex flex-col w-full justify-center gap-4">
                        <button
                            className="w-full bg-[var(--black)] text-white py-3 rounded-full"
                            onClick={handleUpdateProfile}
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
                        <br />
                        <br />
                        <button
                            className="w-full bg-zinc-600 text-white py-3 rounded-full"
                            onClick={handleChangePassword}
                        >
                            Mudar palavra passe
                        </button>
                    </div>
                    <br /><br />
                    {profile.type === "seller" && (
                        <>
                            <strong className="font-bold text-[var(--black)]">Sobre a Empresa</strong>
                            <br /><br />
                            <div className="mb-4 space-y-[24px]">
                                <Input
                                    type="text"
                                    value={profile.companyName}
                                    className="mobile-input"
                                    disabled
                                />
                            </div>

                            <div className="mb-4 space-y-[24px]">
                                <Input
                                    type="text"
                                    value={profile.bankName}
                                    className="mobile-input"
                                    disabled
                                />
                            </div>

                            <div className="mb-4 space-y-[24px]">
                                <Input
                                    type="text"
                                    value={profile.IBAN}
                                    className="mobile-input"
                                    disabled
                                />
                            </div>

                            <div className="mb-4 space-y-[24px]">
                                <Input
                                    type="text"
                                    value={profile.alvara}
                                    className="mobile-input"
                                    disabled
                                />
                            </div>

                            <div className="mb-4 space-y-[24px]">
                                <Input
                                    type="text"
                                    value={profile.certificado}
                                    className="mobile-input"
                                    disabled
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="h-[100px]" />
            </div>
        );
};

export default ProfileForm;
