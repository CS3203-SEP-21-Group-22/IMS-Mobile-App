import {
  StyleSheet,
  Pressable,
  TextInput,
  ImageBackground,
  Image,
  Button,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link, router, useLocalSearchParams } from 'expo-router';
import BackgroundLayout from '@/components/BackgroundLayout';
import ContentContainer from '@/components/ContentContainer';
import MainHeader from '@/components/MainHeader';
import ContentContainerHeader from '@/components/ContentContainerHeader';
import EditSingleItemBackground from '@/components/EditSingleItemBackground';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import WideButton from '@/components/WideButton';

interface Lab {
  name: string | null;
  code: string | null;
  imageURL?: string | null;
}

export default function AddLabScreen() {
  const [lab, setLab] = useState<Lab>({ name: null, code: null });
  const handleButtonPress = () => {
    router.back();
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
              value={lab.name ?? ''}
              onChangeText={(text) => setLab({ ...lab, name: text })}
            />
            <Text style={styles.text}>Lab Code</Text>
            <TextInput
              style={styles.textInput}
              placeholder='Enter Lab Code'
              value={lab.code ?? ''}
              onChangeText={(text) => setLab({ ...lab, code: text })}
            />
            <Image
              source={
                lab.imageURL
                  ? { uri: lab.imageURL }
                  : require('@/assets/images/labSample.png')
              }
              style={styles.image}
            />
            <Button title='Pick an Image' onPress={pickImage} />
            <View style={styles.separator} />
          </EditSingleItemBackground>
          <WideButton text='Add Lab' buttonClickHandler={handleButtonPress} />
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
