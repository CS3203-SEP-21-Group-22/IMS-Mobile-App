import {
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Image,
  Button,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import WideButton from '@/components/WideButton';
import { CreateLab } from '@/interfaces/lab.interface';
import { axiosApi, initializeAxiosApi } from '@/utils/AxiosApi';
import { Alert } from 'react-native';

export default function AddLabScreen() {
  const [lab, setLab] = useState<CreateLab>({ labName: null, labCode: null });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<[string, string][]>([]);
  const handleButtonPress = async () => {
    try {
      setLoading(true);
      await initializeAxiosApi();
      const response = await axiosApi.post('/admin/labs', lab);
      if (response.status === 201) {
        Alert.alert('Success', 'Lab added successfully');
        router.push('/(admin)/(lab-management)/view-labs');
      } else Alert.alert('Error', 'Failed to add lab');
    } catch (err: any) {
      if (err.response.status === 400) {
        setErrors(Object.entries(err.response.data.errors));
      }
      Alert.alert('Error', 'Failed to add lab');
    } finally {
      setLoading(false);
    }
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setLab({ ...lab, imageURL: result.assets[0].uri });
    }
  };
  return (
    <BackgroundLayout>
      <MainHeader title='Lab Management' />
      <ContentContainer>
        <View style={styles.container}>
          <ContentContainerHeader title='Add New Lab' />
          <EditSingleItemBackground>
            <Text style={styles.title}>Lab Details</Text>
            <Text style={styles.text}>Lab Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder='Enter Lab Name'
              value={lab.labName ?? ''}
              onChangeText={(text) => setLab({ ...lab, labName: text })}
            />
            {errors
              .filter(([key, value]) => key === 'labName')
              .map(([key, value]) => (
                <Text key={key} style={styles.errorText}>
                  {value}
                </Text>
              ))}
            <Text style={styles.text}>Lab Code</Text>
            <TextInput
              style={styles.textInput}
              placeholder='Enter Lab Code'
              value={lab.labCode ?? ''}
              onChangeText={(text) => setLab({ ...lab, labCode: text })}
            />
            {errors
              .filter(([key, value]) => key === 'labCode')
              .map(([key, value]) => (
                <Text key={key} style={styles.errorText}>
                  {value}
                </Text>
              ))}
            <Image
              source={
                lab.imageURL
                  ? { uri: lab.imageURL }
                  : require('@/assets/images/labSample.png')
              }
              style={styles.image}
            />
            <Button title='Pick an Image' onPress={pickImage} />
            {errors
              .filter(([key, value]) => key === 'imageURL')
              .map(([key, value]) => (
                <Text key={key} style={styles.errorText}>
                  {value}
                </Text>
              ))}
            <View style={styles.separator} />
          </EditSingleItemBackground>
          {loading ? (
            <ActivityIndicator size='large' color='#ffffff' />
          ) : errors.length > 0 ? (
            <WideButton text='Retry' buttonClickHandler={handleButtonPress} />
          ) : (
            <WideButton text='Add Lab' buttonClickHandler={handleButtonPress} />
          )}
        </View>
      </ContentContainer>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '1%',
  },
  separator: {
    marginVertical: '1%',
    width: '80%',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '1%',
  },
  errorText: {
    color: 'red',
    marginTop: '1%',
    fontSize: 12,
  },
  textInput: {
    width: '80%',
    padding: '1%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 15,
  },
  image: {
    marginTop: '4%',
    marginBottom: '3%',
    width: 100,
    height: 100,
  },
});
