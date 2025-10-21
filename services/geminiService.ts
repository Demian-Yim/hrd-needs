import { GoogleGenAI, Type } from "@google/genai";
import type { SurveyData, DiagnosisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("Google Gemini API 키가 설정되지 않았습니다. Netlify 환경 변수에서 API_KEY를 설정해주세요.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function formatSurveyDataForPrompt(answers: SurveyData): string {
  let formatted = "HRD 교육 니즈 진단 설문 결과:\n\n";
  
  if (answers.organization) {
    formatted += "1. 조직 현황:\n";
    formatted += `- 회사명: ${answers.organization.companyName || 'N/A'}\n`;
    formatted += `- 산업 분야: ${answers.organization.industry || 'N/A'}\n`;
    formatted += `- 직원 수: ${answers.organization.employees || 'N/A'}\n`;
    formatted += `- 주요 도전과제: ${answers.organization.challenges || 'N/A'}\n\n`;
  }
  if (answers.goals) {
    formatted += "2. 교육 목표:\n";
    formatted += `- 핵심 목표: ${answers.goals.primaryGoal || 'N/A'}\n`;
    formatted += `- 기대 변화: ${answers.goals.desiredOutcome || 'N/A'}\n`;
    formatted += `- 성공 지표: ${answers.goals.successMetric || 'N/A'}\n\n`;
  }
  if (answers.participants) {
    formatted += "3. 교육 대상:\n";
    formatted += `- 대상 그룹: ${answers.participants.audience || 'N/A'}\n`;
    formatted += `- 현재 역량: ${answers.participants.currentSkills || 'N/A'}\n`;
    formatted += `- 학습 동기: ${answers.participants.motivation || 'N/A'}\n\n`;
  }
  if (answers.environment) {
    formatted += "4. 교육 환경:\n";
    formatted += `- 선호 형태: ${answers.environment.format || 'N/A'}\n`;
    formatted += `- 희망 시기/기간: ${answers.environment.timeline || 'N/A'}\n`;
    formatted += `- 예산 범위: ${answers.environment.budget || 'N/A'}\n\n`;
  }

  return formatted;
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        diagnosisSummary: {
            type: Type.STRING,
            description: "설문 결과를 종합하여 교육의 필요성과 핵심 방향을 1~2문장으로 요약합니다."
        },
        addieAnalysis: {
            type: Type.OBJECT,
            description: "ADDIE 모델의 각 5단계(분석, 설계, 개발, 실행, 평가)에 맞춰 교육 전략을 구체적으로 제안합니다. 각 단계는 2-3문장으로 간결하게 작성합니다.",
            properties: {
                analysis: { type: Type.STRING, description: "분석(Analysis) 단계: 현재 상황과 요구사항을 분석한 결과입니다." },
                design: { type: Type.STRING, description: "설계(Design) 단계: 교육 목표, 학습 내용, 평가 방법을 설계한 결과입니다." },
                development: { type: Type.STRING, description: "개발(Development) 단계: 교육 자료와 프로그램을 개발하는 방안입니다." },
                implementation: { type: Type.STRING, description: "실행(Implementation) 단계: 교육을 효과적으로 전달하고 운영하는 방안입니다." },
                evaluation: { type: Type.STRING, description: "평가(Evaluation) 단계: 교육의 효과를 측정하고 피드백하는 방안입니다." }
            }
        },
        trainingProposal: {
            type: Type.OBJECT,
            description: "실제 실행 가능한 교육 과정의 초안입니다.",
            properties: {
                title: { type: Type.STRING, description: "교육 과정의 전체 제목입니다." },
                targetAudience: { type: Type.STRING, description: "교육의 주요 대상입니다." },
                duration: { type: Type.STRING, description: "총 교육 기간 또는 시간입니다." },
                modules: {
                    type: Type.ARRAY,
                    description: "교육 내용을 구성하는 개별 모듈의 리스트입니다. 2~3개의 핵심 모듈을 제안합니다.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "모듈의 제목입니다." },
                            objective: { type: Type.STRING, description: "이 모듈을 통해 달성하고자 하는 학습 목표입니다." },
                            content: { type: Type.ARRAY, items: { type: Type.STRING }, description: "모듈에서 다룰 주요 학습 내용 항목들입니다." },
                            method: { type: Type.STRING, description: "이 모듈에 가장 적합한 교육 방법입니다 (예: 강의, 워크샵, 롤플레잉, 토론)." }
                        }
                    }
                }
            }
        }
    }
};


export const generateProposal = async (answers: SurveyData): Promise<DiagnosisResult> => {
  const prompt = formatSurveyDataForPrompt(answers);
  const fullPrompt = `${prompt}
---
위의 설문 결과를 바탕으로, 전문 HRD 컨설턴트로서 ADDIE 모델에 근거하여 교육 니즈를 진단하고 맞춤형 교육 제안서를 JSON 형식으로 생성해주세요. 모든 내용은 한국어로 작성해주세요.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as DiagnosisResult;
    
  } catch (error) {
    console.error("Error generating proposal from Gemini:", error);
    throw new Error("Failed to generate AI proposal.");
  }
};