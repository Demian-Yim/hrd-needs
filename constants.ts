
import type { SurveyStepConfig } from './types';

export const SURVEY_STEPS: SurveyStepConfig[] = [
  {
    id: 'organization',
    title: '1. 조직 현황 진단',
    description: '귀사의 현재 상황과 비즈니스 환경에 대해 알려주세요.',
    fields: [
      { id: 'companyName', label: '회사명', type: 'text', placeholder: '예: 주식회사 가나다' },
      { id: 'industry', label: '주요 산업 분야', type: 'text', placeholder: '예: IT, 제조업, 금융' },
      { id: 'employees', label: '전체 직원 수', type: 'select', options: ['1-50명', '51-200명', '201-500명', '501명 이상'] },
      { id: 'challenges', label: '현재 가장 큰 비즈니스 도전과제는 무엇인가요?', type: 'textarea', placeholder: '예: 신규 시장 진출, 디지털 전환, 핵심 인재 유지' },
    ],
  },
  {
    id: 'goals',
    title: '2. 교육 목표 설정',
    description: '이번 교육을 통해 달성하고자 하는 구체적인 목표를 설정합니다.',
    fields: [
      { id: 'primaryGoal', label: '교육의 가장 중요한 목표는 무엇인가요?', type: 'radio', options: ['직무 역량 강화', '리더십 개발', '조직 문화 개선', '업무 효율성 증대'] },
      { id: 'desiredOutcome', label: '교육 후 조직에 나타나길 바라는 가장 큰 변화는 무엇인가요?', type: 'textarea', placeholder: '예: 부서 간 협업 증진, 신입사원 조기 정착, 관리자들의 코칭 스킬 향상' },
      { id: 'successMetric', label: '교육의 성공을 어떤 지표로 측정하시겠습니까?', type: 'text', placeholder: '예: 업무 생산성 10% 향상, 퇴사율 5% 감소' },
    ],
  },
  {
    id: 'participants',
    title: '3. 교육 대상자 특성',
    description: '교육에 참여할 대상 그룹의 특성을 파악합니다.',
    fields: [
      { id: 'audience', label: '주요 교육 대상', type: 'select', options: ['신입사원', '실무자(주니어)', '중간관리자(팀장)', '임원', '전사원'] },
      { id: 'currentSkills', label: '교육 대상의 현재 역량 수준에 대해 간략히 설명해주세요.', type: 'textarea', placeholder: '예: 대체로 성실하나, 문제 해결 능력이 부족함. 디지털 툴 활용에 어려움을 겪음.' },
      { id: 'motivation', label: '교육 대상의 학습 동기는 어느 정도라고 생각하시나요?', type: 'radio', options: ['매우 높음', '보통', '낮음'] },
    ],
  },
  {
    id: 'environment',
    title: '4. 교육 환경 및 제약조건',
    description: '효과적인 교육 운영을 위한 환경과 제약사항을 확인합니다.',
    fields: [
      { id: 'format', label: '선호하는 교육 형태', type: 'radio', options: ['오프라인 집합교육', '온라인 라이브 교육', '동영상 VOD', '블렌디드 (온/오프라인 혼합)'] },
      { id: 'timeline', label: '희망하는 교육 시기 및 기간', type: 'text', placeholder: '예: 3분기 중, 총 3일 과정' },
      { id: 'budget', label: '교육 예산 범위 (1인당)', type: 'select', options: ['30만원 미만', '30만원 - 70만원', '70만원 - 150만원', '150만원 이상'] },
    ],
  },
];
