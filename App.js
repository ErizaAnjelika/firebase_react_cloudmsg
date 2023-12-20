// import { useEffect, useState } from 'react';
// import initializeFirebaseMessaging from './firebase';
// import { Text, View } from 'react-native';

// const App = () => {
//   const [fcmToken, setFCMToken] = useState('');
//   useEffect(() => {
//     const fetchToken = async () => {
//       const token = await initializeFirebaseMessaging();
//       setFCMToken(token);
//     };

//     fetchToken();
//   }, []);
//   return (
//     <View>
//       <Text>Token Cloud Message</Text>
//       <Text>{fcmToken}</Text>
//     </View>
//   );
// };

// export default App;

import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native';

const itemsCollection = firestore().collection('Mahasiswa');
const App = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [docId, setDocId] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemAge, setItemAge] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const snapshot = await itemsCollection.get();
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsData);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItems = async () => {
    try {
      const newId = docId || itemsCollection.doc().id;
      const numericAge = parseInt(itemAge);
      await itemsCollection
        .doc(newId)
        .set({ id: newId, Nama: itemName, Umur: numericAge });
      setDocId('');
      setItemName('');
      setItemAge('');
      setModalVisible(false);
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async () => {
    try {
      await itemsCollection.doc(selectedItem.id).delete();
      setDocId('');
      setItemName('');
      setItemAge('');
      setSelectedItem(null);
      setModalVisible(false);
      fetchItems();
    } catch (error) {
      console.log('Error deleting item:', error);
    }
  };
  const updateItem = async () => {
    try {
      const numericAge = parseInt(itemAge); //convert itemAge to a number
      await itemsCollection
        .doc(selectedItem.id)
        .update({ Nama: itemName, Umur: numericAge });
      setDocId('');
      setItemName('');
      setItemAge('');
      setSelectedItem(null);
      setModalVisible(false);
      fetchItems();
    } catch (error) {
      console.log('Error deleting item:', error);
    }
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setDocId(item.id);
    setItemName(item.Nama);
    setItemAge(item.Umur !== undefined ? item.Umur.toString() : '');
    modalVisible(true);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Add Item:</Text>
      <TextInput
        value={docId}
        onChangeText={(text) => setDocId(text)}
        placeholder='Enter Document ID (Optional)'
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        value={itemName}
        onChangeText={(text) => setItemName(text)}
        placeholder='Enter Name'
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        value={itemAge}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, ''); // allow only numeric input
          setItemAge(numericValue);
        }}
        placeholder='Enter Age'
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title='Add' onPress={addItems} />

      <Text style={{ marginTop: 20 }}>Items:</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View
              style={{
                marginBottom: 10,
                borderBottomWidth: 1,
                paddingBottom: 5,
              }}
            >
              <Text>ID: {item.id}</Text>
              <Text>Name: {item.Nama}</Text>
              <Text>Age: {item.Umur}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              value={docId}
              onChangeText={(text) => setDocId(text)}
              placeholder='Enter Document ID (Optional)'
              style={styles.input}
            />
            <TextInput
              value={itemName}
              onChangeText={(text) => setItemName(text)}
              placeholder='Enter Name'
              style={styles.input}
            />
            <TextInput
              value={itemAge}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, ''); // allow only numeric input
                setItemAge(numericValue);
              }}
              placeholder='Enter Age'
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <Button title='Update' onPress={updateItem} />
              <Button title='Delete' onPress={deleteItem} />
              <Button title='Close' onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    width: 250,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});
export default App;
