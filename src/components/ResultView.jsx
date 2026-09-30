import { useEffect, useState } from 'react';




function ResultView() {



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
                     N° 
                    </p>
                </div>

                <div className='result-actions'> 
                    <button className='btn primary' >
                          {/*download icons */}
                         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
                        Télécharger le PDF
                    </button>


                    <button className='btn ghost'>
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
                <iframe className='pdf-frame' title='apercu' />
            </div>
            <div className='info-grid'>

                <div className='info'>
                    <span>Salarié</span>
                    <strong></strong>
                </div>
                <div>
                    <span>fonction</span>
                    <strong></strong>
                </div>
                <div>
                    <span>Date d'entrée</span>
                    <strong></strong>
                </div>
                <div>
                    <span>Date de génération</span>
                    <strong></strong>
                </div>
                
            </div>
        </div>
    </section>


)


}

export default ResultView ; 