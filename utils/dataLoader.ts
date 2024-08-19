import { Card, cardData } from '../data/cardData';

export const loadCardData = (): Promise<Card[]> => {
  return new Promise((resolve) => {
    // 실제 API 호출을 시뮬레이션하기 위해 setTimeout 사용
    setTimeout(() => {
      resolve(cardData);
    }, 1000);
  });
};