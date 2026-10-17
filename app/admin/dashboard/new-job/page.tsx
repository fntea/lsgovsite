import Link from 'next/link';
import { createJobOffer } from '@/app/action'; // Vérifiez toujours que c'est le bon nom (action ou actions)

export default function NewJobPage() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-12">
      {/* Barre de navigation simplifiée */}
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
            Publier une nouvelle offre d'emploi
          </h2>

          {/* Le formulaire pointe directement vers notre Server Action */}
          <form action={createJobOffer} className="space-y-6 text-sm">
            
           {/* Le champ Numéro de l'offre a été retiré, il est généré automatiquement */}
<div className="flex flex-col gap-1">
  <label className="font-bold text-gray-700 uppercase">Titre du poste</label>
  <input name="title" required placeholder="ex: OFFICIER DE POLICE (LSPD)" className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b]" />
</div>

            <div className="grid grid-cols-3 gap-6">
              {/* Le champ Département est maintenant un texte libre */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 uppercase">Département</label>
                <input name="department" required placeholder="ex: LOS SANTOS POLICE DEPARTMENT" className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 uppercase">Catégorie</label>
                <input name="category" required placeholder="ex: Sécurité Publique" className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 uppercase">Type</label>
                <select name="type" className="border border-gray-300 p-2 rounded outline-none bg-white">
                  <option value="TEMPS PLEIN">Temps Plein</option>
                  <option value="TEMPS PARTIEL">Temps Partiel</option>
                  <option value="CONTRACTUEL">Contractuel</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 uppercase">Salaire (Format texte court)</label>
                <input name="salaryStr" required placeholder="ex: $74,792.00 - $109,327.00 Annuellement" className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 uppercase">Grille Salariale (Description)</label>
                <input name="salaryRange" required placeholder="ex: $74,792 à $109,327" className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b]" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-700 uppercase">Description du poste & Notes</label>
              <textarea name="description" required rows={4} className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b] resize-none" placeholder="Détaillez les tâches et les notes salariales..." />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-700 uppercase">Prérequis & Qualifications minimales</label>
              <textarea name="requirements" required rows={3} className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b] resize-none" placeholder="ex: Diplôme de l'académie de police ou équivalent..." />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-700 uppercase">Notes sur le processus de recrutement</label>
              <textarea name="processNotes" required rows={3} className="border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b] resize-none" placeholder="ex: Une vérification des antécédents sera effectuée..." />
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end gap-4">
              <Link href="/admin/dashboard" className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-bold">
                ANNULER
              </Link>
              <button type="submit" className="bg-[#002b6b] hover:bg-blue-800 text-white font-bold py-2 px-8 rounded shadow transition-colors">
                PUBLIER L'OFFRE
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}