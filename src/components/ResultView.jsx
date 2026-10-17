
import { useEffect, useState } from 'react';
import { generateAttestationPdf, formatDateFr } from '../lib/generatePdf.js';
import './ResultView.css' ;


function ResultView({ record,onNew, onHistory}) {

    const [doc, setDoc] = useState(null);
    const [url, setUrl] = useState('');


 useEffect(() => {
    const d = generateAttestationPdf(
      record.employee,
      record.companySnapshot,
      record.numero,
      record.dateGeneration
    );
    setDoc(d);
    setUrl(d.output('datauristring'));
  }, [record]);

  const download = () => doc && doc.save(`${record.numero}.pdf`);
  const print = () => window.open(url, '_blank');

  const e = record.employee;

return (
    <section className='result'>
        <div className='card'>
            <div className='result-head'>


                <div className='success-badge'>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
                </div>


                <div className='result-head-text'>
                    <h2>Attestation générée avec succès</h2>
                    <p>      
                     N° <strong className="mono">{record.numero}</strong> — {e.nom} {e.prenom}
                    </p>
                </div>

                <div className='result-actions'> 
                    <button className='btn primary' onClick={download} disabled={!doc}>
                          {/*download icons */}
                         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
                        Télécharger le PDF
                    </button>


                    <button className='btn ghost imp' onClick={print} disabled={!url}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
                        Imprimer
                    </button>
                </div>
            </div>

            <div className='pdf-frame-wrap'>
                <iframe className="pdf-frame" src={url} title={`Aperçu ${record.numero}`} />
            </div>
            <div className='info-grid'>

                <div className='info'>
                    <span>Salarié</span>
                     <strong>{e.civilite} {e.nom} {e.prenom}</strong>
                </div>
                <div className='info'>
                    <span>fonction</span>
                    <strong>{e.fonction || '—'}</strong>
                </div>
                <div className='info'>
                    <span>Date d'entrée</span>
                    <strong>{e.dateEntree ? formatDateFr(e.dateEntree) : '—'}</strong>
                </div>
                <div className='info'>
                    <span>Date de génération</span>
                     <strong>{record.dateGeneration ? formatDateFr(record.dateGeneration.slice(0, 10)) : '—'}</strong>
                </div>
            </div>

            <div className='form-actions center'>

                <button className='btn primary' onClick={onNew}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d='M10.17 2.25h7.66c.535 0 .98 0 1.345.03.38.03.736.098 1.073.27a2.75 2.75 0 0 1 1.203 1.201c.171.338.238.694.27 1.074.03.364.03.81.03 1.344v7.661c0 .534 0 .98-.03 1.345-.032.38-.099.736-.27 1.073a2.752 2.752 0 0 1-1.203 1.203c-.337.171-.693.238-1.072.27-.364.029-.809.029-1.342.029h-7.667c-.534 0-.979 0-1.343-.03-.38-.03-.736-.098-1.073-.27a2.75 2.75 0 0 1-1.201-1.202c-.172-.337-.24-.693-.27-1.073-.03-.364-.03-.81-.03-1.344V6.17c0-.534 0-.98.03-1.345.03-.38.098-.736.27-1.074a2.75 2.75 0 0 1 1.2-1.201c.338-.172.694-.24 1.074-.27.365-.03.81-.03 1.345-.03M3 8.25a.75.75 0 0 1 .75.75v10.4c0 .292 0 .466.011.596a.625.625 0 0 0 .018.12.25.25 0 0 0 .104.105.633.633 0 0 0 .12.018c.13.01.304.011.595.011H15a.75.75 0 0 1 0 1.5H4.572c-.257 0-.493 0-.69-.016a1.773 1.773 0 0 1-.677-.175 1.75 1.75 0 0 1-.764-.765 1.774 1.774 0 0 1-.175-.676 9.05 9.05 0 0 1-.016-.692V9A.75.75 0 0 1 3 8.25m11-2a.75.75 0 0 0-.75.75v2.25H11a.75.75 0 0 0 0 1.5h2.25V13a.75.75 0 0 0 1.5 0v-2.25H17a.75.75 0 0 0 0-1.5h-2.25V7a.75.75 0 0 0-.75-.75'/></svg>
            
                     Nouvelle attestation
                </button>
                
                <button className='btn ghost his' onClick={onHistory}>

                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard2-plus" viewBox="0 0 16 16">
  <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
  <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"/>
  <path d="M8.5 6.5a.5.5 0 0 0-1 0V8H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V9H10a.5.5 0 0 0 0-1H8.5z"/>
</svg>
                     Voir l'historique
                </button>
            </div>
        </div>
    </section>


)


}

export default ResultView ; 