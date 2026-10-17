import { useEffect, useState } from 'react';
import { listAttestations, deleteAttestation } from '../lib/db.js';
import { generateAttestationPdf, formatDateFr } from '../lib/generatePdf.js';

import './History.css';


function History({onChanged}) {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


      useEffect(() => {
    listAttestations()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

   const handlePdf = (rec) => {
    const doc = generateAttestationPdf(
      rec.employee,
      rec.companySnapshot,
      rec.numero,
      rec.dateGeneration
    );
    doc.save(`${rec.numero}.pdf`);
  };

    const handleDelete = async (rec) => {
    if (!window.confirm(`Supprimer l'attestation ${rec.numero} ?`)) return;
    try {
      await deleteAttestation(rec.id);
      setItems((list) => list.filter((a) => a.id !== rec.id));
      {/*optional chaining : */}
      onChanged?.();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <div className="card"><p className="muted">Chargement…</p></div>;



return (
    <section className="card">
        <div className="card-head">
            <h2>Historique des attestations</h2>
            <p>
                    {items.length} document{items.length > 1 ? 's' : ''} généré
                    {items.length > 1 ? 's' : ''} — téléchargez à nouveau ou supprimez.
            </p>
        </div>
        {error && <div className="alert">{error}</div>}
        {items.length === 0 ? (
        <div className="empty">
          <p>Aucune attestation pour le moment.</p>
          <p className="muted">Générez votre première attestation depuis l'onglet « Nouvelle attestation ».</p>
        </div>
      ) : (
         <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Salarié</th>
                <th>Fonction</th>
                <th>Entrée</th>
                <th>Généré le</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((rec) => (
                <tr key={rec.id}>
                  <td className="mono">{rec.numero}</td>
                  <td>
                    {rec.employee.nom} {rec.employee.prenom}
                  </td>
                  <td>{rec.employee.fonction || '—'}</td>
                  <td>{rec.employee.dateEntree ? formatDateFr(rec.employee.dateEntree) : '—'}</td>
                  <td>{rec.dateGeneration ? formatDateFr(rec.dateGeneration.slice(0, 10)) : '—'}</td>
                  <td className="actions-col">
                    <button className="btn small" onClick={() => handlePdf(rec)} title="Télécharger le PDF">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      PDF
                    </button>
                    <button className="btn small danger" onClick={() => handleDelete(rec)} title="Supprimer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>




)


} 
export default History ;