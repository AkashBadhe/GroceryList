import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GroceryItem } from '../types';
import { ItemCard } from './ItemCard';

interface CategorySectionProps {
  category: string;
  items: GroceryItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: string) => void;
  onIncrementQuantity: (id: string) => void;
  onDecrementQuantity: (id: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  items,
  onToggleItem,
  onDeleteItem,
  onUpdateQuantity,
  onIncrementQuantity,
  onDecrementQuantity,
}) => {
  const pendingCount = items.filter(item => !item.completed).length;

  return (
    <View style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <Icon name="shopping" size={24} color="#2196F3" style={styles.categoryIcon} />
        <Text style={styles.categoryTitle}>{category}</Text>
        <View style={styles.categoryStats}>
          <Text style={styles.categoryCount}>
            {pendingCount} pending
          </Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onToggle={onToggleItem}
            onDelete={onDeleteItem}
            onUpdateQuantity={onUpdateQuantity}
            onIncrement={onIncrementQuantity}
            onDecrement={onDecrementQuantity}
          />
        )}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  categoryStats: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryCount: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
});
