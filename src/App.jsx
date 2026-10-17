import { useState, useEffect } from 'react';
import AttestationForm from './components/AttestationForm';
import CompanySettings from './components/CompanySettings';
import ResultView from './components/ResultView';
import { DEFAULT_COMPANY } from './lib/defaultCompany';
import History from './components/History.jsx';
import { config, getCompany, saveCompany, supabase } from './lib/db';


import './App.css'; 


export default function App() {
    const [tab, setTab] = useState('form');

    const [company, setCompany] = useState(DEFAULT_COMPANY);
    const [generated, setGenerated] = useState(null);
     const [refreshKey, setRefreshKey] = useState(0);

        const [session, setSession] = useState(null);
        const [authReady, setAuthReady] = useState(!config.authRequired);


       useEffect(() => {
    if (!config.authRequired || !supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

    useEffect(() => {
    if (config.authRequired && !session) return;
    getCompany()
      .then(setCompany)
      .catch((e) => {
        // On garde les valeurs par défaut 
        console.error('[AttestPro] Chargement de l’entreprise impossible :', e.message);
      });
  }, [session]);





    const handleGenerated = (record) => {
  setGenerated(record);
};
    
const refresh = () => setRefreshKey((k) => k + 1);

  const handleCompanySave = async (c) => {
    const saved = await saveCompany(c);
    setCompany(saved);
    
  };


  return (
    <div className="app">

      {/* ---------- Header ---------- */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-plus"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M9 14h6"></path><path d="M12 17v-6"></path></svg>
         
          </div>

          <div>
            <h1>
              Attest<span>Pro</span>
            </h1>
            <p>Générateur d'attestations de travail</p>
          </div>
        </div>
        <nav className='tabs'>
          <button onClick={() => setTab('form')}  
            className={tab === 'form' ? 'active' : ''}
            >
            Nouvelle attestation
          </button>
            <button
              className={tab === 'history' ? 'active' : ''}
              onClick={() => {
                setGenerated(null);
                setTab('history');
              }}
            >
            Historique

          </button>
        </nav>

      </header>

      {/* ---------- Main ---------- */}
      <main className="main">


        {tab === 'form' &&
        (generated ? (
         <ResultView 
         record={generated}
         onNew={() => setGenerated(null)}
         onHistory={() =>{
          setGenerated(null);
          setTab('history')
         }}
         />

        ): (
        <div className="grid">
          <AttestationForm
            company={company}
            onGenerated={setGenerated}
          />

          <CompanySettings
            company={company}
            onSave={handleCompanySave}
          />
        </div> )) }
        
 {tab === 'history' && <History key={refreshKey} onChanged={refresh} />}
      
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="footer">
        AttestPro — React + Supabase + jsPDF 
      </footer>

    </div>
  );
}