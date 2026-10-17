import Link from 'next/link';
import { getJobOfferById, getApplicationsByJobId } from '@/app/action'; // Vérifiez que c'est bien action.ts ou actions.ts
import { redirect } from 'next/navigation';

export const instant = false;

// On déclare le type proprement pour rassurer TypeScript
interface PageProps {
  params: Promise<{ jobId: string }>;
}

export default async function ApplicationListPage({ params }: PageProps) {
  // On déballe les paramètres
  const resolvedParams = await params;
  const currentJobId = resolvedParams.jobId;

  // On lance les requêtes avec l'ID récupéré
  const job = await getJobOfferById(currentJobId);
  const applications = await getApplicationsByJobId(currentJobId);

  if (!job) {
    redirect('/admin/dashboard');
  }

  return (
    // ... la suite de votre code (le <div className="min-h-screen... ) reste identique
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="bg-[#002b6b] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.imgur.com/z8yAfpK.png" alt="City Seal" className="w-11 h-11 object-contain drop-shadow-sm" />
          <h1 className="font-bold text-lg">CITY OF LOS SANTOS - Personnel Department</h1>
        </div>
        <Link href="/admin/dashboard" className="hover:underline text-blue-200 text-sm">Retour au tableau de bord</Link>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 border-b pb-4 border-gray-300">
          <h2 className="text-3xl font-bold text-gray-800">Candidatures : {job.title}</h2>
          <p className="text-gray-500 mt-1">ID de l'offre : {job.jobNumber}</p>
        </div>

        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase">
                <th className="p-4 font-semibold">Candidat (IC)</th>
                <th className="p-4 font-semibold">Nom UCP</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-[#006E9A]">{app.characterName}</td>
                  <td className="p-4 text-gray-700">{app.ucpName}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold 
                      ${app.status === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${app.status === 'REÇUE' ? 'bg-blue-100 text-blue-700' : ''}
                      ${app.status === 'VALIDÉE' ? 'bg-green-100 text-green-700' : ''}
                      ${app.status === 'REFUSÉE' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{app.createdAt.toLocaleDateString('fr-FR')}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/dashboard/applications/review/${app.id}`} className="text-[#006E9A] hover:underline font-bold">
                      Traiter
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {applications.length === 0 && (
            <div className="p-8 text-center text-gray-500 italic">Aucune candidature pour ce poste pour le moment.</div>
          )}
        </div>
      </main>
    </div>
  );
}