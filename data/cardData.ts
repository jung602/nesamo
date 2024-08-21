export type Card = {
    id: number;
    thumbnailImage: string;
    name: string;
    heightWeight: string;
    universe: string;
    featureTags: string[];
  };
  
  export const cardData: Card[] = [
    {
      id: 1,
      thumbnailImage: "/images/card1.jpg",
      name: "캐릭터1",
      heightWeight: "180cm / 70kg",
      universe: "우주1",
      featureTags: ["성격이 나쁨", "배경1", "포지션1"]
    },
    {
      id: 2,
      thumbnailImage: "/images/card2.jpg",
      name: "캐릭터2",
      heightWeight: "165cm / 55kg",
      universe: "우주2",
      featureTags: ["착함", "배경2", "포지션2"]
    },
    {
      id: 3,
      thumbnailImage: "/images/card2.jpg",
      name: "캐릭터2",
      heightWeight: "165cm / 55kg",
      universe: "우주2",
      featureTags: ["착함", "배경2", "포지션2"]
    },
    // 추가 카드 데이터...
  ];