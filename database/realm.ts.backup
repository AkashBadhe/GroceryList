import * as Realm from 'realm';

// Realm Schemas
export const GroceryItemSchema = {
  name: 'GroceryItem',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    name: { type: 'string', indexed: true },
    category: { type: 'string', indexed: true },
    keywords: 'string[]',
    regionalNames: 'string[]',
    isCustom: { type: 'bool', default: false },
    createdAt: 'date',
    updatedAt: 'date',
  },
};

export const ListItemSchema = {
  name: 'ListItem',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    name: { type: 'string', indexed: true },
    quantity: 'string',
    completed: { type: 'bool', default: false },
    category: 'string?',
    createdAt: 'date',
    updatedAt: 'date',
  },
};

export const GroceryListSchema = {
  name: 'GroceryList',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    name: { type: 'string', indexed: true },
    items: 'ListItem[]',
    isArchived: { type: 'bool', default: false },
    createdAt: 'date',
    updatedAt: 'date',
  },
};

export const AppSettingsSchema = {
  name: 'AppSettings',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    theme: { type: 'string', default: 'light' },
    language: { type: 'string', default: 'en' },
    updatedAt: 'date',
  },
};

// Realm Configuration
export const realmConfig: Realm.Configuration = {
  schema: [
    {
      name: 'GroceryItem',
      primaryKey: '_id',
      properties: {
        _id: 'objectId',
        name: { type: 'string', indexed: true },
        category: { type: 'string', indexed: true },
        keywords: 'string[]',
        regionalNames: 'string[]',
        isCustom: { type: 'bool', default: false },
        createdAt: 'date',
        updatedAt: 'date',
      },
    },
    {
      name: 'ListItem',
      primaryKey: '_id',
      properties: {
        _id: 'objectId',
        name: { type: 'string', indexed: true },
        quantity: 'string',
        completed: { type: 'bool', default: false },
        category: 'string?',
        createdAt: 'date',
        updatedAt: 'date',
      },
    },
    {
      name: 'GroceryList',
      primaryKey: '_id',
      properties: {
        _id: 'objectId',
        name: { type: 'string', indexed: true },
        items: 'ListItem[]',
        isArchived: { type: 'bool', default: false },
        createdAt: 'date',
        updatedAt: 'date',
      },
    },
    {
      name: 'AppSettings',
      primaryKey: '_id',
      properties: {
        _id: 'objectId',
        theme: { type: 'string', default: 'light' },
        language: { type: 'string', default: 'en' },
        updatedAt: 'date',
      },
    },
  ],
  schemaVersion: 1,
  onMigration: (oldRealm: Realm, newRealm: Realm) => {
    // Migration logic if needed in future versions
  },
};

// Database instance
let realmInstance: Realm | null = null;

export const getRealm = async (): Promise<Realm> => {
  if (!realmInstance || realmInstance.isClosed) {
    realmInstance = await Realm.open(realmConfig);
  }
  return realmInstance;
};

export const closeRealm = (): void => {
  if (realmInstance && !realmInstance.isClosed) {
    realmInstance.close();
    realmInstance = null;
  }
};

// Initialize database with default data
export const initializeRealmDatabase = async (): Promise<void> => {
  try {
    const realm = await getRealm();

    // Check if grocery items database is already initialized
    const existingItems = realm.objects('GroceryItem');
    if (existingItems.length === 0) {
      // Import comprehensive grocery data
      const { COMPREHENSIVE_GROCERY_ITEMS } = await import('../data/groceryData');

      realm.write(() => {
        COMPREHENSIVE_GROCERY_ITEMS.forEach((item: any) => {
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
        });
      });

      console.log('Realm database initialized with comprehensive grocery data');
    }

    // Check if settings exist
    const existingSettings = realm.objects('AppSettings');
    if (existingSettings.length === 0) {
      realm.write(() => {
        realm.create('AppSettings', {
          _id: new Realm.BSON.ObjectId(),
          theme: 'light',
          language: 'en',
          updatedAt: new Date(),
        });
      });
    }

    // Check if default list exists
    const existingLists = realm.objects('GroceryList');
    if (existingLists.length === 0) {
      realm.write(() => {
        const defaultList = realm.create('GroceryList', {
          _id: new Realm.BSON.ObjectId(),
          name: 'My Grocery List',
          items: [],
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Store current list ID in a simple key-value store
        // We'll handle this differently since Realm doesn't have simple key-value storage
      });
    }

  } catch (error) {
    console.error('Error initializing Realm database:', error);
    throw error;
  }
};

// Query functions
export const searchGroceryItems = (
  realm: Realm,
  query: string,
  limit: number = 10
): any[] => {
  if (!query.trim()) return [];

  const queryLower = query.toLowerCase().trim();

  // Build complex query for searching across multiple fields
  const results = realm.objects('GroceryItem').filtered(
    `name CONTAINS[c] "${queryLower}" OR ` +
    `ANY keywords CONTAINS[c] "${queryLower}" OR ` +
    `ANY regionalNames CONTAINS[c] "${queryLower}"`
  );

  // Sort by relevance (exact matches first, then prefix matches, etc.)
  const sortedResults = results.sorted([
    ['name', false], // Sort by name for consistent ordering
  ]);

  return Array.from(sortedResults.slice(0, limit));
};

export const getGroceryLists = (realm: Realm): any[] => {
  return Array.from(realm.objects('GroceryList').filtered('isArchived == false'));
};

export const getArchivedLists = (realm: Realm): any[] => {
  return Array.from(realm.objects('GroceryList').filtered('isArchived == true'));
};

export const getGroceryListById = (realm: Realm, id: string): any | null => {
  return realm.objectForPrimaryKey('GroceryList', new Realm.BSON.ObjectId(id));
};

export const getAppSettings = (realm: Realm): any | null => {
  const settings = realm.objects('AppSettings');
  return settings.length > 0 ? settings[0] : null;
};
