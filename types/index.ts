export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  completed: boolean;
  category?: string;
}

export interface GroceryList {
  id: string;
  name: string;
  items: GroceryItem[];
  createdAt: Date;
  updatedAt: Date;
  isArchived?: boolean;
}

export interface AppData {
  lists: GroceryList[];
  currentListId: string;
  settings: {
    theme: 'light' | 'dark';
    language: string;
  };
}

export interface GroceryItemData {
  name: string;
  category: string;
  keywords: string[];
  regionalNames: string[];
}
