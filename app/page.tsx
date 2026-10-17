"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJobOffers, submitApplication } from '@/app/action';

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  
  // État pour afficher ou masquer la modale de candidature
  const [isApplying, setIsApplying] = useState(false);
  // Nouvel état pour la fenêtre OOC
  const [showOocForm, setShowOocForm] = useState(false);

  useEffect(() => {
    getJobOffers().then(data => setJobs(data));
  }, []);

  const handleSelectJob = (job: any) => {
    setSelectedJob(job);
    setIsApplying(false);
    setShowOocForm(false); // On réinitialise quand on change de job
  };

  return (
    <div 
      className="min-h-screen bg-[#eaeff2] text-gray-800 font-sans pb-[50px]"
      onClick={() => setSelectedJob(null)}
    >
      
      {/* Bandeau officiel de la ville */}
      <div 
        className="bg-[#0d2644] text-white flex justify-between items-center px-5 py-2 text-[13px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.imgur.com/z8yAfpK.png" alt="Seal" className="w-5 h-auto object-contain align-middle" />
          <span>An Official Website of the City of Los Santos</span>
        </div>
        <div className="flex gap-1.5">
          <a href="#" className="bg-transparent text-white border border-white px-2.5 py-1 rounded-[3px] text-[12px] no-underline inline-block hover:bg-white/20 transition-colors">City Services</a>
          <a href="#" className="bg-transparent text-white border border-white px-2.5 py-1 rounded-[3px] text-[12px] no-underline inline-block hover:bg-white/20 transition-colors">City Directory</a>
        </div>
      </div>

      {/* Bannière avec fond */}
      <div 
        className="w-full h-[160px] bg-cover bg-center flex items-center px-[4%] mb-10"
        style={{ backgroundImage: "url('https://i.imgur.com/pKJs2YD.jpeg')" }}
        onClick={(e) => e.stopPropagation()}
      ></div>

      <main className="w-full px-[4%] flex gap-8">
        
        {/* COLONNE DE GAUCHE : LISTE DES EMPLOIS */}
        <div 
          className={`transition-all duration-300 ${selectedJob ? 'w-1/2 hidden md:block' : 'w-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-gray-600 mb-6">Les offres suivantes sont ouvertes à toutes et tous (au regard des prérequis et spécificités).</p>

          <div className="flex flex-col md:flex-row justify-between items-center bg-white border border-gray-300 rounded p-2 mb-8 gap-4 shadow-sm">
            <div className="flex-1 w-full flex items-center border border-gray-300 rounded px-3 py-1.5">
              <input type="text" placeholder="Search" className="w-full outline-none text-gray-700" />
              <span className="text-gray-400 font-bold">Q</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{jobs.length} offres trouvées</span>
              <div className="flex gap-2 border-l pl-4 border-gray-300">
                <button className="p-1 border bg-gray-100 hover:bg-gray-200">≡</button>
                <button className="p-1 border bg-blue-50 text-[#006E9A] border-[#006E9A]">▤</button>
                <button className="flex items-center gap-1 hover:text-gray-900">⇅ Trier ▾</button>
                <button className="flex items-center gap-1 hover:text-gray-900">⧨ Filtrer ▾</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-white border border-gray-200 rounded shadow-sm px-6">
            {jobs.map((job) => (
              <div key={job.id} className="py-6 border-b border-gray-200 last:border-b-0">
                <button onClick={() => handleSelectJob(job)} className="text-xl text-[#006E9A] hover:underline text-left font-medium mb-2 uppercase">
                  {job.title}
                </button>
                <div className="text-sm text-gray-700 space-y-0.5 mb-4">
                  <p className="uppercase">{job.city}</p>
                  <p>{job.type} - {job.salaryStr}</p>
                  <p>Category: {job.category}</p>
                  <p>Department: {job.department}</p>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{job.description}</p>
                <div className="flex justify-end items-center text-xs text-gray-500">
                  <div>{job.createdAt} | {job.status}</div>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="py-8 text-center text-gray-500">Aucune offre actuellement disponible.</div>
            )}
          </div>
        </div>

        {/* COLONNE DE DROITE : DÉTAILS DE L'EMPLOI */}
        {selectedJob && (
          <div 
            className="w-full md:w-1/2 bg-white border border-gray-200 shadow-lg flex flex-col h-[85vh] sticky top-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 text-gray-500">
              <button onClick={() => setSelectedJob(null)} className="hover:text-black font-bold">⟨</button>
              <button className="hover:text-black font-bold">⟩</button>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              <h2 className="text-2xl text-[#006E9A] font-medium mb-6 uppercase">{selectedJob.title}</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm mb-8">
                <div><span className="text-gray-500 block mb-1">Salaire</span><span>{selectedJob.salaryStr}</span></div>
                <div><span className="text-gray-500 block mb-1">Location ⓘ</span><span className="uppercase">{selectedJob.city}</span></div>
                <div><span className="text-gray-500 block mb-1">Type</span><span>{selectedJob.type}</span></div>
                <div><span className="text-gray-500 block mb-1">ID</span><span>{selectedJob.jobNumber}</span></div>
                <div><span className="text-gray-500 block mb-1">Entité</span><span className="uppercase">{selectedJob.department}</span></div>
                <div><span className="text-gray-500 block mb-1">Date de publication</span><span>{selectedJob.createdAt}</span></div>
                <div><span className="text-gray-500 block mb-1">Date de clôture</span><span>Continue</span></div>
              </div>
              <div className="flex border-b border-gray-200 mb-6 text-sm font-medium text-gray-500 uppercase">
                <button className="px-6 py-3 border-b-2 border-[#006E9A] text-[#006E9A]">Description</button>
                <button className="px-6 py-3 hover:text-gray-800">Benefits</button>
                <button className="px-6 py-3 hover:text-gray-800">Questions</button>
              </div>
              <div className="text-sm text-gray-800 space-y-6">
                <div>
                  <h3 className="font-bold mb-2 uppercase">Duties</h3>
                  <p className="font-bold underline mb-1 uppercase">Salaire</p>
                  <p className="mb-4">{selectedJob.salaryRange}</p>
                  <p className="font-bold underline mb-1 uppercase">Notes:</p>
                  <p className="mb-4 text-gray-700">{selectedJob.description}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2 underline uppercase">Prérequis/Qualifications</h3>
                  <p className="text-gray-700">{selectedJob.requirements}</p>
                </div>
                <div>
                  <h3 className="font-bold underline mb-2 uppercase">Notes</h3>
                  <div className="pl-5 space-y-2 text-gray-700 whitespace-pre-wrap">{selectedJob.processNotes}</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => setIsApplying(true)}
                className="w-full bg-[#006E9A] hover:bg-[#004d6b] text-white font-bold py-3 rounded transition-colors uppercase"
              >
                Postuler
              </button>
            </div>
          </div>
        )}

      </main>

      {/* POP-UP (MODAL) DU FORMULAIRE DE CANDIDATURE */}
      {selectedJob && (
        <div 
          className={`fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 transition-opacity ${isApplying ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          onClick={() => setIsApplying(false)}
        >
          <div 
            className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            
            <button 
              onClick={() => setIsApplying(false)}
              className="absolute top-2 right-4 text-2xl font-bold text-gray-600 hover:text-black z-10"
            >
              &times;
            </button>

            {/* EN-TÊTE EXACT PDF */}
            <div className="flex border-b-[3px] border-black p-4">
              <div className="w-1/4 flex justify-center items-center border-r border-black pr-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://i.imgur.com/z8yAfpK.png" alt="City Seal" className="w-28 h-auto grayscale opacity-90" />
              </div>
              <div className="w-3/4 flex flex-col justify-center text-center pl-4 font-sans text-black">
                <div className="flex justify-between text-[10px] mb-2 font-semibold">
                  <span>Candidature en ligne</span>
                  <span>Formulaire PDR-1 (Rev. 10/2026)</span>
                </div>
                <div className="text-sm font-bold tracking-wide">CANDIDATURE À DESTINATION DE LA</div>
                <div className="text-3xl font-black font-serif tracking-tight my-1">VILLE ET DU COMTÉ DE LOS SANTOS</div>
                <div className="text-lg font-bold">DÉPARTEMENT DU PERSONNEL</div>
                <div className="text-[11px] font-bold tracking-widest my-1 uppercase">Un employeur garantissant l'égalité des chances</div>
                <div className="text-xl font-bold tracking-widest mt-1">FORMULAIRE DE CANDIDATURE</div>
                <div className="text-[9px] mt-2 border-t border-black pt-1 font-bold">
                  CETTE PORTION DE LA CANDIDATURE N'EST PAS ACCESSIBLE À UN JURY
                </div>
              </div>
            </div>

            {/* CORPS DU FORMULAIRE RELIÉ À L'ACTION */}
            <form 
              action={async (formData) => {
                await submitApplication(formData);
                setIsApplying(false);
                setShowOocForm(false);
                alert("Votre candidature a bien été envoyée ! Un administrateur vous contactera.");
              }}
              className="text-[12px] font-sans border-b-2 border-black relative"
            >
              
              <div className="flex border-b border-black">
                <div className="w-full p-2 border-r border-black bg-gray-50">
                  <label className="font-bold block mb-1">1. TITRE / IDENTITÉ / IDENTIFIANT</label>
                  
                  {/* Champs cachés indispensables pour Prisma */}
                  <input type="hidden" name="jobId" value={selectedJob.id} />

                  <input 
                    type="text" 
                    readOnly 
                    value={`${selectedJob.title}, ${selectedJob.department}, ${selectedJob.jobNumber}`.toUpperCase()} 
                    className="w-full bg-transparent outline-none font-mono font-bold text-sm" 
                  />
                </div>
              </div>

              <div className="flex border-b border-black">
                <div className="w-1/2 p-2 border-r border-black">
                  <label className="font-bold block mb-1">2. NOM DE FAMILLE</label>
                  <input name="lastName" required type="text" className="w-full outline-none uppercase bg-gray-50 p-1" />
                </div>
                <div className="w-1/2 p-2">
                  <label className="font-bold block mb-1">PRÉNOM(S)</label>
                  <input name="firstName" required type="text" className="w-full outline-none uppercase bg-gray-50 p-1" />
                </div>
              </div>

              <div className="flex border-b border-black">
                <div className="w-1/4 p-2 border-r border-black">
                  <label className="font-bold block mb-1">3. N° D'APPARTEMENT</label>
                  <input name="addressNumber" type="text" className="w-full outline-none uppercase bg-gray-50 p-1" />
                </div>
                <div className="w-2/4 p-2 border-r border-black">
                  <label className="font-bold block mb-1">RUE</label>
                  <input name="addressStreet" type="text" className="w-full outline-none uppercase bg-gray-50 p-1" />
                </div>
                <div className="w-1/4 p-2">
                  <label className="font-bold block mb-1">VILLE</label>
                  <input name="addressCity" type="text" className="w-full outline-none uppercase bg-gray-50 p-1" />
                </div>
              </div>

              <div className="flex border-b border-black">
                <div className="w-1/4 p-2 border-r border-black">
                  <label className="font-bold block mb-1">3a. NUMÉRO DE TÉLÉPHONE</label>
                  <input name="phone" required type="text" className="w-full outline-none bg-gray-50 p-1" />
                </div>
                <div className="w-1/4 p-2 border-r border-black">
                  <label className="font-bold block mb-1">4. DATE DE NAISSANCE</label>
                  <input name="birthdate" type="date" className="w-full outline-none bg-gray-50 p-1 text-gray-500" />
                </div>
                <div className="w-1/4 p-2 border-r border-black flex flex-col justify-center items-center bg-gray-100">
                  <label className="font-bold block mb-1 text-center">5. PERMIS DE CONDUIRE</label>
                  <div className="flex gap-4">
                    <label><input type="radio" name="license" value="ACQUIS" /> ACQUIS</label>
                    <label><input type="radio" name="license" value="NON ACQUIS" /> NON ACQUIS</label>
                  </div>
                </div>
                <div className="w-1/4 p-2 flex flex-col justify-center items-center bg-gray-100">
                  <label className="font-bold block mb-1 text-center">6. CITOYENNETÉ</label>
                  <div className="flex gap-4">
                    <label><input type="radio" name="citizen" value="AMÉRICAINE" /> AMÉRICAINE</label>
                    <label><input type="radio" name="citizen" value="AUTRE" /> AUTRE</label>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-200 border-b border-black text-justify leading-tight border-t-[3px] border-t-black mt-2">
                <span className="font-bold">RECHERCHE ET DONNÉES.</span> La Ville de Los Santos est un employeur équitable. Nous demandons les indications de votre genre et de votre groupe ethnique sur la base du volontariat du candidat. Cette mesure permet l'amélioration permanente de notre programme d'emploi équitable. Compléter les sections 7 et 8 n'aura aucun impact sur votre emploi.
              </div>

              <div className="flex border-b border-black">
                <div className="w-1/3 p-3 border-r border-black">
                  <label className="font-bold block mb-2">7. CHOISISSEZ LE GENRE AUQUEL VOUS VOUS IDENTIFIEZ :</label>
                  <div className="flex flex-col gap-1">
                    <label><input type="radio" name="gender" value="Homme" /> Homme</label>
                    <label><input type="radio" name="gender" value="Femme" /> Femme</label>
                    <label><input type="radio" name="gender" value="Non-Binaire" /> Non-Binaire</label>
                  </div>
                </div>
                <div className="w-2/3 p-3">
                  <label className="font-bold block mb-2">8. GROUPE ETHNIQUE</label>
                  <div className="grid grid-cols-2 gap-1">
                    <label><input type="checkbox" name="eth_afro" value="Oui" /> Afro-Américain</label>
                    <label><input type="checkbox" name="eth_hisp" value="Oui" /> Hispanique</label>
                    <label><input type="checkbox" name="eth_asia" value="Oui" /> Asiatique</label>
                    <label><input type="checkbox" name="eth_cauc" value="Oui" /> Caucasien</label>
                    <label><input type="checkbox" name="eth_native" value="Oui" /> Natif Américain (amérindien)</label>
                    <label><input type="checkbox" name="eth_hawaii" value="Oui" /> Natif d'Hawaï ou des îles du Pacifique</label>
                    <label><input type="checkbox" name="eth_mixed" value="Oui" /> J'appartiens à plusieurs groupes</label>
                  </div>
                </div>
              </div>

              <div className="p-2 border-b border-black bg-gray-100 font-bold uppercase border-t-[3px] border-t-black mt-2">
                Éducations et Qualifications
              </div>
              
              <div className="flex border-b border-black">
                <div className="w-1/2 p-3 border-r border-black">
                  <label className="font-bold block mb-2 leading-tight">9a. AVEZ-VOUS ACQUIS VOTRE DIPLÔME DE FINS D'ÉTUDES SECONDAIRES OU VOTRE GED ?</label>
                  <div className="flex gap-4">
                    <label><input type="radio" name="hs" value="OUI" /> OUI</label>
                    <label><input type="radio" name="radio_hs" value="NON" /> NON</label>
                  </div>
                </div>
                <div className="w-1/2 p-3">
                  <label className="font-bold block mb-2 leading-tight">9b. SI MINEUR, POUVEZ-VOUS FAIRE PARVENIR UN PERMIS DE TRAVAIL OU CERTIFICAT DE VOTRE GED ?</label>
                  <div className="flex gap-4">
                    <label><input type="radio" name="under18" value="OUI" /> OUI</label>
                    <label><input type="radio" name="under18" value="NON" /> NON</label>
                  </div>
                </div>
              </div>

              <div className="p-3 border-b border-black">
                <label className="font-bold block mb-2">10. AUTRES DIPLÔMES ET QUALIFICATIONS</label>
                <textarea name="additionalEducation" className="w-full outline-none bg-gray-50 p-2 border border-gray-300 resize-none h-16" placeholder="Indiquez les diplômes/formations, date d'obtention et institution (ULSA, Berkeley, ...)."></textarea>
              </div>

              <div className="p-3 border-b border-black">
                <label className="font-bold block mb-2">11. COMPÉTENCES LINGUISTIQUES (AUTRES QUE L'ANGLAIS : INDIQUEZ "PARLÉE" ET/OU "ÉCRITE")</label>
                <input name="languages" type="text" className="w-full outline-none bg-gray-50 p-2 border border-gray-300" placeholder="ex: Espagnol (écrite & parlée)" />
              </div>

              <div className="p-4 bg-gray-100 mt-2">
                <h3 className="font-bold mb-2">12. INFORMATIONS SUPPLÉMENTAIRES</h3>
                <p className="text-justify text-[11px] text-gray-700 mb-4 leading-tight">
                  Les déclarations suivantes font partie des conditions générales pour l'emploi. Cette candidature ne constitue pas une offre d'emploi, simplement une opportunité d'obtenir le poste désigné. Votre candidature est sujette à une vérification et peut être rejetée à n'importe quel moment s'il est constaté que vous ne convenez pas aux qualifications spécifiées sur la fiche de poste à laquelle vous postulez.
                  <br/><br/>
                  Je certifie que toutes les déclarations sur cette candidature sont véridiques, complètes, ou à défaut de bonne foi. Je comprends que toute information volontairement erronée, trompeuse ou incomplète est une cause suffisante de disqualification ou de refus, et que d'autres malus peuvent être appliquées d'après la loi.
                </p>
                
                <div className="flex gap-4 items-end mt-6">
                  <div className="w-2/3 border-b border-black">
                    <label className="font-bold text-[10px] text-gray-500">13. SIGNATURE (En inscrivant votre nom, vous acceptez les conditions ci-dessus)</label>
                    <input name="signature" required type="text" className="w-full outline-none bg-transparent p-1 italic text-lg text-blue-900" placeholder="Signez ici..." />
                  </div>
                  <div className="w-1/3 border-b border-black">
                    <label className="font-bold text-[10px] text-gray-500">DATE</label>
                    <input type="text" readOnly value={new Date().toLocaleDateString('fr-FR')} className="w-full outline-none bg-transparent p-1" />
                  </div>
                </div>
              </div>

              {/* Bouton de transition vers OOC */}
              {!showOocForm && (
                <div className="p-4 bg-gray-200 flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setShowOocForm(true)}
                    className="bg-[#002b6b] hover:bg-blue-800 text-white font-bold py-3 px-8 rounded transition-colors uppercase shadow-md"
                  >
                    Continuer (Étape OOC)
                  </button>
                </div>
              )}

              {/* MODALE OOC */}
              {showOocForm && (
                <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                  <div 
                    className="bg-white border border-gray-700 text-gray-200 p-8 shadow-2xl w-full max-w-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button 
                      type="button"
                      onClick={() => setShowOocForm(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl"
                    >
                      &times;
                    </button>

                    <h3 className="text-2xl font-bold text-[#002b6b] mb-2 uppercase tracking-wide border-b border-gray-700 pb-3">
                      Informations OOC
                    </h3>
                    <p className="text-sm text-[#525252] mb-6">
                      Les informations suivantes permettent simplement de gérer la candidature.
                    </p>

                    <div className="space-y-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#525252]">PSEUDO UCP</label>
                        <input name="ucpName" required type="text" placeholder="ex: gtaplayer" className="bg-[#ededed] border border-gray-600 rounded p-2 text-[#8c8c8c] outline-none focus:border-blue-500" />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#525252]">PSEUDO DISCORD (NOM D'AJOUT)</label>
                        <input name="discordName" required type="text" placeholder="ex: betteryetanavy" className="bg-[#ededed] border border-gray-600 rounded p-2 text-[#8c8c8c] outline-none focus:border-blue-500" />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#525252]">ID DISCORD (ACTIVEZ LE MOD DÉVELOPPEUR)</label>
                        <input name="discordId" required type="text" placeholder="ex: 123456789012345678" className="bg-[#ededed] border border-gray-600 rounded p-2 text-[#8c8c8c] outline-none focus:border-blue-500 font-mono" />
                        <span className="text-[10px] text-gray-500">Un webhook pourra ainsi vous informer de l'évolution de la candidature.</span>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button 
                        type="submit" 
                        className="bg-[#002b6b] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded uppercase shadow-lg transition-colors w-full"
                      >
                        Valider et Envoyer
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      )}

      {/* LIEN DISCRET VERS LE PANEL ADMIN */}
      <div className="w-full text-center mt-12 mb-4">
        <Link 
          href="/admin/dashboard" 
          className="text-gray-400 hover:text-gray-600 text-[10px] uppercase tracking-widest transition-colors"
        >
          Espace Employeur
        </Link>
      </div>

    </div>
  );
}