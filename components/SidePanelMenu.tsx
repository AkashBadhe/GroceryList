import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GroceryList } from '../types';

interface SidePanelMenuProps {
  visible: boolean;
  onClose: () => void;
  animation: Animated.Value;
  lists: GroceryList[];
  currentListId: string;
  onCreateNewList: () => void;
  onDuplicateList: (listId: string) => void;
  onSwitchToList: (listId: string) => void;
}

export const SidePanelMenu: React.FC<SidePanelMenuProps> = ({
  visible,
  onClose,
  animation,
  lists,
  currentListId,
  onCreateNewList,
  onDuplicateList,
  onSwitchToList,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.sidePanel,
            {
              transform: [{ translateX: animation }],
            },
          ]}
        >
          <View style={styles.sidePanelHeader}>
            <Text style={styles.sidePanelTitle}>Grocery Lists</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.sidePanelContent}>
            <TouchableOpacity
              style={styles.sidePanelItem}
              onPress={() => {
                onClose();
                onCreateNewList();
              }}
            >
              <Icon name="plus" size={24} color="#2196F3" style={styles.sidePanelIcon} />
              <Text style={styles.sidePanelItemText}>New List</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sidePanelItem}
              onPress={() => {
                onClose();
                const currentList = lists.find(list => list.id === currentListId);
                if (currentList) {
                  onDuplicateList(currentList.id);
                }
              }}
            >
              <Icon name="content-copy" size={24} color="#2196F3" style={styles.sidePanelIcon} />
              <Text style={styles.sidePanelItemText}>Duplicate Current List</Text>
            </TouchableOpacity>

            <View style={styles.sidePanelDivider} />

            <Text style={styles.sidePanelSectionTitle}>Your Lists</Text>
            {lists.map((list) => (
              <TouchableOpacity
                key={list.id}
                style={[
                  styles.sidePanelItem,
                  list.id === currentListId && styles.sidePanelItemActive,
                ]}
                onPress={() => {
                  onClose();
                  onSwitchToList(list.id);
                }}
              >
                <Icon
                  name={list.id === currentListId ? "check-circle" : "format-list-bulleted"}
                  size={24}
                  color={list.id === currentListId ? "#4CAF50" : "#666"}
                  style={styles.sidePanelIcon}
                />
                <View style={styles.sidePanelItemContent}>
                  <Text
                    style={[
                      styles.sidePanelItemText,
                      list.id === currentListId && styles.sidePanelItemTextActive,
                    ]}
                  >
                    {list.name}
                  </Text>
                  <Text style={styles.sidePanelItemSubtext}>
                    {list.items.length} items
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidePanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  sidePanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#2196F3',
  },
  sidePanelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  sidePanelContent: {
    flex: 1,
    padding: 16,
  },
  sidePanelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  sidePanelItemActive: {
    backgroundColor: '#E3F2FD',
  },
  sidePanelIcon: {
    marginRight: 16,
  },
  sidePanelItemContent: {
    flex: 1,
  },
  sidePanelItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sidePanelItemTextActive: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  sidePanelItemSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sidePanelDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  sidePanelSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
});
