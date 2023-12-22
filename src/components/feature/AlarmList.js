import {Card, Text as TextPaper} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {RemoveValue} from '../../Redux/AlarmSlice';
import {useDispatch} from 'react-redux';
import notifee from '@notifee/react-native';

const AlarmList = ({Data = {}}) => {
  const dispatch = useDispatch();
  const {id, date, time} = Data.item.value;

  return (
    <View style={styles.Container}>
      <Card style={styles.Card}>
        <Card.Content style={styles.CardContent}>
          <View>
            <TextPaper variant="titleLarge" style={styles.cardText}>
              {time}
            </TextPaper>
            <TextPaper variant="bodySmall" style={styles.cardText}>
              {date}
            </TextPaper>
          </View>
          <IconButton
            title="remove Alarm"
            icon="bell-remove"
            size={30}
            onPress={() => {
              dispatch(RemoveValue(id));
              notifee.cancelTriggerNotification(id);
              notifee.deleteChannel(id);
              console.log('alarm deleted ');
            }}
          />
        </Card.Content>
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  Container: {padding: 4},
  Card: {backgroundColor: 'white'},
  CardContent: {flexDirection: 'row', justifyContent: 'space-between'},
  cardText: {color: 'black'},
});
export default AlarmList;
