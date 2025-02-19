import GoBack from "@/components/goBack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function TermsOfUse() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      <div className="fixed left-0 right-0 top-0 w-screen flex items-center h-12 bg-white shadow-sm">
        <GoBack className='relative mt-[-15px]' />
        <div className="flex items-center mx-auto space-x-2">
          <Image
            src={"/images/logo.png"}
            width={30}
            height={30}
            alt="Logo da Automarked"
          />
          <h1 className="font-semibold">Automarked</h1>
        </div>
      </div>
      <Card className="shadow-lg rounded-2xl mt-10 p-4 bg-white dark:bg-gray-900">
        <CardHeader>           
          <CardTitle className="text-md font-bold text-center">Termos e Condições de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Este documento serve para informar os usuários do Automarked sobre as regras de utilização do serviço.
          </p>

          <h2 className="text-sm font-semibold mt-6">1. Introdução</h2>
          <p className="mb-4 text-xs">Bem-vindo ao Automarked, um portal online operado pela ARQUITEC3D, LDA para a compra e venda de veículos...</p>
          
          <h2 className="text-sm font-semibold mt-6">2. Definições</h2>
          <p className="mb-4 text-xs">Automarked: Plataforma online de compra e venda de veículos. Usuário: Pessoa que acessa e utiliza a plataforma...</p>
          
          <h2 className="text-sm font-semibold mt-6">3. Cadastro e Uso da Plataforma</h2>
          <p className="mb-4 text-xs">Para utilizar o Automarked, o usuário deve criar uma conta, fornecendo informações precisas e atualizadas...</p>
          
          <h2 className="text-sm font-semibold mt-6">4. Responsabilidades do Usuário</h2>
          <p className="mb-4 text-xs">O usuário deve utilizar a plataforma de forma lícita, sem infringir direitos de terceiros ou leis vigentes...</p>
          
          <h2 className="text-sm font-semibold mt-6">5. Publicação de Anúncios</h2>
          <p className="mb-4 text-xs">O anunciante deve garantir que as informações do veículo publicado sejam precisas e verídicas...</p>
          
          <h2 className="text-sm font-semibold mt-6">6. Privacidade e Proteção de Dados</h2>
          <p className="mb-4 text-xs">O Automarked coleta e trata dados pessoais conforme sua Política de Privacidade...</p>
          
          <h2 className="text-sm font-semibold mt-6">7. Limitação de Responsabilidade</h2>
          <p className="mb-4 text-xs">O Automarked não garante a conclusão de transações entre usuários nem a qualidade dos veículos anunciados...</p>
          
          <h2 className="text-sm font-semibold mt-6">8. Modificações no Termo de Uso</h2>
          <p className="mb-4 text-xs">O Automarked pode alterar estes Termos a qualquer momento, mediante aviso prévio aos usuários...</p>
          
          <h2 className="text-sm font-semibold mt-6">9. Legislação e Foro</h2>
          <p className="mb-4 text-xs">Estes Termos são regidos pelas leis da República de Angola...</p>
          
          <h2 className="text-sm font-semibold mt-6">10. Contato</h2>
          <p className="mb- text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" /> Automarked.app@gmail.com
          </p>
          <p className="mb-2 text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" /> e.s.jb2u@gmail.com
          </p>
          <p className="flex text-sm items-center gap-2">
            <Phone className="w-4 h-4" /> +244 939 282 205
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
