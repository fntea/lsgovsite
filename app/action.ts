"use server";

import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function createJobOffer(formData: FormData) {
  // Génération d'un Job Number aléatoire façon "Gouvernement" (ex: 4821 O 2026/10/17 B)
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 chiffres au hasard
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetter1 = letters.charAt(Math.floor(Math.random() * letters.length));
  const randomLetter2 = letters.charAt(Math.floor(Math.random() * letters.length));
  
  // Date du jour formatée YYYY/MM/DD
  const today = new Date();
  const dateString = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
  
  // Assemblage de l'ID
  const autoJobNumber = `${randomDigits} ${randomLetter1} ${dateString} ${randomLetter2}`;

  await prisma.jobOffer.create({
    data: {
      title: formData.get('title') as string,
      type: formData.get('type') as string,
      salaryStr: formData.get('salaryStr') as string,
      category: formData.get('category') as string,
      department: formData.get('department') as string,
      salaryRange: formData.get('salaryRange') as string,
      description: formData.get('description') as string,
      requirements: formData.get('requirements') as string,
      processNotes: formData.get('processNotes') as string,
      
      // On insère l'ID généré automatiquement au lieu de le demander au formulaire
      jobNumber: autoJobNumber, 
    },
  });

  redirect('/admin/dashboard');
}
// app/action.ts (à ajouter à la fin)

export async function getJobOffers() {
  const jobs = await prisma.jobOffer.findMany({
    orderBy: { createdAt: 'desc' } // Les plus récentes en premier
  });
  
  // On convertit les dates en texte pour éviter les erreurs d'affichage
  return jobs.map(job => ({
    ...job,
    createdAt: job.createdAt.toLocaleDateString('fr-FR')
  }));
}

// À AJOUTER À LA FIN DE app/action.ts

// Récupérer une seule offre via son ID
export async function getJobOfferById(id: string) {
  return await prisma.jobOffer.findUnique({
    where: { id }
  });
}

// Mettre à jour une offre existante
export async function updateJobOffer(formData: FormData) {
  const id = formData.get('id') as string;
  
  await prisma.jobOffer.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
      type: formData.get('type') as string,
      salaryStr: formData.get('salaryStr') as string,
      category: formData.get('category') as string,
      department: formData.get('department') as string,
      salaryRange: formData.get('salaryRange') as string,
      description: formData.get('description') as string,
      requirements: formData.get('requirements') as string,
      processNotes: formData.get('processNotes') as string,
      jobNumber: formData.get('jobNumber') as string,
    },
  });

  redirect('/admin/dashboard');
}

// À AJOUTER À LA FIN DE app/action.ts

export async function submitApplication(formData: FormData) {
  const lastName = formData.get('lastName') as string;
  const firstName = formData.get('firstName') as string;
  const phone = formData.get('phone') as string;
  
  // --- NOUVEAU : On transforme TOUTES les données du formulaire en texte JSON ---
  const rawDataObj = Object.fromEntries(formData.entries());
  const rawDataString = JSON.stringify(rawDataObj);
  // -----------------------------------------------------------------------------

  await prisma.application.create({
    data: {
      jobId: formData.get('jobId') as string,
      
      // Informations IC
      characterName: `${firstName} ${lastName}`,
      ageRP: 21,
      motivations: "Téléphone de contact: " + phone,
      
      // Informations OOC
      discordName: formData.get('discordName') as string,
      discordId: formData.get('discordId') as string,
      ucpName: formData.get('ucpName') as string,
      
      status: "EN_ATTENTE",
      
      // --- NOUVEAU : On insère le JSON complet dans la base de données ---
      rawData: rawDataString
    }
  });
}

// --- À AJOUTER À LA FIN DE app/action.ts ---

// Récupérer toutes les candidatures pour une offre spécifique
export async function getApplicationsByJobId(jobId: string) {
  return await prisma.application.findMany({
    where: { jobId },
    orderBy: { createdAt: 'desc' },
  });
}

// Récupérer une seule candidature avec les infos de l'offre liée
export async function getApplicationById(appId: string) {
  return await prisma.application.findUnique({
    where: { id: appId },
    include: { job: true },
  });
}

// Mettre à jour le statut d'une candidature
export async function updateApplicationStatus(formData: FormData) {
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  const jobId = formData.get('jobId') as string;

  await prisma.application.update({
    where: { id },
    data: { status },
  });

  // Retourne à la liste des candidatures de cette offre
  redirect(`/admin/dashboard/applications/${jobId}`);
}

import bcrypt from 'bcryptjs';

export async function loginAdmin(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // Création du compte admin s'il n'existe pas (identifiants dans les variables d'environnement)
  const adminCount = await prisma.adminUser.count();
  if (adminCount === 0) {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminUsername && adminPassword) {
      await prisma.adminUser.create({
        data: {
          username: adminUsername,
          password: await bcrypt.hash(adminPassword, 10),
        },
      });
    }
  }

  const user = await prisma.adminUser.findUnique({ where: { username } });

  // Comparaison avec le hash (et non plus en texte brut)
  const ok = user ? await bcrypt.compare(password, user.password) : false;

  if (ok) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      path: '/',
    });
    return { success: true };
  } else {
    return { error: 'Identifiants incorrects.' };
  }
}