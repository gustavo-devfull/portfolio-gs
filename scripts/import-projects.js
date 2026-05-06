import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env.local file
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');
const envVars = {};

for (const line of envLines) {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
}

// Firebase Config
const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to convert string to slug
function stringToSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Main import function
async function importProjects() {
  try {
    console.log('📂 Lendo arquivo JSON...');
    const jsonPath = path.join(__dirname, '../projetos_portfolio.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    console.log('🗑️  Deletando projetos existentes...');
    const projectsRef = collection(db, 'projects');
    const existingProjects = await getDocs(projectsRef);

    for (const docSnapshot of existingProjects.docs) {
      await deleteDoc(doc(db, 'projects', docSnapshot.id));
      console.log(`  ✓ Deletado: ${docSnapshot.id}`);
    }

    console.log('\n📥 Importando novos projetos...');

    // Combine featured and other projects
    const allProjects = [
      ...jsonData.featuredProjects,
      ...jsonData.otherProjects,
    ];

    for (const proj of allProjects) {
      const slug = stringToSlug(proj.title);

      // Map category from tag or default
      let category = 'web';
      if (proj.tag.toLowerCase().includes('system')) category = 'system';
      else if (proj.tag.toLowerCase().includes('dashboard')) category = 'dashboard';
      else if (proj.tag.toLowerCase().includes('mobile')) category = 'mobile';

      const now = Timestamp.now();
      const projectData = {
        title: {
          pt: proj.title,
          en: proj.title, // Using same title for both languages as JSON doesn't have translations
        },
        slug,
        description: {
          pt: proj.shortDescription || proj.fullDescription,
          en: proj.shortDescription || proj.fullDescription,
        },
        content: {
          challenge: {
            pt: proj.fullDescription || proj.shortDescription,
            en: proj.fullDescription || proj.shortDescription,
          },
          solution: {
            pt: `Desenvolvido com: ${proj.technologies.join(', ')}`,
            en: `Developed with: ${proj.technologies.join(', ')}`,
          },
          result: {
            pt: `Projeto ${proj.deployed ? 'implantado com sucesso' : 'em desenvolvimento'}`,
            en: `Project ${proj.deployed ? 'successfully deployed' : 'in development'}`,
          },
        },
        images: [],
        coverImage: proj.image ? `https://brincar.ia.br/portfolio/images/${proj.image}` : '',
        techs: proj.technologies || [],
        category,
        liveUrl: proj.link || '',
        repoUrl: '',
        featured: proj.status === 'Destaque',
        createdAt: now,
        updatedAt: now,
      };

      try {
        const docRef = await addDoc(projectsRef, projectData);
        console.log(`  ✓ Importado: ${proj.title} (${docRef.id})`);
      } catch (error) {
        console.error(`  ✗ Erro ao importar ${proj.title}:`, error.message);
      }
    }

    console.log('\n✅ Importação concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante a importação:', error);
    process.exit(1);
  }
}

importProjects();
