import { AuthUser, LoginUserRequest } from 'auth/types';
import CryptoJS from 'crypto-js';

export const SECRET_KEY = import.meta.env.VITE_AES_SECRET;
export const STORAGE_PREFIX = 'tickup_';
export const TTL_MS = 24 * 60 * 60 * 1000;

export const encryptData = (data: unknown) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();

export const decryptData = (cipherText: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
};

export const setUserStorage = (user: AuthUser, remember: LoginUserRequest['remember'] = false) => {
  const obj = { data: user, expire: Date.now() + TTL_MS };
  const cipher = encryptData(obj);

  if (remember) {
    localStorage.setItem(STORAGE_PREFIX + 'user', cipher);
    sessionStorage.removeItem(STORAGE_PREFIX + 'user');
  } else {
    sessionStorage.setItem(STORAGE_PREFIX + 'user', cipher);
    localStorage.removeItem(STORAGE_PREFIX + 'user');
  }
};

export const getUserStorage = (): AuthUser | null => {
  try {
    const cipher =
      localStorage.getItem(STORAGE_PREFIX + 'user') ||
      sessionStorage.getItem(STORAGE_PREFIX + 'user');
    if (!cipher) return null;

    const obj = decryptData(cipher);
    if (!obj || (obj.expire && Date.now() > obj.expire)) {
      localStorage.removeItem(STORAGE_PREFIX + 'user');
      sessionStorage.removeItem(STORAGE_PREFIX + 'user');
      return null;
    }
    return obj.data as AuthUser;
  } catch {
    return null;
  }
};
