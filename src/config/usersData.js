import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const checkIfAdmin = async (uid) => {
  try {
    const adminRef = doc(db, 'data', 'users');
    const adminDoc = await getDoc(adminRef);
    const adminUids = adminDoc.data().admin;

    if (adminUids.includes(uid)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {

    console.error("Erro ao verificar se o usuário é admin:", error);
    return false;
  }
};