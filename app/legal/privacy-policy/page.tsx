import GoBack from "@/components/goBack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-gray-900 dark:text-gray-100">
      <div className="fixed left-0 right-0 top-0 w-screen flex items-center h-12 bg-white shadow-sm">
        <GoBack className='relative mt-[-15px]' />
        <div className="flex items-center mx-auto space-x-2">
          {/* <Image
            src={"/images/logo.png"}
            width={30}
            height={30}
            alt="Logo da Automarked"
          /> */}
          <h1 className="font-semibold">Automarked</h1>
        </div>
      </div>
      <Card className="shadow-lg rounded-2xl mt-10 p-4 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-md font-bold text-center">Política de Privacidade</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Este documento serve para informar os usuários do Automarked sobre como seus dados são coletados, armazenados e utilizados.
          </p>

          <h2 className="text-sm font-semibold mt-6">1. Introdução</h2>
          <p className="mb-4 text-xs">Bem-vindo ao Automarked, um portal online operado pela ARQUITEC3D, LDA para a compra e venda de veículos. Ao acessar e utilizar nossa plataforma, você concorda com os presentes Termos e Condições.</p>

          <h2 className="text-sm font-semibold mt-6">2. Cadastro e Conta de Usuário</h2>
          <p className="mb-4 text-xs">Para utilizar determinados recursos do Automarked, você deverá criar uma conta, fornecendo informações precisas e atualizadas, como nome, e-mail, telefone, província, município, data de nascimento e gênero.</p>

          <h2 className="text-sm font-semibold mt-6">3. Uso da Plataforma</h2>
          <p className="mb-4 text-xs">É proibido utilizar a plataforma para atividades ilegais, fraudulentas ou que violem direitos de terceiros.</p>

          <h2 className="text-sm font-semibold mt-6">4. Anúncios e Transações</h2>
          <p className="mb-4 text-xs">Os usuários podem criar anúncios de veículos, comprometendo-se a fornecer informações verdadeiras e precisas.</p>

          <h2 className="text-sm font-semibold mt-6">5. Responsabilidades e Isenções de Garantia</h2>
          <p className="mb-4 text-xs">Automarked não garante que a plataforma estará sempre disponível, livre de erros ou falhas técnicas.</p>

          <h2 className="text-sm font-semibold mt-6">6. Propriedade Intelectual</h2>
          <p className="mb-4 text-xs">Todo o conteúdo do Automarked, incluindo logotipos, textos, imagens e design, pertence à ARQUITEC3D, LDA e não pode ser reproduzido sem autorização prévia.</p>

          <h2 className="text-sm font-semibold mt-6">7. Modificações dos Termos e Condições</h2>
          <p className="mb-4 text-xs">Automarked poderá modificar estes Termos e Condições a qualquer momento. O uso contínuo da plataforma após alterações significa a aceitação dos novos termos.</p>

          <h2 className="text-sm font-semibold mt-6">8. Legislação Aplicável e Foro</h2>
          <p className="mb-4 text-xs">Estes Termos e Condições são regidos pelas leis vigentes em Angola. Qualquer disputa será resolvida nos tribunais competentes de Luanda.</p>

          <h2 className="text-sm font-semibold mt-6">9. Contato</h2>
          <p className="mb-2 text-xs flex items-center gap-2">
            <Mail className="w-4 h-4" /> Automarked.app@gmail.com
          </p>
          <p className="mb-2 text-xs flex items-center gap-2">
            <Mail className="w-4 h-4" /> e.s.jb2u@gmail.com
          </p>
          <p className="flex text-xs items-center gap-2">
            <Phone className="w-4 h-4" /> +244 939 282 205
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
