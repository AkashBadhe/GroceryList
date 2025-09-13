import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const EmptyState: React.FC = () => {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Icon name="cart-outline" size={64} color="#ccc" />
      </View>
      <Text style={styles.emptyText}>Your grocery list is empty</Text>
      <Text style={styles.emptySubtext}>
        Tap the "Add Item" button below to add your first item, or search for items above
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIconContainer: {
    marginBottom: 16,
    padding: 24,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
});
