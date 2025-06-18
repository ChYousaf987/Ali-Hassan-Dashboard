// catogeryservices.js

import { db } from '@/config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const categoryRef = collection(db, 'categories');

export const fetchCategories = async () => {
    try {
        const snapshot = await getDocs(categoryRef);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data().value || doc.data().label || doc.id,
            label: doc.data().label || doc.data().value || doc.id,
        }));
    } catch (error: any) {
        console.error('Error fetching categories:', error.message);
        return [];
    }
};

export const addCategory = async (name: string) => {
    try {
        const newOption = {
            label: name,
            value: name.toLowerCase().replace(/\s+/g, '-'),
        };
        const newDoc = await addDoc(categoryRef, newOption);
        return { id: newDoc.id, ...newOption };
    } catch (error: any) {
        console.error('Error adding category:', error.message);
        throw error;
    }
};

export const deleteCategory = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'categories', id));
    } catch (error: any) {
        console.error('Error deleting category:', error.message);
        throw error;
    }
};