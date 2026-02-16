import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GroceryItem, GroceryList, AppData } from '../types';
import { COMPREHENSIVE_GROCERY_ITEMS } from '../data/groceryData';
import { STORAGE_KEY } from '../constants';

export const useGroceryApp = () => {
  const [appData, setAppData] = useState<AppData>({
    lists: [],
    currentListId: '',
    settings: {
      theme: 'light',
      language: 'en',
    },
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from AsyncStorage
  const loadAppData = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Convert date strings back to Date objects
        const convertedData: AppData = {
          ...parsedData,
          lists: parsedData.lists.map((list: any) => ({
            ...list,
            createdAt: new Date(list.createdAt),
            updatedAt: new Date(list.updatedAt),
            items: list.items.map((item: any) => ({
              ...item,
              updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
            })),
          })),
        };
        setAppData(convertedData);
      } else {
        // Create default list if no data exists
        const defaultList: GroceryList = {
          id: 'default',
          name: 'My Grocery List',
          items: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const defaultData: AppData = {
          lists: [defaultList],
          currentListId: 'default',
          settings: {
            theme: 'light',
            language: 'en',
          },
        };

        setAppData(defaultData);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      }
    } catch (error) {
      console.error('Error loading app data:', error);
    }
  }, []);

  // Save data to AsyncStorage
  const saveAppData = useCallback(async (data: AppData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving app data:', error);
    }
  }, []);

  // Initialize app
  useEffect(() => {
    const initialize = async () => {
      await loadAppData();
      setIsInitialized(true);
    };
    initialize();
  }, [loadAppData]);

  // Create new list
  const createNewList = useCallback((name: string) => {
    if (!name.trim()) return;

    const newList: GroceryList = {
      id: Date.now().toString(),
      name: name.trim(),
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setAppData(prev => {
      const updated = {
        ...prev,
        lists: [...prev.lists, newList],
        currentListId: newList.id,
      };
      saveAppData(updated);
      return updated;
    });
  }, [saveAppData]);

  // Switch to list
  const switchToList = useCallback((listId: string) => {
    setAppData(prev => ({
      ...prev,
      currentListId: listId,
    }));
  }, []);

  // Duplicate list
  const duplicateList = useCallback((listId: string) => {
    const originalList = appData.lists.find(list => list.id === listId);
    if (!originalList) return;

    const duplicatedList: GroceryList = {
      id: Date.now().toString(),
      name: `${originalList.name} (Copy)`,
      items: [...originalList.items],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setAppData(prev => {
      const updated = {
        ...prev,
        lists: [...prev.lists, duplicatedList],
        currentListId: duplicatedList.id,
      };
      saveAppData(updated);
      return updated;
    });
  }, [appData.lists, saveAppData]);

  // Archive list (remove from active lists)
  const archiveList = useCallback((listId: string) => {
    setAppData(prev => {
      const updated = {
        ...prev,
        lists: prev.lists.filter(list => list.id !== listId),
        currentListId: prev.currentListId === listId ? (prev.lists.find(list => list.id !== listId)?.id || '') : prev.currentListId,
      };
      saveAppData(updated);
      return updated;
    });
  }, [saveAppData]);

  // Add item to database (for future use)
  const addItemToDatabase = useCallback(async (name: string, category: string) => {
    // This is a no-op for now since we're using static data
    console.log('Item added to database:', name, category);
  }, []);

  // Add item to current list
  const addItem = useCallback(async (name: string, quantity: string, category: string = '') => {
    const currentList = appData.lists.find(list => list.id === appData.currentListId);
    if (!currentList) return;

    const trimmedName = name.trim();
    const trimmedQuantity = quantity.trim();

    setAppData(prev => {
      const updated = {
        ...prev,
        lists: prev.lists.map(list => {
          if (list.id === currentList.id) {
            // Check if item already exists
            const existingItemIndex = list.items.findIndex(
              item => item.name.toLowerCase() === trimmedName.toLowerCase()
            );

            if (existingItemIndex >= 0) {
              // Item exists, increment quantity
              const existingItem = list.items[existingItemIndex];
              const currentQty = parseInt(existingItem.quantity) || 0;
              const addQty = parseInt(trimmedQuantity) || 1;
              const newQty = (currentQty + addQty).toString();

              const updatedItems = [...list.items];
              updatedItems[existingItemIndex] = {
                ...existingItem,
                quantity: newQty,
              };

              return {
                ...list,
                items: updatedItems,
                updatedAt: new Date()
              };
            } else {
              // Item doesn't exist, add new item
              const newItem: GroceryItem = {
                id: Date.now().toString(),
                name: trimmedName,
                quantity: trimmedQuantity,
                completed: false,
                category: category,
              };

              return {
                ...list,
                items: [...list.items, newItem],
                updatedAt: new Date()
              };
            }
          }
          return list;
        }),
      };
      saveAppData(updated);
      return updated;
    });
  }, [appData.lists, appData.currentListId, saveAppData]);

  // Toggle item completion
  const toggleItem = useCallback((id: string) => {
    setAppData(prev => {
      const updated = {
        ...prev,
        lists: prev.lists.map(list => ({
          ...list,
          items: list.items.map(item =>
            item.id === id
              ? { ...item, completed: !item.completed }
              : item
          ),
          updatedAt: list.items.some(item => item.id === id) ? new Date() : list.updatedAt,
        })),
      };
      saveAppData(updated);
      return updated;
    });
  }, [saveAppData]);

  // Delete item
  const deleteItem = useCallback((id: string) => {
    setAppData(prev => {
      const updated = {
        ...prev,
        lists: prev.lists.map(list => ({
          ...list,
          items: list.items.filter(item => item.id !== id),
          updatedAt: list.items.some(item => item.id === id) ? new Date() : list.updatedAt,
        })),
      };
      saveAppData(updated);
      return updated;
    });
  }, [saveAppData]);

  // Update item quantity
  const updateQuantity = useCallback((id: string, newQuantity: string) => {
    if (newQuantity !== '' && parseInt(newQuantity) < 0) return;

    setAppData(prev => {
      const updated = {
        ...prev,
        lists: prev.lists.map(list => ({
          ...list,
          items: list.items.map(item =>
            item.id === id
              ? { ...item, quantity: newQuantity }
              : item
          ),
          updatedAt: list.items.some(item => item.id === id) ? new Date() : list.updatedAt,
        })),
      };
      saveAppData(updated);
      return updated;
    });
  }, [saveAppData]);

  // Increment quantity
  const incrementQuantity = useCallback((id: string) => {
    setAppData(prev => {
      const updated = {
        ...prev,
        lists: prev.lists.map(list => ({
          ...list,
          items: list.items.map(item =>
            item.id === id
              ? { ...item, quantity: (parseInt(item.quantity) + 1).toString() }
              : item
          ),
          updatedAt: list.items.some(item => item.id === id) ? new Date() : list.updatedAt,
        })),
      };
      saveAppData(updated);
      return updated;
    });
  }, [saveAppData]);

  // Decrement quantity
  const decrementQuantity = useCallback((id: string) => {
    setAppData(prev => {
      const updated = {
        ...prev,
        lists: prev.lists.map(list => ({
          ...list,
          items: list.items.map(item =>
            item.id === id && parseInt(item.quantity) > 1
              ? { ...item, quantity: (parseInt(item.quantity) - 1).toString() }
              : item
          ),
          updatedAt: list.items.some(item => item.id === id) ? new Date() : list.updatedAt,
        })),
      };
      saveAppData(updated);
      return updated;
    });
  }, [saveAppData]);

  // Update existing items with proper categories
  const updateItemCategories = useCallback(() => {
    setAppData(prev => {
      const updated = {
        ...prev,
        lists: prev.lists.map(list => ({
          ...list,
          items: list.items.map(item => {
            // If item has no category or is 'Other', try to find it in the database
            if (!item.category || item.category === 'Other') {
              const foundItem = COMPREHENSIVE_GROCERY_ITEMS.find(dbItem =>
                dbItem.name.toLowerCase() === item.name.toLowerCase() ||
                dbItem.regionalNames?.some(regional =>
                  regional.toLowerCase() === item.name.toLowerCase()
                )
              );
              if (foundItem) {
                return { ...item, category: foundItem.category };
              }
            }
            return item;
          }),
          updatedAt: new Date(),
        })),
      };
      saveAppData(updated);
      return updated;
    });
  }, [saveAppData]);

  return {
    appData,
    isInitialized,
    createNewList,
    switchToList,
    duplicateList,
    archiveList,
    addItemToDatabase,
    addItem,
    toggleItem,
    deleteItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    updateItemCategories,
  };
};
