import { supabase } from "./supabaseClient";
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_AES_SECRET;
const STORAGE_PREFIX = "tickup_";
const TTL_MS = 24 * 60 * 60 * 1000;

const encryptData = (data) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();

const decryptData = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
};

const setUserStorage = (user, session = null, remember = false) => {
  const obj = { data: user, expire: Date.now() + TTL_MS };
  const cipher = encryptData(obj);

  if (remember) {
    localStorage.setItem(STORAGE_PREFIX + "user", cipher);
    sessionStorage.removeItem(STORAGE_PREFIX + "user");
  } else {
    sessionStorage.setItem(STORAGE_PREFIX + "user", cipher);
    localStorage.removeItem(STORAGE_PREFIX + "user");
  }

  if (session) {
    const sessionCipher = encryptData(session);
    if (remember) {
      localStorage.setItem(STORAGE_PREFIX + "supabase_session", sessionCipher);
    } else {
      sessionStorage.setItem(
        STORAGE_PREFIX + "supabase_session",
        sessionCipher
      );
    }
  }
};

const getUserStorage = () => {
  try {
    const cipher =
      localStorage.getItem(STORAGE_PREFIX + "user") ||
      sessionStorage.getItem(STORAGE_PREFIX + "user");
    if (!cipher) return null;

    const obj = decryptData(cipher);
    if (!obj || (obj.expire && Date.now() > obj.expire)) {
      localStorage.removeItem(STORAGE_PREFIX + "user");
      sessionStorage.removeItem(STORAGE_PREFIX + "user");
      return null;
    }
    return obj.data;
  } catch {
    return null;
  }
};

const getStoredSession = () => {
  try {
    const cipher =
      localStorage.getItem(STORAGE_PREFIX + "supabase_session") ||
      sessionStorage.getItem(STORAGE_PREFIX + "supabase_session");
    if (!cipher) return null;
    return decryptData(cipher);
  } catch {
    return null;
  }
};

export const restoreSupabaseSession = async () => {
  const session = getStoredSession();
  if (session) {
    await supabase.auth.setSession(session);
  }
};

// --- Register ---
export const register = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  return { id: data.user.id, email: data.user.email };
};

// --- Login ---
export const login = async (email, password, remember = false) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  const userInfo = { id: data.user.id, email: data.user.email };
  setUserStorage(userInfo, data.session, remember);
  return userInfo;
};

// --- Logout ---
export const logoutApi = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem(STORAGE_PREFIX + "user");
  sessionStorage.removeItem(STORAGE_PREFIX + "user");
  localStorage.removeItem(STORAGE_PREFIX + "supabase_session");
  sessionStorage.removeItem(STORAGE_PREFIX + "supabase_session");
};

// --- Restore session ---
export const getStoredUser = () => getUserStorage();
