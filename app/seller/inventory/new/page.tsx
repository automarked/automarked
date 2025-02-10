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
import { cn } from "@/lib/utils"; // Função utilitária para classes condicionais, caso necessário
import { ImageIcon, PencilIcon } from "lucide-react"; // Ícones compatíveis com ShadCN
import useImage from '@/hooks/useImage';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from '@/contexts/userContext';
import Stepper from '@/components/both/steper';
import { toast } from '@/hooks/use-toast';

type GalleryItemProps = {
  add: (imageUrl: string) => void
};

const GalleryItem: React.FC<GalleryItemProps> = ({ add }) => {
  const { actions, image } = useImage();
  const [previewImage, setPreviewImage] = useState<string | null>(null); // URL de pré-visualização

  // Gerar pré-visualização da imagem selecionada
  useEffect(() => {
    if (image) {
      const previewURL = URL.createObjectURL(image);
      setPreviewImage(previewURL);

      return () => {
        URL.revokeObjectURL(previewURL); // Limpa a memória quando o componente desmonta ou a URL muda
      };
    }
  }, [image]);

  // Salvar e adicionar a imagem
  useEffect(() => {
    const saveImage = async () => {
      if (image) {
        const photoURL = await actions.save();
        if (photoURL) {
          add(photoURL);
        }
      }
    };

    saveImage();
  }, [image]);

  return (
    <div className="relative border border-gray-200 rounded-md overflow-hidden aspect-square flex items-center justify-center">
      {previewImage ? (
        <img
          src={previewImage}
          alt="Selecionada"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <ImageIcon className="h-8 w-8" />
          {/* <p className="text-sm text-center">Selecione uma imagem</p> */}
        </div>
      )}
      <Button
        variant="ghost"
        className={cn(
          "absolute top-2 right-2 p-2 rounded-full bg-white shadow",
          "hover:bg-gray-100 transition"
        )}
        onClick={actions.selectImage}
      >
        <PencilIcon className="h-5 w-5 text-gray-700" />
      </Button>
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
  gallery: z.array(z.string()).min(9, "Adicione 9 imagens à galeria."), // Garante que a galeria tenha no mínimo 9 imagens
  specifications: z.array(
    z.object({
      label: z.string(),
      description: z.string(),
    })
  ).optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

const VehicleForm = () => {
  const { user } = useUser()
  const { profile } = useUser(user?.uid ?? '')
  const { vehicle: vehicleData, actions } = useVehicle();
  const { brandsList } = useBrands();
  const [brand, setBrand] = useState<Brand>();
  const [currentSection, setCurrentSection] = useState(0); // Estado para controlar a seção atual
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
      specifications: [

      ],
      gallery: vehicleData.gallery,
    },
  });

  const addImageToGallery = (imageUrl: string) => {
    const currentGallery = getValues('gallery');
    setValue('gallery', [...currentGallery, imageUrl]);
  };

  const addSpecification = (key: string, value: { label: string, description: string }) => {
    const currentSpecifications = getValues('specifications');
  };

  const onError = (errors: any) => {
    const firstErrorKey = Object.keys(errors)[0];
    const firstErrorMessage = errors[firstErrorKey]?.message || "Erro no formulário";
    toast({
      title: "Erro: Impossivel submeter formulário!",
      description: firstErrorMessage,
    });
  };

  const onSubmit = useCallback(async (data: VehicleFormData) => {
    const result = await actions.handleSubmit({
      ...data,
      dealershipId: "",
      vehicleId: "",
      photo: "",
      userId: profile?.userId ?? "",
      specifications: getValues("specifications") || []
    });
    reset()
  }, [user]);

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
                <SelectTrigger className="w-full mobile-input">
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
                <SelectTrigger className="w-full mobile-input">
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
                <SelectTrigger className="w-full mobile-input">
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
          <Label className='ml-2'>Matrícula</Label>
          <Controller
            name="licensePlate"
            control={control}
            render={({ field }) => (
              <Input
                className='mobile-input'
                {...field}
                placeholder="Digite a matrícula"
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
                className='mobile-input'
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
          <Label className='ml-2'>Preço</Label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input
                className='mobile-input'
                {...field}
                placeholder="Digite o preço"
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
                <SelectTrigger className="w-full mobile-input">
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
          <Label className='ml-2'>Quilometragem</Label>
          <Controller
            name="mileage"
            control={control}
            render={({ field }) => (
              <Input
                className='mobile-input'
                {...field}
                placeholder="Digite a quilometragem"
              />
            )}
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
              <Input
                className='mobile-input'
                {...field}
                placeholder="Digite a cor"
              />
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
                className='mobile-input'
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
        {/* Código Interno */}
        <div>
          <Label className='ml-2'>Código Interno</Label>
          <Controller
            name="internal_code"
            control={control}
            render={({ field }) => (
              <Input
                className='mobile-input'
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
                className='mobile-input'
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
          <Label className='ml-2'>Galeria (9 fotografias)</Label>
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, index) => (
              <GalleryItem key={index} add={addImageToGallery} />
            ))}
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
        className="space-y-8 max-w-4xl mx-auto p-4 mb-24"
      >
        <h2 className="text-2xl text-center font-semibold">Adicionar novo veículo</h2>


        <div className='flex items-center gap-4'>
          <Stepper currentStep={currentSection} setCurrentStep={setCurrentSection} />
        </div>

        <div className='flex flex-col gap-2'>
          {sections[currentSection]}
        </div>

        <div className="flex justify-between">
          {currentSection > 0 && (
            <Button type="button" onClick={handlePrevious}>
              Voltar
            </Button>
          )}
          {currentSection < sections.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Próximo
            </Button>
          ) : (
            <Button type="submit" className="bg-blue-600 text-white">
              Cadastrar veículo
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default VehicleForm;
