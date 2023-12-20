import { useEffect, useState } from 'react';
import initializeFirebaseMessaging from './firebase';
import { Text, View } from 'react-native';

const App = () => {
  const [fcmToken, setFCMToken] = useState('');
  useEffect(() => {
    const fetchToken = async () => {
      const token = await initializeFirebaseMessaging();
      setFCMToken(token);
    };

    fetchToken();
  }, []);
  return (
    <View>
      <Text>Token Cloud Message</Text>
      <Text>{fcmToken}</Text>
    </View>
  );
};

export default App;
