import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
declare let db: Firestore;
declare let auth: Auth;
export declare const enablePersistence: () => Promise<void>;
export declare const testAuth: (email: string, password: string) => Promise<import("firebase/auth").User>;
export { db, auth };
