import { Suspense } from 'react';
import Link from 'next/link';
import { updateJobOffer, getJobOfferById } from '@/app/action';
import { redirect } from 'next/navigation';

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">
          Chargement…
        </div>
      }
    >
      <EditJobContent params={params} />
    </Suspense>
  );
}

async function EditJobContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const job = await getJobOfferById(resolvedParams.id);

  if (!job) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-12">
      <div className="bg-[#002b6b] text-white px-6 py-4 shadow-md flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://i.imgur.com/z8yAfpK.png" alt="City Seal" className="w-8 h-8 object-contain" />
        <h1 className="font-bold">CITY OF LOS SANTOS - Personnel Department</h1>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline text-sm font-bold">
            ← Retour au tableau de bord
          </Link>
        </div>

        <div className="bg-white rounded shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-[#002b6b] border-b pb-4 mb-6">
            Modifier l'offre d'emploi
          </h2>

          <form action={updateJobOffer} className="space-y-6 text-sm">
            <input type="hidden" name="id" value={job.id} />

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 uppercase">Titre du poste</label>
                <input name="title" defaultValue={job.title} required className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 uppercase">Numéro de l'offre (RP)</label>
                <input name="jobNumber" defaultValue={job.jobNumber} required className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b]" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 uppercase">Département</label>
                <input name="department" defaultValue={job.department} required className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 uppercase">Catégorie</label>
                <input name="category" defaultValue={job.category} required className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 uppercase">Type</label>
                <select name="type" defaultValue={job.type} className="border border-gray-300 p-2 rounded outline-none bg-white">
                  <option value="TEMPS PLEIN">Temps Plein</option>
                  <option value="TEMPS PARTIEL">Temps Partiel</option>
                  <option value="CONTRACTUEL">Contractuel</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 uppercase">Salaire (Format court)</label>
                <input name="salaryStr" defaultValue={job.salaryStr} required className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 uppercase">Grille Salariale</label>
                <input name="salaryRange" defaultValue={job.salaryRange} required className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b]" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-700 uppercase">Description du poste & Notes</label>
              <textarea name="description" defaultValue={job.description} required rows={4} className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b] resize-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-700 uppercase">Prérequis & Qualifications</label>
              <textarea name="requirements" defaultValue={job.requirements} required rows={3} className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b] resize-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-700 uppercase">Notes sur le processus</label>
              <textarea name="processNotes" defaultValue={job.processNotes} required rows={3} className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b] resize-none" />
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end gap-4">
              <Link href="/admin/dashboard" className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-bold">
                ANNULER
              </Link>
              <button type="submit" className="bg-[#002b6b] hover:bg-blue-800 text-white font-bold py-2 px-8 rounded shadow transition-colors">
                SAUVEGARDER
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}