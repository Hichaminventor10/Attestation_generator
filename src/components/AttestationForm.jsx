
import {useState} from 'react'
import './AttestationForm.css';


const EMPTY = {
    civilite: 'M.',
    nom: '',
    prenom: '',
    dateNaissance: '',
    region: '',
    cin: '',
    adresse: '',
    fonction: '',
    service: '',
    matricule: '',
    dateEntree: '',
    dateSortie: ''

};






function AttestationForm({ company, onGenerated }) {


    const [form, setForm] = useState(EMPTY)
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false)

 const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.prenom.trim()) {
      setError('Le nom et le prénom du salarié sont obligatoires.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const record = await createAttestation({
        employee: form,
        companySnapshot: company,
        dateGeneration: new Date().toISOString()
      });
      onGenerated(record);
      setForm(EMPTY);
    } catch (err) {
      setError(err.message || 'erreur');
    } finally {
      setBusy(false);
    }
};

return(<>

<section className="card">
    <div className='card-head'>
        <h2>Données du Salarié</h2>
        <p>Saisissez les informations, puis cliquez sur « Générer l'attestation ».</p>
    </div>

    <form onSubmit={handleSubmit}>
        <h3 className='group-title'>Identité</h3>
        <div className='fields'>
            {/* civilité */}

            <div className='field half'>
                <label>Civilité *</label>
                <select>
                    <option>Monsieur (M.)</option>
                    <option>Madame (Mme)</option>
                </select>
            </div>
            <div>
                <label>Nom *</label>
                <input type="text" id="nom" value={form.nom} onChange={set('nom')} placeholder='Saisir votre Nom' required/>
            </div>
            <div>
                <label>Prenom *</label>
                <input type="text" id="prenom" value={form.prenom} onChange={set('prenom')} placeholder='Saisir votre Prenom' required/>
            </div>
            <div>
                <label>Date de Naissance </label>
                <input type="date" id="dateNaissance" value={form.dateNaissance} onChange={set('dateNaissance')} />
            </div>
            <div>
                <label htmlFor='region'>Région</label>
                <select id='region' value={form.region} onChange={set('region')}>
                          <option value="">-- Choisir une région --</option>

        <option value="1">Tanger-Tétouan-Al Hoceïma</option>

        <option value="2">L'Oriental</option>

        <option value="3">Fès-Meknès</option>

        <option value="4">Rabat-Salé-Kénitra</option>

        <option value="5">Béni Mellal-Khénifra</option>

        <option value="6">Casablanca-Settat</option>

        <option value="7">Marrakech-Safi</option>

        <option value="8">Drâa-Tafilalet</option>

        <option value="9">Souss-Massa</option>

        <option value="10">Guelmim-Oued Noun</option>

        <option value="11">Laâyoune-Sakia El Hamra</option>

        <option value="12">Dakhla-Oued Ed-Dahab</option>
                </select>
            </div>
             <div className="field half">
            <label htmlFor="cin">CIN</label>
            <input id="cin" value={form.cin} onChange={set('cin')}  placeholder="Ex : AB123456" />
          </div>
          <div className="field full">
            <label htmlFor="adresse">Adresse</label>
            <input id="adresse" value={form.adresse} onChange={set('adresse')}  placeholder="Ex : 10, Avenue Hay Essalam, Rabat" />
          </div>

        </div>

        {/* lautre champ est pour l Emploi  */}

         <h3 className="group-title">Emploi</h3>
         <div className="fields">

            <div className="field half">
                <label htmlFor="fonction">Fonction / Poste *</label>
                <input id="fonction" value={form.fonction} onChange={set('fonction')}  placeholder="Ex : Ingénieur informatique" required />
            </div>

             <div className="field half">
                <label htmlFor="service">Service / Département</label>
                <input id="service" value={form.service} onChange={set('service')}  placeholder="Ex : Testes" />
            </div>

            <div className="field half">
            <label htmlFor="dateEntree">Date d'entrée *</label>
            <input id="dateEntree" type="date" value={form.dateEntree} onChange={set('dateEntree')}  required />
            </div>

            <div className="field half">
            <label htmlFor="dateSortie">Date de sortie</label>
            <input id="dateSortie" type="date" value={form.dateSortie} onChange={set('dateSortie')}  />
            <small className="hint">Laisser vide si le salarié est toujours en poste.</small>
            </div>

            <div className="field half">
            <label htmlFor="matricule">Matricule</label>
            <input id="matricule"  placeholder="Ex : 00123" />
            </div>


         </div>
    </form>



</section>



</>


)


}

export default AttestationForm ;