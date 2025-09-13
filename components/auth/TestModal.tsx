import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface TestModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TestModal({ visible, onClose }: TestModalProps) {
  console.log('TestModal render, visible:', visible);
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>TEST MODAL</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Zamknij</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#069494',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});