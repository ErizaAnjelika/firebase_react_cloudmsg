import messaging from '@react-native-firebase/messaging';

const initializeFirebaseMessaging = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const permissionGranted = await messaging().requestPermission();
    if (permissionGranted) {
      console.log('firebase Messaging is ready!');
      const token = await messaging().getToken();
      if (token) {
        console.log('Fcm Token:', token);
        return token;
      } else {
        console.log('NO FCM Token Available');
        return '';
      }
    } else {
      console.log('permission denied');
      return '';
    }
  } catch (error) {
    console.log('Error initialize firebase messaging:', error);
    return '';
  }
};

export default initializeFirebaseMessaging