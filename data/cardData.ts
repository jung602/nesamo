export type Card = {
    id: number;
    thumbnailImage: string;
    thumbnailImage2: string;
    name: string;
    nameKR: string;
    originName: string;
    height: string;
    universe: string;
    featureTags: string[];
  };
  
  export const cardData: Card[] = [
    {
      id: 1,
      thumbnailImage: "./thumbs/dangbo.png",
      thumbnailImage2: "",
      name: "Dangbo",
      nameKR: "당보",
      originName: "當步",
      height: "187cm",
      universe: "화산귀환",
      featureTags: ["Royal", "Black Hair", "Supporter"]
    },
    {
      id: 2,
      thumbnailImage: "./thumbs/nezu.png",
      thumbnailImage2: "",
      name: "Nezu",
      nameKR: "두송",
      originName: "ネズ",
      height: "173cm",
      universe: "Pokémon Sword and Shield",
      featureTags: ["Black Hair", "배경2", "포지션2"]
    },
    {
      id: 3,
      thumbnailImage: "./thumbs/kibana.png",
      thumbnailImage2: "",
      name: "Kibana",
      nameKR: "금랑",
      originName: "キバナ",
      height: "203cm",
      universe: "Pokémon Sword and Shield",
      featureTags: ["Black Hair", "배경2", "포지션2"]
    },
    // 추가 카드 데이터...
  ];