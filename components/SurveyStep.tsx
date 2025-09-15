import React from 'react';
import type { SurveyStepConfig } from '../types';

interface SurveyStepProps {
  step: SurveyStepConfig;
  formData: { [key: string]: string };
  onInputChange: (stepId: string, fieldId: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const renderField = (
    stepId: string,
    field: SurveyStepConfig['fields'][0], 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
) => {
    const commonClasses = "mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400";
    
    switch (field.type) {
        case 'text':
            return <input type="text" id={field.id} value={value} onChange={onChange} placeholder={field.placeholder} className={commonClasses} />;
        case 'textarea':
            return <textarea id={field.id} value={value} onChange={onChange} placeholder={field.placeholder} rows={4} className={commonClasses} />;
        case 'select':
            return (
                <select id={field.id} value={value} onChange={onChange} className={commonClasses}>
                    <option value="">선택해주세요</option>
                    {field.options?.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
            );
        case 'radio':
            return (
                <div className="mt-2 space-y-2 sm:space-y-0 sm:flex sm:space-x-4">
                    {field.options?.map(option => (
                        <label key={option} className="inline-flex items-center cursor-pointer p-3 border rounded-md has-[:checked]:bg-blue-50 has-[:checked]:border-primary transition-all dark:border-gray-600 dark:has-[:checked]:bg-primary/20">
                            <input type="radio" name={field.id} value={option} checked={value === option} onChange={onChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-500 dark:bg-gray-600" />
                            <span className="ml-3 text-gray-700 dark:text-gray-300">{option}</span>
                        </label>
                    ))}
                </div>
            );
        default:
            return null;
    }
}

export const SurveyStep: React.FC<SurveyStepProps> = ({
  step,
  formData,
  onInputChange,
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
}) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-primary dark:text-sky-400">{step.title}</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{step.description}</p>
      
      <div className="mt-8 space-y-6">
        {step.fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-md font-medium text-gray-800 dark:text-gray-200">
              {field.label}
            </label>
            {renderField(
                step.id,
                field,
                formData[field.id] || '',
                (e) => onInputChange(step.id, field.id, e.target.value)
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-between">
        {!isFirstStep ? (
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            이전
          </button>
        ) : <div />}
        <button
          onClick={onNext}
          className="px-8 py-3 bg-secondary hover:bg-secondary-dark rounded-lg text-white font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          {isLastStep ? '진단 결과 보기' : '다음'}
        </button>
      </div>
    </div>
  );
};