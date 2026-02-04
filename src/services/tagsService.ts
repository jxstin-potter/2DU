import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Tag } from '../types';

const COLLECTION = 'tags';

export async function getTags(): Promise<Tag[]> {
  const tagsCollection = collection(db, COLLECTION);
  const snapshot = await getDocs(tagsCollection);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Tag));
}

export async function createTag(tag: Omit<Tag, 'id'>): Promise<Tag> {
  const tagsCollection = collection(db, COLLECTION);
  const docRef = await addDoc(tagsCollection, tag);
  return { ...tag, id: docRef.id };
}

export async function patchTag(id: string, updates: Partial<Tag>): Promise<void> {
  const tagRef = doc(db, COLLECTION, id);
  await updateDoc(tagRef, updates);
}

export async function removeTag(id: string): Promise<void> {
  const tagRef = doc(db, COLLECTION, id);
  await deleteDoc(tagRef);
}

