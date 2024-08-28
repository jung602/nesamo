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
      thumbnailImage: "./thumbs/dangbo.png",
      name: "Dangbo",
      heightWeight: "187cm",
      universe: "화산귀환",
      featureTags: ["Royal", "Black Hair", "Supporter"]
    },
    {
      id: 2,
      thumbnailImage: "./thumbs/nezu.png",
      name: "Nezu",
      heightWeight: "173cm",
      universe: "Pokémon Sword and Shield",
      featureTags: ["Black Hair", "배경2", "포지션2"]
    },
    {
      id: 3,
      thumbnailImage: "./thumbs/kibana.png",
      name: "Kibana",
      heightWeight: "203cm",
      universe: "Pokémon Sword and Shield",
      featureTags: ["Black Hair", "배경2", "포지션2"]
    },
    // 추가 카드 데이터...
  ];