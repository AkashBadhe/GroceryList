import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Realm from 'realm';
import { STORAGE_KEY, ITEMS_DB_KEY } from '../constants';
import {
  GroceryListSchema,
  ListItemSchema,
  AppSettingsSchema,
  GroceryItemSchema,
  getRealm
} from './realm';

export const migrateDataToRealm = async (): Promise<void> => {
  try {
    console.log('Starting data migration from AsyncStorage to Realm...');

    const realm = await getRealm();

    // Check if migration has already been done
    const migrationFlag = await AsyncStorage.getItem('REALM_MIGRATION_COMPLETED');
    if (migrationFlag === 'true') {
      console.log('Migration already completed, skipping...');
      return;
    }

    // Migrate grocery items database
    const storedItems = await AsyncStorage.getItem(ITEMS_DB_KEY);
    if (storedItems) {
      const groceryItems = JSON.parse(storedItems);

      realm.write(() => {
        groceryItems.forEach((item: any) => {
          // Check if item already exists
          const existingItem = realm.objects('GroceryItem')
            .filtered('name == $0', item.name)[0];

          if (!existingItem) {
            realm.create('GroceryItem', {
              _id: new Realm.BSON.ObjectId(),
              name: item.name,
              category: item.category,
              keywords: item.keywords || [],
              regionalNames: item.regionalNames || [],
              isCustom: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        });
      });

      console.log(`Migrated ${groceryItems.length} grocery items to Realm`);
    }

    // Migrate app data (lists and settings)
    const storedAppData = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedAppData) {
      const appData = JSON.parse(storedAppData);

      realm.write(() => {
        // Migrate settings
        if (appData.settings) {
          const existingSettings = realm.objects('AppSettings');
          if (existingSettings.length === 0) {
            realm.create('AppSettings', {
              _id: new Realm.BSON.ObjectId(),
              theme: appData.settings.theme || 'light',
              language: appData.settings.language || 'en',
              updatedAt: new Date(),
            });
          }
        }

        // Migrate lists
        if (appData.lists && Array.isArray(appData.lists)) {
          appData.lists.forEach((list: any) => {
            const listItems: any[] = [];

            // Create list items
            if (list.items && Array.isArray(list.items)) {
              list.items.forEach((item: any) => {
                const listItem = realm.create('ListItem', {
                  _id: new Realm.BSON.ObjectId(),
                  name: item.name,
                  quantity: item.quantity || '1',
                  completed: item.completed || false,
                  category: item.category,
                  createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
                  updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
                });
                listItems.push(listItem);
              });
            }

            // Create the list
            realm.create('GroceryList', {
              _id: new Realm.BSON.ObjectId(),
              name: list.name,
              items: listItems,
              isArchived: list.isArchived || false,
              createdAt: list.createdAt ? new Date(list.createdAt) : new Date(),
              updatedAt: list.updatedAt ? new Date(list.updatedAt) : new Date(),
            });
          });
        }
      });

      console.log(`Migrated ${appData.lists?.length || 0} grocery lists to Realm`);
    }

    // Mark migration as completed
    await AsyncStorage.setItem('REALM_MIGRATION_COMPLETED', 'true');

    console.log('Data migration completed successfully!');

  } catch (error) {
    console.error('Error during data migration:', error);
    throw error;
  }
};

export const clearOldAsyncStorage = async (): Promise<void> => {
  try {
    // Keep the migration flag but remove old data
    const keysToRemove = [STORAGE_KEY, ITEMS_DB_KEY];
    await AsyncStorage.multiRemove(keysToRemove);
    console.log('Old AsyncStorage data cleared');
  } catch (error) {
    console.error('Error clearing old AsyncStorage data:', error);
  }
};
