import { useEffect, useState } from 'react';
import './CompanySettings.css'
const FIELDS = [
  ['nom', 'Nom de l’entreprise *'],
  ['adresse', 'Adresse'],
  ['ville', 'Ville'],
  ['telephone', 'Téléphone'],
  ['email', 'Email'],
  ['rc', 'RC (Registre de commerce)'],
  ['ice', 'ICE'],
  ['if', 'IF (Identifiant fiscal)']
];


function CompanySettings({ company, onSave }) {
        const [form, setForm] = useState(company);
        const [busy, setBusy] = useState(false);
        const [notice, setNotice] = useState('');

  useEffect(() => setForm(company), [company]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));


      const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      await onSave(form);
      setNotice('Informations enregistrées ✓');
      setTimeout(() => setNotice(''), 3000);
    } catch {
      setNotice('');
    } finally {
      setBusy(false);
    }
  };


return(
        <aside className="card side">
      <div className="card-head">
        <h2>Entreprise</h2>
        <p>Apparaît en en-tête de l'attestation.</p>
      </div>

        <form onSubmit={handleSubmit} className="fields">
        {FIELDS.map(([key, label]) => (
          <div className="field" key={key}>
            <label htmlFor={`co-${key}`}>{label}</label>
            <input
              id={`co-${key}`}
              value={form[key] || ''}
              onChange={set(key)}
              required={key === 'nom'}
            />
          </div>
        ))}
        {notice && <div className="alert ok">{notice}</div>}
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Enregistrement…' : 'Enregistrer l’entreprise'}
        </button>
      </form>
    
     
        </aside>




)


}

export default CompanySettings ; 