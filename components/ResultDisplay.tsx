import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { DiagnosisResult } from '../types';
import { AnalysisIcon } from './icons/AnalysisIcon';
import { DesignIcon } from './icons/DesignIcon';
import { DevelopmentIcon } from './icons/DevelopmentIcon';
import { ImplementationIcon } from './icons/ImplementationIcon';
import { EvaluationIcon } from './icons/EvaluationIcon';
import { PrintIcon } from './icons/PrintIcon';
import { Spinner } from './icons/Spinner';

interface ResultDisplayProps {
  result: DiagnosisResult;
  onRestart: () => void;
}

const addieSections = [
    { key: 'analysis', title: 'Analysis (분석)', Icon: AnalysisIcon },
    { key: 'design', title: 'Design (설계)', Icon: DesignIcon },
    { key: 'development', title: 'Development (개발)', Icon: DevelopmentIcon },
    { key: 'implementation', title: 'Implementation (실행)', Icon: ImplementationIcon },
    { key: 'evaluation', title: 'Evaluation (평가)', Icon: EvaluationIcon },
] as const;


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onRestart }) => {
  const { diagnosisSummary, addieAnalysis, trainingProposal } = result;
  const printRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintPdf = async () => {
    if (!printRef.current) return;
    setIsPrinting(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('HRD_진단_결과_보고서.pdf');
    } catch (error) {
      console.error("PDF 생성 중 오류가 발생했습니다:", error);
      alert("PDF를 생성하는 데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div ref={printRef}>
        <div className="space-y-12">
            <div className="text-center p-6 bg-primary/10 rounded-lg dark:bg-primary/20">
                <h2 className="text-3xl font-bold text-primary dark:text-sky-400">교육 니즈 진단 결과</h2>
                <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto dark:text-gray-300">{diagnosisSummary}</p>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-secondary pl-4 dark:text-gray-100">ADDIE 모델 기반 교육 방향성</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {addieSections.map(({ key, title, Icon }) => (
                        <div key={key} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all dark:bg-gray-800/50 dark:border-gray-700">
                            <div className="flex items-center mb-3">
                                <Icon className="h-8 w-8 text-primary dark:text-sky-400" />
                                <h4 className="text-xl font-semibold text-gray-900 ml-3 dark:text-gray-50">{title}</h4>
                            </div>
                            <p className="text-gray-600 whitespace-pre-wrap dark:text-gray-300">{addieAnalysis[key]}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-secondary pl-4 dark:text-gray-100">맞춤 교육 과정 제안 (초안)</h3>
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner border dark:bg-gray-900/50 dark:border-gray-700">
                    <h4 className="text-2xl font-bold text-primary dark:text-sky-400">{trainingProposal.title}</h4>
                    <div className="mt-4 grid md:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
                        <p><strong className="font-semibold">교육 대상:</strong> {trainingProposal.targetAudience}</p>
                        <p><strong className="font-semibold">예상 기간:</strong> {trainingProposal.duration}</p>
                    </div>

                    <div className="mt-8 space-y-6">
                        {trainingProposal.modules.map((module, index) => (
                            <div key={index} className="border-t border-gray-200 pt-6 dark:border-gray-700">
                                <h5 className="text-xl font-bold text-gray-800 dark:text-gray-100">Module {index + 1}: {module.title}</h5>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"><strong className="font-semibold dark:text-gray-300">학습 목표:</strong> {module.objective}</p>
                                <div className="mt-4">
                                    <p className="font-semibold text-gray-700 dark:text-gray-300">주요 내용:</p>
                                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                                        {module.content.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                                <p className="mt-4 text-sm"><strong className="font-semibold text-gray-700 dark:text-gray-300">교육 방법: </strong><span className="text-secondary font-semibold">{module.method}</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="text-center pt-8 mt-8 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-center gap-4">
          <button
              onClick={handlePrintPdf}
              disabled={isPrinting}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
              {isPrinting ? (
                  <>
                      <Spinner className="h-5 w-5 text-white" />
                      <span className="ml-2">생성 중...</span>
                  </>
              ) : (
                  <>
                      <PrintIcon className="h-5 w-5 mr-2" />
                      PDF로 저장
                  </>
              )}
          </button>
          <button
              onClick={onRestart}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
              새로운 진단 시작하기
          </button>
      </div>
    </div>
  );
};