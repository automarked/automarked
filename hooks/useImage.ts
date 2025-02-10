import { useCallback, useState } from "react";
import { createdInstance } from "./useApi";

export default function useImage() {
  const [image, setImage] = useState<File | null>(null);

  const discard = () => {
    setImage(null)
  }

  const blob = useCallback(async (): Promise<Blob | undefined> => {
    if (!image) return;

    try {
      return image;
    } catch (error) {
      console.error("Erro ao converter a imagem para Blob:", error);
    }
  }, [image]);

  const save = useCallback(async (): Promise<string | undefined> => {
    if (!image || !createdInstance) return;

    try {
      const formData = new FormData();
      formData.append("file", image, image.name);

      const response = await createdInstance.post<{ message: string; record?: { photoURL: string } }>(
        "/file-upload-one",
        formData
      );

      if (response.status === 200) {
        console.log(response.data);
        return response.data.record?.photoURL;
      }
    } catch (error) {
      console.error("Erro ao enviar a imagem:", error);
    }
  }, [image]);

  const selectImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        setImage(target.files[0]);
      }
    };
    input.click();
  }, []);

  return {
    image,
    actions: {
      save,
      blob,
      selectImage,
      discard
    },
  };
}
