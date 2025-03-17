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
import { ImageIcon, PencilIcon } from "lucide-react";
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
      console.log(images)
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
    <div>
      <div className="grid grid-cols-3 gap-2">
        {previewImages.map((preview, index) => (
          <div
            key={index}
            className="relative border border-gray-200 rounded-md overflow-hidden aspect-square flex items-center justify-center"
          >
            {preview ? (
              <Image
                width={100}
                height={100}
                src={preview}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
            <div
              className={cn(
                "absolute cursor-pointer bottom-2 right-2 p-2 rounded-full bg-white shadow",
                "hover:bg-gray-100 transition"
              )}
              onClick={() => handleRemoveImage(index)}
            >
              Remover
            </div>
          </div>
        ))}
        {previewImages.length < 15 && (
          <div
            className="relative border border-gray-200 rounded-md overflow-hidden aspect-square flex items-center justify-center cursor-pointer"
            onClick={() => actions.selectImages()}
          >
            <div className="flex flex-col items-center justify-center text-gray-500">
              <PencilIcon className="h-8 w-8" />
              <p className="text-sm text-center">Adicionar Imagem</p>
            </div>
          </div>
        )}
      </div>

      <div>
        {error && <span className='text-red-600'>{error}</span>}
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
    .regex(/^\d{4}$/, "Ano de fabricação deve ter 4 dígitos.") // Verifica se o ano tem 4 dígitos
    .refine((value) => {
      const year = parseInt(value, 10);
      return year <= new Date().getFullYear(); // Verifica se o ano não é no futuro
    }, "Ano de fabricação não pode ser no futuro.")
    .refine((value) => parseInt(value, 10) > 0, "Ano inválido."),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Preço deve ser um número positivo, podendo ter até 2 casas decimais.")
    .refine((value) => parseFloat(value) > 0, "Preço deve ser maior que 0."), // Verifica se o pr
  vehicleType: z.enum(["car", "moto"]),
  mileage: z
    .string()
    .regex(/^\d+$/, "Quilometragem deve ser um número inteiro.") // Verifica se é um número inteiro
    .refine((value) => parseInt(value, 10) >= 0, "Quilometragem não pode ser negativa."), // Verifica se a quilometragem não é negativa
  color: z.string({ message: "Digite a cor." }),
  bar_code: z.string({ message: "Digite o código de barras." }),
  internal_code: z.string({ message: "Digite o código interno." }),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  gallery: z.array(z.string()).min(4, "Adicione no mínimo 4 imagens à galeria. Salve as imagens antes de cadastrar."), // Garante que a galeria tenha no mínimo 4 imagens
  fuel: z.enum(["Gasolina", "Diesel", "Elétrico", "Híbrido"], { message: "Selecione o tipo de combustível." }),
  transmission: z.enum(["Manual", "Automática", "CVT"], { message: "Selecione o tipo de transmissão." }),
  enginePower: z
    .string()
    .regex(/^\d+$/, "Potência do motor deve ser um número inteiro.")
    .refine((value) => parseInt(value, 10) > 0, "Potência do motor deve ser maior que 0."),
  location: z.string().min(3, "Informe uma localização válida."),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

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
  const {setLoading} = useMaterialLayout()

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
    // Get the first error message from the errors object
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
      // Now validate and submit form after gallery is set
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

  const formatPrice = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");

    const integerPart = numericValue.slice(0, -2) || "0"; // Parte inteira (sem centavos)
    const decimalPart = numericValue.slice(-2).padStart(2, "0"); // Parte decimal

    // Converte para formato monetário
    const formattedInteger = parseInt(integerPart, 10).toLocaleString("pt-AO");

    // Retorna o valor formatado
    return `AOA ${formattedInteger}, 00`;
  };

  const [value, setPriceValue] = useState("AOA 0,00")

  const sections = [
    (
      <>
        {/* Marca */}
        <div>
          <Label className='ml-2'>Marca</Label>
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
                <SelectTrigger className="w-full border-[1px] border-slate-100 py-6 px-4">
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  {brandsList.map((brandItem, _index: number) => (
                    <SelectItem
                      key={_index}
                      value={brandItem.brandName}
                    >
                      {brandItem.brandName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.brand && (
            <p className="text-red-600">{errors.brand.message}</p>
          )}
        </div>
        {/* Modelo */}
        <div>
          <Label className='ml-2'>Modelo</Label>
          <Controller
            name="model"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}

                onValueChange={(value) => setValue("model", value)}
              >
                <SelectTrigger className="w-full border-[1px] border-slate-100 py-6 px-4">
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
          {errors.model && <p className="text-red-600">{errors.model.message}</p>}
        </div>

        {/* Condição */}
        <div>
          <Label className='ml-2'>Condição</Label>
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => setValue("condition", value === "Novo" ? "Novo" : "Usado")}
              >
                <SelectTrigger className="w-full border-[1px] border-slate-100 py-6 px-4">
                  <SelectValue placeholder="Selecione a condição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Novo">Novo</SelectItem>
                  <SelectItem value="Usado">Usado</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.condition && (
            <p className="text-red-600">{errors.condition.message}</p>
          )}
        </div>

        {/* Matrícula */}
        <div>
          <Label className="ml-2">Matrícula</Label>
          <Controller
            name="licensePlate"
            control={control}
            render={({ field }) => (
              <Input
                className="border-[1px] border-slate-100 py-6 px-4"
                {...field}
                placeholder="Digite a matrícula"

                onChange={(e) => {
                  if (e.target.value.length > changesOnLicence.length) {
                    const formattedValue = formatLicensePlate(e.target.value);
                    field.onChange(formattedValue); // Atualiza o estado controlado
                    setChangesOnLicence(e.target.value)
                  } else {
                    field.onChange(e.target.value);
                    setChangesOnLicence(e.target.value)
                  }
                }}
                value={field.value} // Garante que o valor formatado seja exibido
              />
            )}
          />
          {errors.licensePlate && (
            <p className="text-red-600">{errors.licensePlate.message}</p>
          )}
        </div>

        {/* Ano de Fabricação */}
        <div>
          <Label className='ml-2'>Ano de Fabricação</Label>
          <Controller
            name="manufactureYear"
            control={control}
            render={({ field }) => (
              <Input
                className='border-[1px] border-slate-100 py-6 px-4'
                {...field}
                placeholder="Digite o ano de fabricação"

              />
            )}
          />
          {errors.manufactureYear && (
            <p className="text-red-600">{errors.manufactureYear.message}</p>
          )}
        </div>
      </>
    ),
    (
      <>
        {/* Preço */}
        <div>
          <Label className="ml-2">Preço</Label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input
                className="border-[1px] border-slate-100 py-6 px-4"
                placeholder="Digite o preço"

                value={value}
                onChange={(e) => {
                  // Remove tudo que não é número
                  const numbersOnly = e.target.value.replace(/\D/g, '');

                  // Converte para número e divide por 100 para considerar os centavos
                  const numberValue = Number(numbersOnly) / 100;

                  // Formata o número como moeda brasileira
                  const formattedValue = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(numberValue);

                  // Atualiza o estado com o valor formatado
                  setPriceValue(formattedValue.replace('R$', 'AOA'));

                  // Se precisar do valor numérico para enviar ao backend
                  const numericValue = numberValue;

                  setValue("price", numericValue.toString())
                  console.log(getValues('price'));

                }}
              />
            )}
          />
          {errors.price && <p className="text-red-600">{errors.price.message}</p>}
        </div>

        {/* Tipo de Veículo */}
        <div>
          <Label className='ml-2'>Tipo de Veículo</Label>
          <Controller
            name="vehicleType"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => setValue("vehicleType", value === "car" ? "car" : "moto")}
              >
                <SelectTrigger className="w-full border-[1px] border-slate-100 py-6 px-4">
                  <SelectValue placeholder="Selecione o tipo de veículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Carro</SelectItem>
                  <SelectItem value="moto">Moto</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.vehicleType && (
            <p className="text-red-600">{errors.vehicleType.message}</p>
          )}
        </div>

        {/* Quilometragem */}
        <div>
          <Label className="ml-2">Quilometragem</Label>
          <Controller
            name="mileage"
            control={control}
            render={({ field }) => {
              const formatMileage = (value: string) => {
                // Remove non-numeric characters
                const numbers = value.replace(/\D/g, '');

                // Handle empty or zero value
                if (!numbers || parseInt(numbers) === 0) {
                  return "0,00";
                }

                // Convert to number and format with thousands separator and decimal places
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

                // Update display value
                e.target.value = formattedValue;

                // Store raw numeric value in form state
                field.onChange(rawValue);
              };

              return (
                <div className="relative">
                  <Input
                    className="border-[1px] border-slate-100 py-6 px-4 pr-16"
                    value={formatMileage(field.value)}
                    placeholder="0,00"
                    onChange={handleInputChange}

                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">km</span>
                </div>
              );
            }}
          />

          {errors.mileage && <p className="text-red-600">{errors.mileage.message}</p>}
        </div>

        {/* Cor */}
        <div>
          <Label className='ml-2'>Cor</Label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => setValue("color", value)}

              >
                <SelectTrigger className="w-full border-[1px] border-slate-100 py-6 px-4">
                  <SelectValue placeholder="Selecione a cor" />
                </SelectTrigger>
                <SelectContent>
                  {Colors.map((color) => (
                    <SelectItem key={color.hex} value={color.nome}>
                      <div className="flex items-center space-x-2">
                        <div
                          style={{ backgroundColor: color.hex }}
                          className="w-4 h-4 rounded-full"
                        />
                        <span>{color.nome}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.color && <p className="text-red-600">{errors.color.message}</p>}
        </div>


        {/* Código de Barras */}
        <div>
          <Label className='ml-2'>Código de Barras</Label>
          <Controller
            name="bar_code"
            control={control}
            render={({ field }) => (
              <Input
                className='border-[1px] border-slate-100 py-6 px-4'
                {...field}
                placeholder="Digite o código de barras"

              />
            )}
          />
          {errors.bar_code && (
            <p className="text-red-600">{errors.bar_code.message}</p>
          )}
        </div>
      </>
    ),
    (
      <>
        <div>
          <Label className="ml-2">Combustível</Label>
          <Controller
            name="fuel"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => setValue("fuel", value as "Gasolina" | "Diesel" | "Elétrico" | "Híbrido")}

              >
                <SelectTrigger className="w-full border-[1px] border-slate-100 py-6 px-4">
                  <SelectValue placeholder="Selecione o tipo de combustível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gasolina">Gasolina</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Elétrico">Elétrico</SelectItem>
                  <SelectItem value="Híbrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.fuel && <p className="text-red-600">{errors.fuel.message}</p>}
        </div>

        <div>
          <Label className="ml-2">Transmissão</Label>
          <Controller
            name="transmission"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => setValue("transmission", value as "Manual" | "Automática" | "CVT")}

              >
                <SelectTrigger className="w-full border-[1px] border-slate-100 py-6 px-4">
                  <SelectValue placeholder="Selecione o tipo de transmissão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automática">Automática</SelectItem>
                  <SelectItem value="CVT">CVT</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.transmission && <p className="text-red-600">{errors.transmission.message}</p>}
        </div>

        <div>
          <Label className="ml-2">Potência do Motor (cv)</Label>
          <Controller
            name="enginePower"
            control={control}
            render={({ field }) => (
              <Input
                className="border-[1px] border-slate-100 py-6 px-4"
                {...field}
                placeholder="Digite a potência do motor"

              />
            )}
          />
          {errors.enginePower && <p className="text-red-600">{errors.enginePower.message}</p>}
        </div>

        <div>
          <Label className="ml-2">Localização</Label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Input
                className="border-[1px] border-slate-100 py-6 px-4"
                {...field}
                placeholder="Digite a localização"

              />
            )}
          />
          {errors.location && <p className="text-red-600">{errors.location.message}</p>}
        </div>

        {/* Código Interno */}
        <div>
          <Label className='ml-2'>Código Interno</Label>
          <Controller
            name="internal_code"
            control={control}
            render={({ field }) => (
              <Input
                className='border-[1px] border-slate-100 py-6 px-4'
                {...field}
                placeholder="Digite o código interno"
              />
            )}
          />
          {errors.internal_code && (
            <p className="text-red-600">{errors.internal_code.message}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <Label className='ml-2'>Descrição</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                className='border-[1px] border-slate-100 py-6 px-4'
                {...field}
                placeholder="Digite uma descrição"

              />
            )}
          />
          {errors.description && (
            <p className="text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Galeria */}
        <div>
          <Label className='ml-2'>Galeria (de 4 à 15 fotografias)</Label>
          <div className="w-full">

            <GalleryItem
              {...useImageValues}
              remove={handleRemoveImage}
              add={addImageToGallery}
            />

          </div>
          {errors.gallery && (
            <p className="text-red-600">{errors.gallery.message}</p>
          )}
        </div>

        {/* <div>
        <VehicleSpecifications handleInputChange={addSpecification} specifications={getValues('specifications')}/>
      </div> */}
      </>
    )
  ]

  const handleNext = () => {
    if (currentSection < sections.length - 1) setCurrentSection((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentSection > 0) setCurrentSection((prev) => prev - 1);
  };


  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="space-y-8 max-w-2xl mx-auto p-4 mb-24"
      >
        <h2 className="text-2xl text-center font-semibold">Adicionar novo veículo</h2>


        {/* <div className='flex items-center gap-4'>
          <Stepper currentStep={currentSection} setCurrentStep={setCurrentSection} />
        </div> */}

        <div className='flex flex-col gap-2 pb-12'>
          {sections[0]}
          {sections[1]}
          {sections[2]}
        </div>

        <div className="flex justify-center">

          <Button type="button" onClick={handleSubmitAll} className="w-full max-w-md py-6 mb-6 bg-[var(--black)] text-white rounded-full text-lg font-medium">
            Cadastrar veículo
          </Button>
          {/* )} */}
        </div>
      </form>    
    </>
  );
};

export default VehicleForm;
