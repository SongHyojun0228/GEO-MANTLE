import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function PrivacyPage() {
    const { t } = useLanguage();
    return (
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl text-left mt-8 mb-8">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">{t('privacyPolicy')}</h2>
            <div className="text-gray-300 space-y-4 text-sm">
                <p>{t('privacyIntro')}</p>
                <div>
                    <h3 className="font-semibold text-gray-100 mb-1">{t('privacySection1Title')}</h3>
                    <p>{t('privacySection1Content')}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-100 mb-1">{t('privacySection2Title')}</h3>
                    <p>{t('privacySection2Content')}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-100 mb-1">{t('privacySection3Title')}</h3>
                    <p>{t('privacySection3Content')}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-100 mb-1">{t('privacySection4Title')}</h3>
                    <p>{t('privacySection4Content')}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-100 mb-1">{t('privacySection5Title')}</h3>
                    <p>{t('privacySection5Content')}</p>
                </div>
                <p className="text-gray-500 text-xs">{t('privacyLastUpdated')}</p>
            </div>
        </div>
    );
}
