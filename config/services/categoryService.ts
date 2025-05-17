import { db } from "@/config/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const categoryRef = collection(db, "categories");

export const fetchCategories = async () => {
  const snapshot = await getDocs(categoryRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    value: doc.data().name,
    label: doc.data().name,
  }));
};

export const addCategory = async (name: string) => {
  const newDoc = await addDoc(categoryRef, { name });
  return { id: newDoc.id, value: name, label: name };
};

export const deleteCategory = async (id: string) => {
  await deleteDoc(doc(db, "categories", id));
};
