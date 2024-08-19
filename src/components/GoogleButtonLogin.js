import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../styles/theme';

const GoogleButtonContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${hp('5%')}px;
  background-color: white;
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.size.borderRadius}px;
`;

const GoogleButtonText = styled(Text)`
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.medium}px;
  font-weight: 500;
  margin-left: ${wp('2%')}px;
`;

const GoogleButtonLogin = ({ title, onPress, loading, ...rest }) => {
  return (
    <GoogleButtonContainer onPress={onPress} activeOpacity={0.7} {...rest}>
      {loading
        ?
        <ActivityIndicator size={theme.size.iconMedium} color={theme.colors.primary} />
        :
        <Image
          source={require('../../assets/icon_google.png')}
          style={{ width: theme.size.iconMedium, height: theme.size.iconMedium }}
        />}
      <GoogleButtonText>{title}</GoogleButtonText>
    </GoogleButtonContainer>
  );
};

export default GoogleButtonLogin;
