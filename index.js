import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import store from './src/Redux/Store';
import {Provider} from 'react-redux';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  if (type === EventType.PRESS && pressAction.id === 'Stop') {
    await notifee.cancelNotification(notification.id);
    console.log('Alarm Stopped');
  }
});
notifee.registerForegroundService(not => {
  return new Promise(() => {
    notifee.onForegroundEvent(async ({type}) => {
      if (type === EventType.ACTION_PRESS) {
        await notifee.stopForegroundService();
        console.log('Alarm Stopped');
      }
    });
  });
});
const AppWithProvider = () => {
  theme = {
    ...DefaultTheme,
    myOwnProperty: true,
    colors: {
      primary: 'black',
    },
  };

  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </PaperProvider>
  );
};

AppRegistry.registerComponent(appName, () => AppWithProvider);
