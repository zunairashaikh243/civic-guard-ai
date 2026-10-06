import React from 'react';
import { InfrastructureProvider, useInfrastructure } from './context/InfrastructureContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DemoFlowController from './components/DemoFlowController';

import LandingView from './views/LandingView';
import CitizenPortal from './views/CitizenPortal';
import WorkerPortal from './views/WorkerPortal';
import AdminDashboard from './views/AdminDashboard';

function MainContent() {
  const { activeView } = useInfrastructure();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <DemoFlowController />

        <main className="animate-fade-in">
          {activeView === 'landing' && <LandingView />}
          {activeView === 'citizen' && <CitizenPortal />}
          {activeView === 'worker' && <WorkerPortal />}
          {activeView === 'admin' && <AdminDashboard />}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <InfrastructureProvider>
      <MainContent />
    </InfrastructureProvider>
  );
}
