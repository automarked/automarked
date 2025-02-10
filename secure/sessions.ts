import CryptoJS from 'crypto-js';

type SecureKey = "secure-user" | "profile-type" | "secure-profile" | "refresh-access" | "expires-access" | "access";

const SECRET_KEY = 'x9kYkEnwj4cPKGXHCbXawa7cAm33';

// Função de criptografia
export const secureEncrypt = (token: string): string => {
    return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

// Função de descriptografia
export const secureDecrypt = (encryptedToken: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Função para armazenar dados com criptografia
export const secureStore = (key: SecureKey, data: string) => {
    try {
        const encryptedData = secureEncrypt(data); // Criptografa os dados
        localStorage.setItem(key, encryptedData);  // Salva no localStorage
    } catch (e) {
        console.error('Erro ao salvar token: ', e);
    }
};

// Função para recuperar dados com descriptografia
export const secureGet = <T = string | null>(key: SecureKey, options?: { JSONParse?: boolean }): T | null => {
    try {
        let secureInfo: string | null = localStorage.getItem(key);  // Obtém dados do localStorage

        if (secureInfo) {
            const decryptedData = secureDecrypt(secureInfo);  // Descriptografa os dados
            return options?.JSONParse ? JSON.parse(decryptedData) as T : (decryptedData as T);  // Retorna os dados como string ou objeto
        }

        return null;
    } catch (e) {
        console.error('Erro ao recuperar token: ', e);
        return null;
    }
};

// Função para remover dados
export const secureRemove = (key: SecureKey | "all") => {
    try {
        if (key === "all") {
            localStorage.clear();  // Limpa todos os itens do localStorage
        } else {
            localStorage.removeItem(key);  // Remove um item específico
        }
    } catch (e) {
        console.error('Erro ao remover token: ', e);
    }
};
