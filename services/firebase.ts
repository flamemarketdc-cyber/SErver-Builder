import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import type { ServerTemplate } from '../types.ts';
import { galleryTemplates as seedData } from '../gallery-templates.ts';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY", // This key is for Firebase services, not Gemini.
  authDomain: "flamingserverbuilder.firebaseapp.com",
  projectId: "flamingserverbuilder",
  storageBucket: "flamingserverbuilder.appspot.com",
  messagingSenderId: "426902856169",
  appId: "1:426902856169:web:57ba9a75945f4be29b6b78",
  measurementId: "G-H1H9F88HFW"
};

const GALLERY_COLLECTION = 'galleryTemplates';
let db;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (error) {
    console.error("Firebase initialization error:", error);
}


export const fetchGalleryTemplates = async (): Promise<ServerTemplate[]> => {
  if (!db) {
      console.warn("Firestore is not initialized. Falling back to static data.");
      return seedData;
  }
  try {
    const q = query(collection(db, GALLERY_COLLECTION), orderBy("serverName"));
    const querySnapshot = await getDocs(q);
    const templates: ServerTemplate[] = [];
    querySnapshot.forEach((doc) => {
      templates.push({ id: doc.id, ...doc.data() } as ServerTemplate);
    });
    return templates;
  } catch (error) {
    console.error("Error fetching gallery templates: ", error);
    // Graceful fallback to static data if Firestore fails
    return seedData;
  }
};

export const publishTemplateToGallery = async (template: ServerTemplate): Promise<string> => {
   if (!db) {
      throw new Error("Firestore is not initialized. Cannot publish template.");
  }
  try {
    // Sanitize template before publishing
    const { isStreaming, id, ...publishableTemplate } = template;
    
    const docRef = await addDoc(collection(db, GALLERY_COLLECTION), {
      ...publishableTemplate,
      publishedAt: serverTimestamp()
    });
    console.log("Template published with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error publishing template: ", error);
    throw new Error("Failed to publish template to the gallery.");
  }
};

/**
 * A helper function to seed the database with initial templates.
 * This can be run once from the browser console during development.
 * How to use:
 * 1. Fill in your Firebase config above.
 * 2. Open your browser's developer console.
 * 3. Type `window.seedDatabase()` and press Enter.
 * 4. Verify the data in your Firebase Firestore console.
 */
export const seedDatabase = async () => {
    if (!db) {
        console.error("Firestore is not initialized. Cannot seed database.");
        return;
    }
    console.log('Seeding database...');
    const galleryCollection = collection(db, GALLERY_COLLECTION);
    const existingDocs = await getDocs(galleryCollection);

    if (existingDocs.size > 0) {
        console.log('Database already contains data. Seeding skipped.');
        return;
    }

    for (const template of seedData) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...seedTemplate } = template;
        await addDoc(galleryCollection, {
            ...seedTemplate,
            publishedAt: serverTimestamp()
        });
    }
    console.log('Database seeded successfully!');
};

// Expose seedDatabase to window for easy access during development
if (typeof window !== 'undefined') {
    (window as any).seedDatabase = seedDatabase;
}