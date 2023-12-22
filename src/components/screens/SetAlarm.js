import React, {useState} from 'react';
import {
  View,
  Alert,
  Platform,
  StyleSheet,
  PermissionsAndroid,
  Linking,
  Pressable,
} from 'react-native';
import {Card, Text as TextPaper, IconButton, List} from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
  AuthorizationStatus,
} from '@notifee/react-native';
import {useDispatch} from 'react-redux';
import {AddValue} from '../../Redux/AlarmSlice';
import DocumentPicker from 'react-native-document-picker';

const SetAlarm = props => {
  const time = Moment(new Date()).format('hh:mm A');
  const date = Moment(new Date()).format('DD/MM/YYYY');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [PieckedDate, setPieckedDate] = useState('');
  const [PieckedTime, setPieckedTime] = useState('');
  const [TTime, setTTime] = useState('');
  const [id, setId] = useState(JSON.stringify(Math.random() * 100));
  const [noti, setnoti] = useState('alarm1');
  const [SysAudio, setSysAaudio] = useState('');

  const dispatch = useDispatch();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = data => {
    var currentTime = Date.now();
    if (data.getTime() < currentTime) {
      Alert.alert('Please choose future time');
      hideDatePicker();
      return;
    }
    if (data.getTime() > currentTime) {
      const time = Moment(data).format('hh:mm A');
      const date = Moment(data).format('DD/MM/YYYY');
      setPieckedDate(date);
      setPieckedTime(time);
      setTTime(data.getTime());
      setId(JSON.stringify(Math.random() * 100));
      hideDatePicker();
    }
  };
  //
  //
  const storageAudio = async () => {
    const permissionStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
    );
    if (permissionStatus === PermissionsAndroid.RESULTS.DENIED) {
      Alert.alert('denied', 'Open Settings to allow Permission manually', [
        {
          text: 'settings',
          onPress: () => Linking.openSettings(),
        },
      ]);
    }

    const result = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.audio],
    });

    if (result.name === null) {
      Alert.alert('Not Audio', 'Please Select Audio File', [
        {
          text: 'ok',
        },
      ]);
      return;
    }
    setSysAaudio(result);
  };

  //
  //
  async function Notification() {
    // Request permissions
    if (Platform.OS === 'ios') {
      const settings = await notifee.requestPermission();
      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        Alert.log('Permission settings:', settings);
      } else {
        Alert.log('Open settings and Authorize permissions');
      }
    }
    if (Platform.OS === 'android') {
      await notifee.openAlarmPermissionSettings();
    }

    // Creating channel for Android
    const channelId = await notifee.createChannel({
      id: id,
      name: id,
      sound: SysAudio ? SysAudio.uri : noti,
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      bypassDnd: true,
    });
    // Trigger based on time
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: JSON.parse(TTime),
      alarmManager: {
        allowWhileIdle: true,
      },
    };
    // Display notification
    await notifee.createTriggerNotification(
      {
        title: PieckedTime,
        body: PieckedDate,
        android: {
          channelId,
          loopSound: true,
          autoCancel: false,
          showWhenLocked: true,
          turnScreenOn: true,
          asForegroundService: true,
          actions: [
            {
              title: 'Stop',
              pressAction: {
                id: 'Stop',
                launchActivity: 'default',
              },
            },
          ],
        },
        ios: {
          categoryId: 'Stop',
          sound: noti ? `media/${noti}.wav` : 'default',
          foregroundPresentationOptions: {
            sound: true,
            alert: true,
          },
          asForegroundService: true,
          actions: [
            {
              id: 'Stop',
              title: 'Stop',
              pressAction: {
                id: 'Stop',
              },
            },
          ],
        },
      },
      trigger,
    );
  }
  const confirmAlarm = () => {
    const data = {
      value: {id: id, date: PieckedDate, time: PieckedTime},
    };
    if (PieckedTime) {
      dispatch(AddValue(data));
      Notification();
      console.log('alarm is set');
      props.navigation.navigate('AddAlarm');
      return;
    } else {
      Alert.alert('Please choose future time');
    }
  };
  return (
    <>
      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="datetime"
        display="spinner"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <View style={styles.mainContainer}>
        <View style={styles.headView}>
          <IconButton
            title="cancel"
            icon="close"
            size={30}
            onPress={() => {
              props.navigation.navigate('AddAlarm');
            }}
          />
          <IconButton
            title="confirm"
            icon="check"
            size={30}
            onPress={confirmAlarm}
          />
        </View>
        <Pressable onPress={showDatePicker}>
          <Card style={styles.CardView}>
            <Card.Content style={styles.CardContent}>
              <View style={styles.mainContainer}>
                <TextPaper variant="titleLarge" style={styles.CardText}>
                  {!PieckedTime && time ? time : PieckedTime}
                </TextPaper>
                <TextPaper variant="bodySmall" style={styles.CardText}>
                  {!PieckedDate && date ? date : PieckedDate}
                </TextPaper>
              </View>
              <IconButton
                title="Select date and time"
                icon="calendar-clock"
                mode="contained"
              />
            </Card.Content>
          </Card>
        </Pressable>
        <Pressable onPress={storageAudio}>
          <Card style={styles.CardView}>
            <Card.Content style={styles.CardContent}>
              <View style={styles.mainContainer}>
                <TextPaper style={styles.CardText} variant="bodySmall">
                  Selected Sound:
                </TextPaper>
                <TextPaper variant="titleMedium" style={styles.CardText}>
                  {SysAudio ? SysAudio.name : noti}
                </TextPaper>
              </View>
              <IconButton title="Storage" icon="file-music" />
            </Card.Content>
          </Card>
        </Pressable>

        <View style={styles.mainContainer}>
          <List.Accordion
            title="Sounds"
            left={props => <List.Icon {...props} icon="alarm-note" />}
            style={styles.List}>
            <List.Item
              title="Sound 1"
              onPress={() => {
                setSysAaudio('');
                setnoti('alarm');
              }}
              style={styles.ListItem}
            />
            <List.Item
              title="Sound 2"
              onPress={() => {
                setSysAaudio('');
                setnoti('alarm1');
              }}
              style={styles.ListItem}
            />
            <List.Item
              title="Sound 3"
              onPress={() => {
                setSysAaudio('');
                setnoti('alarm2');
              }}
              style={styles.ListItem}
            />
            <List.Item
              title="Sound 4"
              onPress={() => {
                setSysAaudio('');
                setnoti('alarm3');
              }}
              style={styles.ListItem}
            />
            <List.Item
              title="Sound 5"
              onPress={() => {
                setSysAaudio('');
                setnoti('alarm4');
              }}
              style={styles.ListItem}
            />
            <List.Item
              title="Sound 6"
              onPress={() => {
                setSysAaudio('');
                setnoti('alarm5');
              }}
              style={styles.ListItem}
            />
          </List.Accordion>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headView: {
    flex: 0.08,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  CardView: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginTop: 8,
  },
  CardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  CardText: {flex: 1, color: 'black'},
  List: {
    backgroundColor: 'white',
    marginTop: 8,
    borderRadius: 3,
    borderColor: 'black',
    borderWidth: 0.1,
  },
  ListItem: {
    borderRadius: 3,
    borderColor: 'black',
    borderWidth: 0.1,
    color: 'black',
  },
});
export default SetAlarm;
