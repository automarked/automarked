'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { toast } from "@/hooks/use-toast";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Sale from "@/models/sale";
import { formatCurrency } from "@/scripts/format-price";
import { EXEC_PAYMENT_URL, GET_PAYMENT_CLIENT_ID_URL, PAYMENT_CLIENT_TOKEN } from "@/constants/api";
import { useRouter } from "next/navigation";
import { createdInstance } from "@/hooks/useApi";
import { BadgeAlert } from "lucide-react";

interface PaymentTokenResponse {
  frame: string,
}

const Payment: React.FC<{ sale: Sale }> = ({ sale }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [paymentToken, setPaymentToken] = useState<PaymentTokenResponse | null>(null)

  const getPaymentId = useCallback(async () => {
    console.log({
      "saleId": sale.saleId, // salleId
      "amount": sale.price.toString(), // salePrice
    })

    const response = await createdInstance.post<PaymentTokenResponse>("/auth/payment", {
      "saleId": sale.saleId, // salleId
      "amount": sale.price.toString(), // salePrice
    })

    console.log("Here")
    console.log(response)

    if (response.status === 200) {
      const data = response.data
      setPaymentToken(data);
      console.log(data)
    }

  }, [setPaymentToken])

  useEffect(() => {
    getPaymentId()
    
    console.log("Here")
  }, [])

  const showToast = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  const handleSubmit = async (e: FormEvent) => {

  }

  return (
    <div className="h-screen bg-zinc-100">

      <div className="space-y-1.5 pb-14">
        <div className="p-2 flex flex-col justify-center items-center space-y-1.5">
          <Card className="grow w-full shadow-none py-4">
            {/* <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard strokeWidth={1.5} />
                <span>Pagamento</span>
              </CardTitle>
            </CardHeader> */}
            <CardContent className="flex">
              <div className="font-bold">Montante:</div>
              <div className="ms-2">{formatCurrency(sale.price)}</div>
            </CardContent>
          </Card>
        </div>
        <div className="p-2 flex flex-col justify-center items-center space-y-1.5">
          <Card className="grow w-full shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Image
                  width={100}
                  height={100}
                  src={'/images/emis.png'}
                  alt="Imagem do produto"
                  className="w-8 h-8 object-cover"
                />
                <span>Pagamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center py-4">
                <BadgeAlert size={20} />
                <span className="ms-2">O se</span>
              </div>
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Input
                      id="phone"
                      type="number"
                      placeholder="Telefone"
                      className="shadow-none text-sm"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="absolute flex justify-center bg-white w-full bottom-0 py-2 px-4 gap-8">
          {paymentToken && (
            <Button
              onClick={() => window.location.href = paymentToken.frame}
              className="bg-[var(--black)] grow rounded-full"
            >
              Pagar
            </Button>
          )}
        </div>

      </div>
    </div >
  );
};

export default Payment;
