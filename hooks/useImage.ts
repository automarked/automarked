import { useCallback, useState } from "react";
import { createdInstance } from "./useApi";

export default function useImage() {
  const [images, setImages] = useState<File[]>([]); // Agora gerencia várias imagens
  const [loading, setLoading] = useState(false)

  // Limitar o número máximo de imagens
  const MAX_IMAGES = 9;

  // Método para descartar uma imagem específica
  const discard = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Converter todas as imagens para blobs (opcional)
  const blobs = useCallback(async (): Promise<Blob[] | undefined> => {
    if (images.length === 0) return

    try {
      return images.map((image) => image);
    } catch (error) {
      console.error("Erro ao converter as imagens para Blob:", error);
    }
  }, [images]);

  // Salvar todas as imagens no servidor
  const saveAll = useCallback(async (): Promise<string[] | undefined> => {
    if (images.length === 0 || !createdInstance) return;

    setLoading(true)
    try {
      const urls: string[] = [];
      console.log("enviando...");

      for (const image of images) {
        const formData = new FormData();
        formData.append("file", image, image.name);
        console.log("requisição...");

        const response = await createdInstance.post<{ message: string; fileId: string, fileName: string, webViewLink: string }>(
          "/upload",
          formData
        );

        console.log(response);

        if (response.status === 200 && response.data.webViewLink) {
          urls.push(response.data.webViewLink);
        }
      }

      return urls;
    } catch (error) {
      console.error("Erro ao enviar as imagens:", error);
    } finally {
      setLoading(false)
    }
  }, [images]);

  // Selecionar múltiplas imagens
  const selectImages = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true; // Permitir seleção múltipla
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const selectedFiles = Array.from(target.files);

        // Garantir que o número máximo de imagens seja respeitado
        setImages((prevImages) => {
          const newImages = [...prevImages, ...selectedFiles];
          return newImages.slice(0, MAX_IMAGES); // Cortar se exceder o limite
        });
      }
    };
    input.click();
  }, []);

  return {
    images, // Todas as imagens selecionadas
    loading,
    actions: {
      saveAll,
      blobs,
      selectImages,
      discard
    },
  };
}
