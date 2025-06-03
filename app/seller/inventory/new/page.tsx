'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useBrands from '@/hooks/useBrands';
import useVehicle from '@/hooks/useVehicle';
import { Brand } from '@/models/brand';
import { useCallback, useState } from 'react';
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon, PencilIcon, X, Upload, Car, Info, Camera, ArrowLeft, ArrowRight, Check } from "lucide-react";
import useImage from '@/hooks/useImage';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from '@/contexts/userContext';
import { toast } from '@/hooks/use-toast';
import { Colors } from '@/constants/colors';
import Image from 'next/image';
import Loader from '@/components/loader';
import { useInventoryContext } from '@/contexts/InventoryContext';
import { useMaterialLayout } from '@/contexts/LayoutContext';

type GalleryItemProps = {
  add: (imageUrl: string[]) => void;
  remove: (index: number) => void;
  actions: {
    saveAll: () => Promise<string[] | undefined>;
    blobs: () => Promise<Blob[] | undefined>;
    selectImages: () => void;
    discard: (index: number) => void;
  },
  images: File[],
  loading: boolean
};

const GalleryItem: React.FC<GalleryItemProps> = ({ add, remove, actions, images, loading }) => {
  const [previewImages, setPreviewImages] = useState<(string | null)[]>([]);
  const [error, setError] = useState<undefined | string>()

  useEffect(() => {
    const previews = images.map((image) => {
      if (image) {
        return URL.createObjectURL(image);
      }
      return null;
    });

    setPreviewImages(previews);

    return () => {
      previews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [images]);

  const saveAllImages = async () => {
    if (images.length < 4) {
      setError("Carregue 4 imagens!")
      setTimeout(() => {
        setError(undefined)
      }, 5000);
    } else {
      const photoURLs = await actions.saveAll();
      if (photoURLs) {
        add(photoURLs)
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    actions.discard(index);
    remove(index)
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {previewImages.map((preview, index) => (
          <div
            key={index}
            className="group relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden aspect-square flex items-center justify-center bg-gray-50 hover:border-blue-400 transition-all duration-300"
          >
            {preview ? (
              <>
                <Image
                  width={200}
                  height={200}
                  src={preview}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="h-8 w-8 mb-2" />
                <span className="text-xs">Vazio</span>
              </div>
            )}
          </div>
        ))}

        {previewImages.length < 15 && (
          <div
            className="group relative border-2 border-dashed border-gray-300 rounded-xl aspect-square flex items-center justify-center cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-400 transition-all duration-300"
            onClick={() => actions.selectImages()}
          >
            <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-blue-600 transition-colors">
              <div className="p-3 rounded-full bg-white shadow-sm group-hover:shadow-md transition-shadow mb-2">
                <Upload className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Adicionar</span>
              <span className="text-xs text-gray-400">Imagem</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <span className='text-red-600 text-sm font-medium'>{error}</span>
        </div>
      )}

      <div className="text-center">
        <p className="text-sm text-gray-500">
          {images.length}/15 imagens • Mínimo 4 imagens necessárias
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((images.length / 4) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const vehicleSchema = z.object({
  brand: z.string({ message: "Selecione uma marca." }),
  model: z.string({ message: "Selecione um modelo." }),
  condition: z.enum(["Novo", "Usado"], { message: "Informe a condição do carro!" }),
  licensePlate: z.string({ message: "Digite a matrícula." }),
  manufactureYear: z
    .string()
    .regex(/^\d{4}$/, "Ano de fabricação deve ter 4 dígitos.")
    .refine((value) => {
      const year = parseInt(value, 10);
      return year <= new Date().getFullYear();
    }, "Ano de fabricação não pode ser no futuro.")
    .refine((value) => parseInt(value, 10) > 0, "Ano inválido."),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Preço deve ser um número positivo, podendo ter até 2 casas decimais.")
    .refine((value) => parseFloat(value) > 0, "Preço deve ser maior que 0."),
  vehicleType: z.enum(["car", "moto"]),
  mileage: z
    .string()
    .regex(/^\d+$/, "Quilometragem deve ser um número inteiro.")
    .refine((value) => parseInt(value, 10) >= 0, "Quilometragem não pode ser negativa."),
  color: z.string({ message: "Digite a cor." }),
  bar_code: z.string({ message: "Digite o código de barras." }),
  internal_code: z.string({ message: "Digite o código interno." }),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  gallery: z.array(z.string()).min(4, "Adicione no mínimo 4 imagens à galeria. Salve as imagens antes de cadastrar."),
  fuel: z.enum(["Gasolina", "Diesel", "Elétrico", "Híbrido"], { message: "Selecione o tipo de combustível." }),
  transmission: z.enum(["Manual", "Automática", "CVT"], { message: "Selecione o tipo de transmissão." }),
  enginePower: z
    .string()
    .regex(/^\d+$/, "Potência do motor deve ser um número inteiro.")
    .refine((value) => parseInt(value, 10) > 0, "Potência do motor deve ser maior que 0."),
  location: z.string().min(3, "Informe uma localização válida."),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
  const steps = [
    { title: "Informações Básicas", icon: Car },
    { title: "Detalhes", icon: Info },
    { title: "Especificações", icon: Camera }
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                isActive ? "bg-blue-600 border-blue-600 text-white" :
                  isCompleted ? "bg-green-500 border-green-500 text-white" :
                    "bg-gray-100 border-gray-300 text-gray-400"
              )}>
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className={cn(
                "text-xs mt-2 font-medium hidden sm:block",
                isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"
              )}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-16 sm:w-24 h-0.5 mx-2 transition-colors duration-300",
                index < currentStep ? "bg-green-500" : "bg-gray-300"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const FormSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({
  title,
  description,
  children
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

const FormField: React.FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}> = ({ label, error, children, required = false }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-red-500 text-sm flex items-center gap-1">
        <X className="h-3 w-3" />
        {error}
      </p>
    )}
  </div>
);

const VehicleForm = () => {
  const useImageValues = useImage();
  const { user } = useUser()
  const { profile } = useUser(user?.uid ?? '')
  const { vehicle: vehicleData } = useVehicle();
  const { addVehicle } = useInventoryContext()
  const { brandsList } = useBrands();
  const [brand, setBrand] = useState<Brand>();
  const [currentSection, setCurrentSection] = useState(0);
  const [changesOnLicence, setChangesOnLicence] = useState('')
  const [error, setError] = useState<undefined | string>()
  const { setLoading } = useMaterialLayout()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      ...vehicleData,
      gallery: vehicleData.gallery,
    },
  });

  useEffect(() => {
    document.querySelectorAll('input').forEach((input) => {
      input.setAttribute('autocomplete', 'off');
    });
  }, []);

  const formatLicensePlate = (value: string) => {
    const cleanValue = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    return cleanValue
      .replace(/^([A-Z]{2})/, '$1-')
      .replace(/^([A-Z]{2}-\d{2})/, '$1-')
      .replace(/^([A-Z]{2}-\d{2}-\d{2})/, '$1-')
      .substring(0, 11);
  };

  const addImageToGallery = (imageUrl: string[]) => {
    setValue('gallery', [...imageUrl]);
  };

  const handleRemoveImage = (index: number) => {
    const filters = getValues('gallery').filter((_, i) => i !== index)
    setValue('gallery', [...filters]);
  };

  const handleRemoveAllImages = () => {
    setValue('gallery', []);
  }

  const onError = (errors: any) => {
    const firstErrorKey = Object.keys(errors)[0];
    const firstErrorMessage = errors[firstErrorKey]?.message ?? 'Campo obrigatório';

    toast({
      title: "Erro: Impossivel submeter formulário!",
      description: firstErrorMessage,
    });
  };

  const handleSubmitAll = async () => {
    setLoading(true);

    if (useImageValues.images.length < 4) {
      setLoading(false);
      toast({
        title: "Carregue no mínimo 4 imagens!",
        description: "",
      });
      return;
    }

    const photoURLs = await useImageValues.actions.saveAll();
    if (photoURLs) {
      setValue("gallery", photoURLs);
      const formState = getValues();
      const validationResult = await vehicleSchema.safeParseAsync(formState);

      if (!validationResult.success) {
        const errors = validationResult.error.formErrors.fieldErrors;
        const firstField = Object.keys(errors) as Array<keyof typeof errors>;
        const firstMessage = firstField.length > 0 ? errors[firstField[0]]?.[0] : "Erro de validação";

        setLoading(false);
        toast({
          title: "Erro: Impossivel submeter formulário!",
          description: firstMessage !== 'Required' ? firstMessage : "Todos os campos são de preenchimento obrigatório",
        });
        return;
      }

      onSubmit(getValues());
    }
  }

  const onSubmit = useCallback(async (data: VehicleFormData) => {
    const specifications = [
      { label: 'Combustível', description: data.fuel },
      { label: 'Transmissão', description: data.transmission },
      { label: 'Potência do Motor', description: `${data.enginePower} CV` },
      { label: 'Localização', description: data.location },
    ];

    const { transmission, enginePower, fuel, location, ...rest } = data
    addVehicle({
      ...rest,
      dealershipId: "",
      vehicleId: data.licensePlate,
      photo: data.gallery[0],
      userId: profile?.userId ?? "",
      specifications
    }, 1, profile?.userId ?? "");
    reset()
    handleRemoveAllImages()

    setTimeout(() => {
      setLoading(false)
      window.location.href = "/seller/inventory/";
    }, 2000);
  }, [user, profile]);

  const [value, setPriceValue] = useState("AOA 0,00")

  const handleNext = () => {
    if (currentSection < 2) setCurrentSection((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentSection > 0) setCurrentSection((prev) => prev - 1);
  };

  const sections = [
    // Section 1: Basic Information
    (
      <FormSection
        title="Informações Básicas"
        description="Dados fundamentais do veículo"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Marca" error={errors.brand?.message} required>
            <Controller
              name="brand"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    const selectedBrand = brandsList.find(
                      (b) => b.brandName === value
                    );
                    setBrand(selectedBrand);
                    setValue("brand", value);
                  }}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandsList.map((brandItem, _index: number) => (
                      <SelectItem key={_index} value={brandItem.brandName}>
                        {brandItem.brandName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField label="Modelo" error={errors.model?.message} required>
            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => setValue("model", value)}
                  disabled={!brand}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {brand?.models.map((model, index: number) => (
                      <SelectItem key={index} value={model.modelName}>
                        {model.modelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Condição" error={errors.condition?.message} required>
            <Controller
              name="condition"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => setValue("condition", value === "Novo" ? "Novo" : "Usado")}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione a condição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Novo">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Novo
                      </div>
                    </SelectItem>
                    <SelectItem value="Usado">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        Usado
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField label="Tipo de Veículo" error={errors.vehicleType?.message} required>
            <Controller
              name="vehicleType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => setValue("vehicleType", value === "car" ? "car" : "moto")}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione o tipo de veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">🚗 Carro</SelectItem>
                    <SelectItem value="moto">🏍️ Moto</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Matrícula" error={errors.licensePlate?.message} required>
            <Controller
              name="licensePlate"
              control={control}
              render={({ field }) => (
                <Input
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...field}
                  placeholder="XX-00-00-XX"
                  onChange={(e) => {
                    if (e.target.value.length > changesOnLicence.length) {
                      const formattedValue = formatLicensePlate(e.target.value);
                      field.onChange(formattedValue);
                      setChangesOnLicence(e.target.value)
                    } else {
                      field.onChange(e.target.value);
                      setChangesOnLicence(e.target.value)
                    }
                  }}
                  value={field.value}
                />
              )}
            />
          </FormField>

          <FormField label="Ano de Fabricação" error={errors.manufactureYear?.message} required>
            <Controller
              name="manufactureYear"
              control={control}
              render={({ field }) => (
                <Input
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...field}
                  placeholder="2024"
                  maxLength={4}
                />
              )}
            />
          </FormField>
        </div>
      </FormSection>
    ),

    // Section 2: Details
    (
      <FormSection
        title="Detalhes do Veículo"
        description="Informações específicas e identificação"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Preço" error={errors.price?.message} required>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pl-16"
                    placeholder="0,00"
                    value={value}
                    onChange={(e) => {
                      const numbersOnly = e.target.value.replace(/\D/g, '');
                      const numberValue = Number(numbersOnly) / 100;
                      const formattedValue = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(numberValue);

                      setPriceValue(formattedValue.replace('R$', 'AOA'));
                      setValue("price", numberValue.toString())
                    }}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    AOA
                  </div>
                </div>
              )}
            />
          </FormField>

          <FormField label="Quilometragem" error={errors.mileage?.message} required>
            <Controller
              name="mileage"
              control={control}
              render={({ field }) => {
                const formatMileage = (value: string) => {
                  const numbers = value.replace(/\D/g, '');
                  if (!numbers || parseInt(numbers) === 0) {
                    return "0,00";
                  }
                  const numeric = Number(numbers) / 100;
                  const formatted = new Intl.NumberFormat('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(numeric);
                  return formatted;
                };

                const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  const formattedValue = formatMileage(rawValue);
                  e.target.value = formattedValue;
                  field.onChange(rawValue);
                };

                return (
                  <div className="relative">
                    <Input
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                      value={formatMileage(field.value)}
                      placeholder="0,00"
                      onChange={handleInputChange}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      km
                    </span>
                  </div>
                );
              }}
            />
          </FormField>
        </div>

        <FormField label="Cor" error={errors.color?.message} required>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => setValue("color", value)}
              >
                <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Selecione a cor" />
                </SelectTrigger>
                <SelectContent>
                  {Colors.map((color) => (
                    <SelectItem key={color.hex} value={color.nome}>
                      <div className="flex items-center space-x-3">
                        <div
                          style={{ backgroundColor: color.hex }}
                          className="w-5 h-5 rounded-full border border-gray-200"
                        />
                        <span>{color.nome}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Código de Barras" error={errors.bar_code?.message} required>
            <Controller
              name="bar_code"
              control={control}
              render={({ field }) => (
                <Input
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...field}
                  placeholder="Digite o código de barras"
                />
              )}
            />
          </FormField>

          <FormField label="Código Interno" error={errors.internal_code?.message} required>
            <Controller
              name="internal_code"
              control={control}
              render={({ field }) => (
                <Input
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...field}
                  placeholder="Digite o código interno"
                />
              )}
            />
          </FormField>
        </div>
      </FormSection>
    ),

    // Section 3: Specifications & Gallery
    (
      <div className="space-y-8">
        <FormSection
          title="Especificações Técnicas"
          description="Características técnicas do veículo"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Combustível" error={errors.fuel?.message} required>
              <Controller
                name="fuel"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => setValue("fuel", value as "Gasolina" | "Diesel" | "Elétrico" | "Híbrido")}
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Selecione o tipo de combustível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasolina">⛽ Gasolina</SelectItem>
                      <SelectItem value="Diesel">🛢️ Diesel</SelectItem>
                      <SelectItem value="Elétrico">🔋 Elétrico</SelectItem>
                      <SelectItem value="Híbrido">🔄 Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField label="Transmissão" error={errors.transmission?.message} required>
              <Controller
                name="transmission"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => setValue("transmission", value as "Manual" | "Automática" | "CVT")}
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Selecione o tipo de transmissão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">🎛️ Manual</SelectItem>
                      <SelectItem value="Automática">⚙️ Automática</SelectItem>
                      <SelectItem value="CVT">🔧 CVT</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Potência do Motor" error={errors.enginePower?.message} required>
              <Controller
                name="enginePower"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                      {...field}
                      placeholder="150"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      CV
                    </span>
                  </div>
                )}
              />
            </FormField>

            <FormField label="Localização" error={errors.location?.message} required>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Input
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    {...field}
                    placeholder="Luanda, Angola"
                  />
                )}
              />
            </FormField>
          </div>

          <FormField label="Descrição" error={errors.description?.message} required>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  {...field}
                  placeholder="Descreva as características, estado de conservação e diferenciais do veículo..."
                />
              )}
            />
          </FormField>
        </FormSection>

        <FormSection
          title="Galeria de Imagens"
          description="Adicione fotos de alta qualidade do veículo"
        >
          <FormField label="Fotografias do Veículo" error={errors.gallery?.message} required>
            <GalleryItem
              {...useImageValues}
              remove={handleRemoveImage}
              add={addImageToGallery}
            />
          </FormField>
        </FormSection>
      </div>
    )
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Adicionar Novo Veículo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Preencha as informações do veículo para adicioná-lo ao seu inventário
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentSection} totalSteps={3} />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
          {/* Current Section */}
          <div className="transition-all duration-500 ease-in-out">
            {sections[currentSection]}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="w-full sm:w-auto h-12 px-8 border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex-1 text-center">
              <span className="text-sm text-gray-500">
                Etapa {currentSection + 1} de 3
              </span>
            </div>

            {currentSection < 2 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmitAll}
                disabled={useImageValues.loading}
                className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
              >
                {useImageValues.loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Cadastrar Veículo
                  </>
                )}
              </Button>
            )}
          </div>
        </form>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentSection + 1) / 3) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Início</span>
            <span>Progresso: {Math.round(((currentSection + 1) / 3) * 100)}%</span>
            <span>Finalizar</span>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Dicas para um cadastro eficiente</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use fotos de alta qualidade e bem iluminadas</li>
                <li>• Inclua imagens do exterior, interior e motor</li>
                <li>• Seja detalhado na descrição do veículo</li>
                <li>• Verifique todas as informações antes de finalizar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleForm;
