import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GroceryItem } from '../types';

interface ItemCardProps {
  item: GroceryItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onToggle,
  onDelete,
  onUpdateQuantity,
  onIncrement,
  onDecrement,
}) => {
  const handleDelete = () => {
    onDelete(item.id);
  };

  return (
    <Card style={[styles.itemCard, item.completed && styles.completedCard]}>
      <Card.Content style={styles.itemContent}>
        <View style={styles.itemRow}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => onToggle(item.id)}
          >
            <Icon
              name={item.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
              size={24}
              color={item.completed ? "#4CAF50" : "#757575"}
            />
          </TouchableOpacity>

          <View style={styles.itemDetails}>
            <Text style={[styles.itemName, item.completed && styles.completedText]}>
              {item.name}
            </Text>
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityBadgeText}>Qty: {item.quantity}</Text>
            </View>
          </View>

          <View style={styles.itemActions}>
            <View style={styles.quantityControls}>
              <IconButton
                icon="minus"
                size={20}
                onPress={() => onDecrement(item.id)}
                disabled={parseInt(item.quantity) <= 1}
                iconColor={parseInt(item.quantity) <= 1 ? "#ccc" : "#2196F3"}
                style={[styles.quantityButton, parseInt(item.quantity) <= 1 && styles.quantityButtonDisabled]}
              />

              <IconButton
                icon="plus"
                size={20}
                onPress={() => onIncrement(item.id)}
                iconColor="#2196F3"
                style={styles.quantityButton}
              />
            </View>

            <IconButton
              icon="delete"
              size={20}
              onPress={handleDelete}
              iconColor="#F44336"
              style={styles.deleteButton}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  completedCard: {
    backgroundColor: '#F8F9FA',
    opacity: 0.8,
  },
  itemContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  quantityBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  quantityBadgeText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    marginRight: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  quantityButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
});
