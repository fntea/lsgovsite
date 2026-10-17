import Link from 'next/link';
import { getApplicationById, updateApplicationStatus } from '@/app/action';
import { redirect } from 'next/navigation';

export const instant = false;

export default async function ReviewApplicationPage({ params }: { params: Promise<{ appId: string }> }) {
  const resolvedParams = await params;
  const application = await getApplicationById(resolvedParams.appId);

  if (!application) redirect('/admin/dashboard');

  // Décodage du JSON (si vide, on crée un objet vide pour éviter les crashs)
  const formData = application.rawData ? JSON.parse(application.rawData) : {};

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-12">
      <div className="bg-[#002b6b] text-white px-6 py-4 shadow-md flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://i.imgur.com/z8yAfpK.png" alt="City Seal" className="w-8 h-8 object-contain" />
        <h1 className="font-bold">CITY OF LOS SANTOS - Personnel Department</h1>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6 flex justify-between items-end">
          <Link href={`/admin/dashboard/applications/${application.jobId}`} className="text-blue-600 hover:underline text-sm font-bold">
            ← Retour à la liste des candidatures
          </Link>
        </div>

        {/* PANNEAU DE DÉCISION (HAUT) */}
        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gray-50 border-b border-gray-200 p-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#002b6b] uppercase">{application.characterName}</h2>
              <p className="text-gray-600 mt-1">Candidature pour : <span className="font-semibold">{application.job.title}</span></p>
            </div>
            <div className="text-right text-sm text-gray-500">
              Soumise le {application.createdAt.toLocaleDateString('fr-FR')}
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 gap-8 bg-gray-50 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-lg border-b pb-2 mb-4 uppercase text-gray-700">Informations OOC</h3>
              <div className="space-y-3 text-sm p-4 rounded border border-gray-300 bg-white">
                <div><span className="text-gray-500 block text-xs uppercase">Nom UCP</span> <span className="font-bold text-blue-900">{application.ucpName}</span></div>
                <div><span className="text-gray-500 block text-xs uppercase">Pseudo Discord</span> <span className="font-bold">{application.discordName}</span></div>
                <div><span className="text-gray-500 block text-xs uppercase">ID Discord</span> <span className="font-mono text-xs bg-gray-100 p-1 rounded">{application.discordId}</span></div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg border-b pb-2 mb-4 uppercase text-gray-700">Traitement</h3>
              <form action={updateApplicationStatus} className="flex flex-col gap-4">
                <input type="hidden" name="id" value={application.id} />
                <input type="hidden" name="jobId" value={application.jobId} />
                
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Statut actuel :</label>
                  <select name="status" defaultValue={application.status} className="w-full border border-gray-300 p-2 rounded outline-none focus:border-[#002b6b] bg-white font-bold">
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="REÇUE">Reçue (En cours d'étude)</option>
                    <option value="VALIDÉE">Validée (Acceptée)</option>
                    <option value="REFUSÉE">Refusée</option>
                  </select>
                </div>
                
                <button type="submit" className="bg-[#002b6b] hover:bg-blue-800 text-white font-bold py-3 px-8 rounded shadow transition-colors uppercase">
                  Mettre à jour le statut
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FORMULAIRE OFFICIEL COMPLET (BAS) */}
        <div className="bg-white border-2 border-black shadow-lg mt-8">
          <div className="flex border-b-[3px] border-black p-4">
            <div className="w-1/4 flex justify-center items-center border-r border-black pr-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.imgur.com/z8yAfpK.png" alt="City Seal" className="w-28 h-auto grayscale opacity-90" />
            </div>
            <div className="w-3/4 flex flex-col justify-center text-center pl-4 font-sans text-black">
              <div className="flex justify-between text-[10px] mb-2 font-semibold">
                <span>Copie Administrative</span>
                <span>Formulaire PDR-1</span>
              </div>
              <div className="text-3xl font-black font-serif tracking-tight my-1">VILLE ET DU COMTÉ DE LOS SANTOS</div>
              <div className="text-lg font-bold">DÉPARTEMENT DU PERSONNEL</div>
            </div>
          </div>

          <div className="text-[12px] font-sans">
            {/* Ligne 1 */}
            <div className="flex border-b border-black bg-gray-50">
              <div className="w-full p-2">
                <label className="font-bold block mb-1">1. TITRE / IDENTITÉ / IDENTIFIANT</label>
                <div className="font-mono font-bold text-sm text-[#002b6b] uppercase">{application.job.title} | {application.job.jobNumber}</div>
              </div>
            </div>

            {/* Ligne 2 : Identité */}
            <div className="flex border-b border-black">
              <div className="w-1/2 p-2 border-r border-black">
                <label className="font-bold block mb-1">2. NOM DE FAMILLE</label>
                <div className="font-bold text-sm uppercase">{formData.lastName || '—'}</div>
              </div>
              <div className="w-1/2 p-2">
                <label className="font-bold block mb-1">PRÉNOM(S)</label>
                <div className="font-bold text-sm uppercase">{formData.firstName || '—'}</div>
              </div>
            </div>

            {/* Ligne 3 : Adresse */}
            <div className="flex border-b border-black">
              <div className="w-1/4 p-2 border-r border-black">
                <label className="font-bold block mb-1">3. N° D'APPARTEMENT</label>
                <div className="font-bold text-sm uppercase">{formData.addressNumber || '—'}</div>
              </div>
              <div className="w-2/4 p-2 border-r border-black">
                <label className="font-bold block mb-1">RUE</label>
                <div className="font-bold text-sm uppercase">{formData.addressStreet || '—'}</div>
              </div>
              <div className="w-1/4 p-2">
                <label className="font-bold block mb-1">VILLE</label>
                <div className="font-bold text-sm uppercase">{formData.addressCity || '—'}</div>
              </div>
            </div>

            {/* Ligne 4 : Contact, Naissance, Permis, Citoyenneté */}
            <div className="flex border-b border-black bg-gray-50">
              <div className="w-1/4 p-2 border-r border-black">
                <label className="font-bold block mb-1">3a. TÉLÉPHONE</label>
                <div className="font-bold text-sm uppercase">{formData.phone || '—'}</div>
              </div>
              <div className="w-1/4 p-2 border-r border-black">
                <label className="font-bold block mb-1">4. DATE DE NAISSANCE</label>
                <div className="font-bold text-sm uppercase">
                  {formData.birthdate ? new Date(formData.birthdate).toLocaleDateString('fr-FR') : '—'}
                </div>
              </div>
              <div className="w-1/4 p-2 border-r border-black">
                <label className="font-bold block mb-1 text-center">5. PERMIS DE CONDUIRE</label>
                <div className="font-bold text-sm text-center uppercase text-[#002b6b]">{formData.license || '—'}</div>
              </div>
              <div className="w-1/4 p-2">
                <label className="font-bold block mb-1 text-center">6. CITOYENNETÉ</label>
                <div className="font-bold text-sm text-center uppercase text-[#002b6b]">{formData.citizen || '—'}</div>
              </div>
            </div>

            {/* Ligne 5 : Identifications Spéciales */}
            <div className="flex border-b border-black">
              <div className="w-1/3 p-2 border-r border-black">
                <label className="font-bold block mb-1">7. GENRE IDENTIFIÉ</label>
                <div className="font-bold text-sm uppercase">{formData.gender || '—'}</div>
              </div>
              <div className="w-2/3 p-2">
                <label className="font-bold block mb-1">8. GROUPE(S) ETHNIQUE(S)</label>
                <div className="font-bold text-sm uppercase text-[#002b6b]">
                  {/* On filtre intelligemment les cases cochées */}
                  {[
                    formData.eth_afro && "Afro-Américain",
                    formData.eth_hisp && "Hispanique",
                    formData.eth_asia && "Asiatique",
                    formData.eth_cauc && "Caucasien",
                    formData.eth_native && "Amérindien",
                    formData.eth_hawaii && "Hawaïen/Pacifique",
                    formData.eth_mixed && "Mixte"
                  ].filter(Boolean).join(" / ") || '—'}
                </div>
              </div>
            </div>

            {/* Ligne 6 : Éducation Base */}
            <div className="flex border-b border-black bg-gray-50">
              <div className="w-1/2 p-2 border-r border-black">
                <label className="font-bold block mb-1">9a. DIPLÔME SECONDAIRE / GED ?</label>
                <div className="font-bold text-sm uppercase">{formData.hs || '—'}</div>
              </div>
              <div className="w-1/2 p-2">
                <label className="font-bold block mb-1">9b. MINEUR : PERMIS DE TRAVAIL ?</label>
                <div className="font-bold text-sm uppercase">{formData.under18 || '—'}</div>
              </div>
            </div>

            {/* Ligne 7 : Autres Éducations */}
            <div className="p-3 border-b border-black">
              <label className="font-bold block mb-2">10. AUTRES DIPLÔMES ET QUALIFICATIONS</label>
              <div className="font-bold text-sm whitespace-pre-wrap">{formData.additionalEducation || '—'}</div>
            </div>

            {/* Ligne 8 : Langues */}
            <div className="p-3 border-b border-black bg-gray-50">
              <label className="font-bold block mb-1">11. COMPÉTENCES LINGUISTIQUES</label>
              <div className="font-bold text-sm uppercase">{formData.languages || '—'}</div>
            </div>
            
            {/* Ligne 9 : Signature Finale */}
            <div className="p-4 bg-gray-100 flex justify-between items-end">
              <div className="w-2/3 border-b border-gray-400 pb-1">
                <label className="font-bold block text-[10px] text-gray-500 uppercase mb-1">13. Signature électronique</label>
                <div className="italic text-2xl text-blue-900 font-serif">{formData.signature || '—'}</div>
              </div>
              <div className="w-1/3 text-right">
                <label className="font-bold block text-[10px] text-gray-500 uppercase">Horodatage</label>
                <div className="text-sm font-bold mt-1">{application.createdAt.toLocaleDateString('fr-FR')}</div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}