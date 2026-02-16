import React, { forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COMPREHENSIVE_GROCERY_ITEMS } from '../data/groceryData';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSubmit: () => void;
  suggestions: string[];
  showSuggestions: boolean;
  onSelectSuggestion: (item: string) => void;
  onAddCustomItem: () => void;
}

export interface SearchBarRef {
  focus: () => void;
}

export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(({
  searchQuery,
  onSearchChange,
  onSubmit,
  suggestions,
  showSuggestions,
  onSelectSuggestion,
  onAddCustomItem,
}, ref) => {
  const searchBarRef = React.useRef<any>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      searchBarRef.current?.focus();
    },
  }));

  return (
    <View style={styles.searchContainer}>
      <Searchbar
        ref={searchBarRef}
        placeholder="Search or add items..."
        onChangeText={onSearchChange}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        icon="magnify"
        clearIcon="close"
        onSubmitEditing={onSubmit}
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              // Check if this is a regional language name
              const isRegionalName = (() => {
                try {
                  // For now, just check against the hardcoded database
                  // In a real app, you'd want to load this asynchronously
                  return COMPREHENSIVE_GROCERY_ITEMS.some((dbItem: any) =>
                    dbItem.regionalNames?.includes(item)
                  );
                } catch {
                  return false;
                }
              })();

              return (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => onSelectSuggestion(item)}
                >
                  <Icon name="cart-plus" size={20} color="#4CAF50" style={styles.suggestionIcon} />
                  <View style={styles.suggestionTextContainer}>
                    <Text style={styles.suggestionText}>{item}</Text>
                    {isRegionalName && (
                      <Text style={styles.languageIndicator}>Regional</Text>
                    )}
                  </View>
                  <Icon name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>
              );
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {/* Add Custom Item Option */}
      {showSuggestions && searchQuery.length > 0 && !suggestions.some(s => s.toLowerCase() === searchQuery.toLowerCase()) && (
        <TouchableOpacity
          style={styles.addCustomItem}
          onPress={onAddCustomItem}
        >
          <Icon name="plus" size={20} color="#2196F3" style={styles.addIcon} />
          <Text style={styles.addCustomText}>Add "{searchQuery}"</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 20,
    zIndex: 1000,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    maxHeight: 200,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  addCustomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addIcon: {
    marginRight: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  languageIndicator: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
    marginTop: 2,
  },
  addCustomText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '500',
  },
});
