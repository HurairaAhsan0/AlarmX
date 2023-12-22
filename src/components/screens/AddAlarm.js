import React from 'react';
import {View, Pressable, Text, StyleSheet, FlatList, Image} from 'react-native';
import AlarmList from '../feature/AlarmList';
import {IconButton} from 'react-native-paper';
import {useSelector} from 'react-redux';

const AddAlarm = props => {
  const val = useSelector(state => state.res);
  const keyExtractor = (i, index) => index.toString();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.Container}>
        <Text style={styles.heading}>ALARM</Text>
        <Pressable style={styles.buttonStyle}>
          <Image
            source={require('../../utils/imgs/alarm-clock.png')}
            style={styles.clock}
          />
        </Pressable>
      </View>
      <View style={styles.mainContainer}>
        <FlatList
          keyExtractor={keyExtractor}
          data={val}
          renderItem={item => <AlarmList Data={item} />}
        />
      </View>
      <View style={styles.buttonContainer}>
        <IconButton
          title="Add Alarm"
          icon="alarm-plus"
          size={50}
          onPress={() => props.navigation.navigate('SetAlarm')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  Container: {
    alignItems: 'center',
    borderRadius: 10,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 25,
    padding: 20,
    color: 'black',
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 40,
    padding: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: 'black',
    borderWidth: 0.1,
    backgroundColor: 'white',
  },
  clock: {height: 100, width: 80},
  noAlarm: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
export default AddAlarm;
