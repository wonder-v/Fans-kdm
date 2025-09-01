import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Linking, Alert } from 'react-native';
import { Icon } from 'react-native-elements';

const TrakteerButton = ({ style, textStyle }) => {
  const handleTrakteerPress = async () => {
    try {
      const trakteerUrl = 'https://trakteer.id/anichinapk';
      const supported = await Linking.canOpenURL(trakteerUrl);
      
      if (supported) {
        await Linking.openURL(trakteerUrl);
      } else {
        Alert.alert(
          'Error',
          'Tidak dapat membuka link Trakteer. Silakan buka manual di browser.',
          [
            { text: 'OK' },
            { text: 'Buka Browser', onPress: () => Linking.openURL(trakteerUrl) }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat membuka Trakteer');
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={handleTrakteerPress}
      activeOpacity={0.8}
    >
      <Icon
        name="heart"
        type="feather"
        color="#FF6B6B"
        size={20}
        style={styles.icon}
      />
      <Text style={[styles.text, textStyle]}>
        Dukung Pengembang
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TrakteerButton;