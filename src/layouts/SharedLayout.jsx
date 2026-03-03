import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import NavBar from '../components/NavBar';
import { LanguageProvider, useLanguage } from '../i18n/LanguageContext';

function SharedLayoutInner() {
  const { t } = useLanguage();
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const location = useLocation();

  const isNumMantle = location.pathname === '/num';
  const isAnimalMantle = location.pathname === '/animal';
  const isFranchiseMantle = location.pathname === '/franchise';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-teal-400 mb-2">
        {isFranchiseMantle ? '🏪 FranchiseMantle' : isAnimalMantle ? '🐾 AnimalMantle' : isNumMantle ? '#️ NumMantle' : 'Geo-Mantle'}
      </h1>

      <NavBar onShowInstructions={() => setShowInstructionsModal(true)} />

      {/* Page content */}
      <Outlet />

      {/* Footer */}
      <footer className="w-full max-w-md mt-8 mb-4 text-center">
        <Link
          to="/privacy"
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors underline"
        >
          {t('privacyPolicy')}
        </Link>
      </footer>

      {/* Instructions Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-left relative max-w-lg">
            <button
              onClick={() => setShowInstructionsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
              aria-label={t('closeDescription')}
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-teal-400 mb-4">
              {isFranchiseMantle ? t('franchiseInstructionsTitle') : isAnimalMantle ? t('animalInstructionsTitle') : isNumMantle ? t('numInstructionsTitle') : t('instructionsTitle')}
            </h2>
            <div className="text-gray-200 space-y-3">
              {isFranchiseMantle ? (
                <>
                  <p>{t('franchiseInstruction1')}</p>
                  <p>{t('franchiseInstruction2')}</p>
                  <p>{t('franchiseInstruction3')}</p>
                  <p>{t('franchiseInstruction4')}</p>
                  <p>{t('franchiseInstruction5')}</p>
                </>
              ) : isAnimalMantle ? (
                <>
                  <p>{t('animalInstruction1')}</p>
                  <p>{t('animalInstruction2')}</p>
                  <p>{t('animalInstruction3')}</p>
                  <p>{t('animalInstruction4')}</p>
                  <p>{t('animalInstruction5')}</p>
                </>
              ) : isNumMantle ? (
                <>
                  <p>{t('numInstruction1')}</p>
                  <p>{t('numInstruction2')}</p>
                  <p>{t('numInstruction3')}</p>
                  <p>{t('numInstruction4')}</p>
                  <p>{t('numInstruction5')}</p>
                </>
              ) : (
                <>
                  <p>{t('instruction1')}</p>
                  <p>{t('instruction2')}</p>
                  <p>{t('instruction3')}</p>
                  <p>{t('instruction4')}</p>
                  <p>{t('instruction5')}</p>
                </>
              )}
            </div>
            <button
              onClick={() => setShowInstructionsModal(false)}
              className="mt-6 px-6 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors w-full"
            >
              {t('closeButton')}
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal code removed */}

      <Analytics />
    </div>
  );
}

function SharedLayout() {
  return (
    <LanguageProvider>
      <SharedLayoutInner />
    </LanguageProvider>
  );
}

export default SharedLayout;
