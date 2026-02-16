/**
 * Grocery List App
 * Features: Search with suggestions, quantity, checkboxes for completion
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import {
  Provider as PaperProvider,
  Appbar,
  FAB,
} from 'react-native-paper';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Import extracted components
import {
  SearchBar,
  CategorySection,
  EmptyState,
  NewListDialog,
  SidePanelMenu,
} from './components';
import { SearchBarRef } from './components/SearchBar';

// Import hooks
import { useGroceryApp, useSearch } from './hooks';

// Import types
import { GroceryItem } from './types';
import { COMPREHENSIVE_GROCERY_ITEMS } from './data/groceryData';

function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <GroceryListApp />
      </SafeAreaProvider>
    </PaperProvider>
  );
}

function GroceryListApp() {
  const insets = useSafeAreaInsets();
  const searchBarRef = useRef<SearchBarRef>(null);
  const [customItemName, setCustomItemName] = useState('');
  const [showListDialog, setShowListDialog] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(-Dimensions.get('window').width * 0.8));

  // Use custom hooks
  const {
    appData,
    isInitialized,
    createNewList,
    switchToList,
    duplicateList,
    addItemToDatabase,
    addItem,
    toggleItem,
    deleteItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    updateItemCategories,
  } = useGroceryApp();

  // Load data on mount - handled by useGroceryApp hook internally
  useEffect(() => {
    // Data loading is handled by the useGroceryApp hook
  }, []);

  // Update existing items with proper categories when app initializes
  useEffect(() => {
    if (isInitialized) {
      updateItemCategories();
    }
  }, [isInitialized, updateItemCategories]);

  // Get current list
  const currentList = appData.lists.find(list => list.id === appData.currentListId);
  const items = currentList?.items || [];

  // Use search hook
  const {
    searchQuery,
    suggestions,
    showSuggestions,
    handleSearchChange,
    selectSuggestion,
    addCustomItem,
    clearSearch,
  } = useSearch(items);

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group items by category
  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, GroceryItem[]>);

  const handleCreateNewList = () => {
    createNewList(newListName);
    setNewListName('');
    setShowListDialog(false);
  };

  // Helper function to find correct category for an item name
  const findItemCategory = (itemName: string): string => {
    for (const item of COMPREHENSIVE_GROCERY_ITEMS) {
      // Check English name
      if (item.name.toLowerCase() === itemName.toLowerCase()) {
        return item.category;
      }
      // Check regional names
      if (item.regionalNames && item.regionalNames.some((regional: string) =>
        regional.toLowerCase() === itemName.toLowerCase()
      )) {
        return item.category;
      }
      // Check keywords
      if (item.keywords && item.keywords.some((keyword: string) =>
        keyword.toLowerCase() === itemName.toLowerCase()
      )) {
        return item.category;
      }
    }
    return 'Other'; // Default category if not found
  };

  const handleAddItem = async (itemData: any) => {
    const name = typeof itemData === 'string' ? itemData : itemData.name;
    const category = typeof itemData === 'string' ? findItemCategory(name) : itemData.category;
    await addItem(name, '1', category);
    clearSearch();
  };

  const handleSelectSuggestion = async (itemName: string) => {
    const selectedItem = await selectSuggestion(itemName);
    await handleAddItem(selectedItem);
  };

  const handleAddCustomItem = async () => {
    const customItem = addCustomItem();
    if (customItem.trim()) {
      // Add the custom item to the database for future use
      await addItemToDatabase(customItem, 'Other');
      await handleAddItem({ name: customItem, category: 'Other' });
    }
  };

  const openMenu = () => {
    setShowMenu(true);
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: -Dimensions.get('window').width * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowMenu(false));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content
          title={currentList?.name || 'Grocery List'}
          titleStyle={styles.appbarTitle}
        />
        <Appbar.Action
          icon="menu"
          onPress={openMenu}
          iconColor="#fff"
        />
      </Appbar.Header>

      {/* Side Panel Menu */}
      <SidePanelMenu
        visible={showMenu}
        onClose={closeMenu}
        animation={menuAnimation}
        lists={appData.lists}
        currentListId={appData.currentListId}
        onCreateNewList={() => setShowListDialog(true)}
        onDuplicateList={duplicateList}
        onSwitchToList={switchToList}
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <SearchBar
          ref={searchBarRef}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSubmit={handleAddCustomItem}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onSelectSuggestion={handleSelectSuggestion}
          onAddCustomItem={handleAddCustomItem}
        />

        {/* Items List */}
        <ScrollView
          style={styles.listsContainer}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
        >
          {Object.keys(groupedItems).length > 0 ? (
            Object.keys(groupedItems).map((category) => (
              <CategorySection
                key={category}
                category={category}
                items={groupedItems[category]}
                onToggleItem={toggleItem}
                onDeleteItem={deleteItem}
                onUpdateQuantity={updateQuantity}
                onIncrementQuantity={incrementQuantity}
                onDecrementQuantity={decrementQuantity}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </ScrollView>
      </View>

      {/* New List Dialog */}
      <NewListDialog
        visible={showListDialog}
        onDismiss={() => setShowListDialog(false)}
        listName={newListName}
        onListNameChange={setNewListName}
        onCreate={handleCreateNewList}
      />

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        label=""
        onPress={async () => {
          if (searchQuery.trim()) {
            // Find the correct category for the typed item
            const category = findItemCategory(searchQuery.trim());
            await handleAddItem({ name: searchQuery.trim(), category });
          } else {
            // Focus the search bar if it's empty
            searchBarRef.current?.focus();
          }
        }}
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        color="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  appbar: {
    backgroundColor: '#2196F3',
    elevation: 4,
  },
  appbarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  listsContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for FAB
  },
  fab: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#2196F3',
    zIndex: 1000,
    elevation: 6,
    borderRadius: 28,
  },
});

export default App;
