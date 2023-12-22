import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import AddAlarm from './src/components/screens/AddAlarm';
import SetAlarm from './src/components/screens/SetAlarm';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="AddAlarm"
            options={{headerShown: false}}
            component={AddAlarm}
          />
          <Stack.Screen
            name="SetAlarm"
            options={{headerShown: false}}
            component={SetAlarm}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});

export default App;
