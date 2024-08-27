export type FeatureTagCategory = {
  name: string;
  color: string;
  tags: string[];
};

export type FeatureTagData = FeatureTagCategory[];

export let featureTagData: FeatureTagData = [
  {
    name: "Character",
    color: "pink",
    tags: ["Mean", "Kind", "Crazy"]
  },
  {
    name: "Role",
    color: "blue",
    tags: ["Duke", "Rich", "Royal", "Villain"]
  },
  {
    name: "Look",
    color: "green",
    tags: ["Black Hair", "White Hair", "Green Eyes"]
  }
];

export const getAllTags = (): string[] => {
  return featureTagData.flatMap(category => category.tags);
};

export const getCategoryColor = (categoryName: string): string | undefined => {
  return featureTagData.find(category => category.name === categoryName)?.color;
};

// 새 카테고리 추가
export const addCategory = (newCategory: FeatureTagCategory) => {
  featureTagData = [...featureTagData, newCategory];
};

// 카테고리에 새 태그 추가
export const addTagToCategory = (categoryName: string, newTag: string) => {
  featureTagData = featureTagData.map(category => 
    category.name === categoryName 
      ? { ...category, tags: [...category.tags, newTag] }
      : category
  );
};

// 카테고리의 태그 수정
export const modifyTagInCategory = (categoryName: string, oldTag: string, newTag: string) => {
  featureTagData = featureTagData.map(category => 
    category.name === categoryName 
      ? { 
          ...category, 
          tags: category.tags.map(tag => tag === oldTag ? newTag : tag)
        }
      : category
  );
};