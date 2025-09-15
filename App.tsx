import React, { useState, useCallback, useEffect } from 'react';
import { SurveyStep } from './components/SurveyStep';
import { ProgressBar } from './components/ProgressBar';
import { ResultDisplay } from './components/ResultDisplay';
import { Spinner } from './components/icons/Spinner';
import { SURVEY_STEPS } from './constants';
import type { SurveyData, DiagnosisResult } from './types';
import { generateProposal } from './services/geminiService';
import { DarkModeToggle } from './components/DarkModeToggle';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SurveyData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('theme');
        if (storedPrefs) {
            return storedPrefs as 'light' | 'dark';
        }
    }
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const totalSteps = SURVEY_STEPS.length;
  
  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleInputChange = useCallback((stepId: string, fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        [fieldId]: value,
      },
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const diagnosisResult = await generateProposal(formData);
      setResult(diagnosisResult);
      setCurrentStep(totalSteps); // Move to result view
    } catch (e) {
      console.error(e);
      setError('진단 결과 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, totalSteps]);

  const handleRestart = useCallback(() => {
      setResult(null);
      setFormData({});
      setCurrentStep(0);
      setError(null);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-white shadow-xl min-h-[400px] dark:bg-gray-800">
            <Spinner />
            <h2 className="text-2xl font-bold text-primary mt-6 dark:text-sky-400">AI가 교육 제안서를 생성중입니다...</h2>
            <p className="text-gray-600 mt-2 dark:text-gray-400">잠시만 기다려주세요. 최적의 교육 방향을 설계하고 있습니다.</p>
        </div>
      );
    }

    if (error) {
        return (
             <div className="text-center p-8 rounded-lg bg-white shadow-xl dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4">오류 발생</h2>
                <p className="text-gray-700 mb-6 dark:text-gray-300">{error}</p>
                <button
                    onClick={handleRestart}
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    처음으로 돌아가기
                </button>
            </div>
        );
    }

    if (result) {
      return <ResultDisplay result={result} onRestart={handleRestart} />;
    }

    return (
      <SurveyStep
        step={SURVEY_STEPS[currentStep]}
        formData={formData[SURVEY_STEPS[currentStep].id] || {}}
        onInputChange={handleInputChange}
        onNext={currentStep === totalSteps - 1 ? handleSubmit : handleNext}
        onBack={handleBack}
        isFirstStep={currentStep === 0}
        isLastStep={currentStep === totalSteps - 1}
      />
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans flex flex-col items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-sky-400">HRD 니즈 진단 시스템</h1>
          <p className="text-gray-600 mt-2 text-lg dark:text-gray-400">AI 기반 맞춤형 교육 솔루션 제안</p>
          <div className="absolute top-0 right-0">
            <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </header>

        <main className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 border border-gray-200 dark:border-gray-700 transition-colors">
           {!result && !isLoading && (
              <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            )}
           <div className={result || isLoading ? "" : "mt-8"}>
            {renderContent()}
           </div>
        </main>

        <footer className="text-center mt-8 text-gray-500 text-sm dark:text-gray-400">
            &copy; {new Date().getFullYear()} HRD Needs Assessment System. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default App;