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
  Portal,
  Dialog,
  TextInput,
  Button,
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

// Import hooks
import { useGroceryApp, useSearch } from './hooks';

// Import types
import { GroceryItem } from './types';

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
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
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
  } = useGroceryApp();

  // Load data on mount - handled by useGroceryApp hook internally
  useEffect(() => {
    // Data loading is handled by the useGroceryApp hook
  }, []);

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

  const handleAddItem = async (name: string) => {
    await addItem(name, '1');
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
      await handleAddItem(customItem);
    }
  };

  const handleAddCustomItemDialog = async () => {
    if (customItemName.trim()) {
      await addItemToDatabase(customItemName, 'Other');
      await addItem(customItemName, '1');
      setCustomItemName('');
      setShowAddItemDialog(false);
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

      {/* Add Item Dialog */}
      <Portal>
        <Dialog visible={showAddItemDialog} onDismiss={() => setShowAddItemDialog(false)}>
          <Dialog.Title>Add Custom Item</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Item Name"
              value={customItemName}
              onChangeText={setCustomItemName}
              mode="outlined"
              autoFocus
              onSubmitEditing={handleAddCustomItemDialog}
              placeholder="Enter item name..."
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddItemDialog(false)}>Cancel</Button>
            <Button
              onPress={handleAddCustomItemDialog}
              disabled={!customItemName.trim()}
            >
              Add Item
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        label=""
        onPress={async () => {
          if (searchQuery.trim()) {
            await handleAddItem(searchQuery);
          } else {
            setShowAddItemDialog(true);
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
