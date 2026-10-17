import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

export const instant = false;

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  // On lit la vraie base de données !
  const jobs = await prisma.jobOffer.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="bg-[#0d2644] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.imgur.com/z8yAfpK.png" alt="City Seal" className="w-11 h-11 object-contain drop-shadow-sm" />
          <div>
            <h1 className="font-bold text-lg">CITY OF LOS SANTOS</h1>
            <p className="text-xs">PERSONNEL DEPARTMENT</p>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="hover:underline">Retour au site public</Link>
          <span>Admin User</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-end mb-8 border-b pb-4 border-gray-300">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">GESTION DES OFFRES</h2>
            <p className="text-gray-500 mt-1">Création et modification des offres.</p>
          </div>
          <Link href="/admin/dashboard/new-job" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow transition-colors">
            + PUBLIER UNE OFFRE
          </Link>
        </div>

        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase">
                <th className="p-4 font-semibold">Titre du Poste</th>
                <th className="p-4 font-semibold">Département</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-[#006E9A]">{job.title}</td>
                  <td className="p-4 text-gray-700">{job.department}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${job.status === 'Continu' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-4 flex justify-end items-center">
  {/* Bouton pour voir les candidatures */}
  <Link 
    href={`/admin/dashboard/applications/${job.id}`} 
    className="text-gray-500 hover:text-[#006E9A] text-lg"
    title="Voir les candidatures"
  >
    👁
  </Link>
  {/* Bouton Modifier existant */}
  <Link href={`/admin/dashboard/edit-job/${job.id}`} className="text-gray-500 hover:text-black font-semibold">
    Modifier
  </Link>
</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {jobs.length === 0 && (
            <div className="p-8 text-center text-gray-500 italic">
              Aucune offre d'emploi n'est actuellement publiée.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}