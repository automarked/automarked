import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";

interface AlertProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
  }
  
  const Alert: React.FC<AlertProps> = ({ isOpen, onClose, message }) => {
    useEffect(() => {
      if (isOpen) {
        const timer = setTimeout(() => {
          onClose(); // Fecha o alerta após 5 segundos
        }, 5000);
  
        return () => clearTimeout(timer); // Limpeza do timer
      }
    }, [isOpen, onClose]);
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger />
        <DialogContent className="max-w-[400px]">
          <DialogTitle>{message}</DialogTitle>
          <DialogDescription>Este alerta desaparecerá após 5 segundos.</DialogDescription>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default Alert;