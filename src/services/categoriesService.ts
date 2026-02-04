import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Category } from '../types';

const COLLECTION = 'categories';

export async function getCategories(): Promise<Category[]> {
  const categoriesCollection = collection(db, COLLECTION);
  const categoriesQuery = query(categoriesCollection, orderBy('order'));
  const snapshot = await getDocs(categoriesQuery);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const categoriesCollection = collection(db, COLLECTION);
  const docRef = await addDoc(categoriesCollection, category);
  return { ...category, id: docRef.id };
}

export async function patchCategory(id: string, updates: Partial<Category>): Promise<void> {
  const categoryRef = doc(db, COLLECTION, id);
  await updateDoc(categoryRef, updates);
}

export async function removeCategory(id: string): Promise<void> {
  const categoryRef = doc(db, COLLECTION, id);
  await deleteDoc(categoryRef);
}

