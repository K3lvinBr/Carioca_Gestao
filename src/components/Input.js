import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../styles/theme';

const Container = styled.View`
 flex-direction: row;
  align-items: center;
  width: 100%;
  height: ${hp('5%')}px;
  border-width: ${theme.size.borderWidth}px;
  border-color: ${theme.colors.darkGray};
  border-radius:  ${theme.size.borderRadius}px;
  padding: 0 ${hp('2%')}px;
  margin-bottom: ${theme.spacing.small}px;
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  height: 100%;
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.medium}px;
`;

const Input = ({
  placeholder,
  leftIconComponent,
  leftIcon,
  rightIcon,
  rightIconAction,
  secureTextEntry,
  type,
  style,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setIsPasswordVisible(!isPasswordVisible);
    } else if (rightIconAction) {
      rightIconAction();
    }
  };

  return (
    <Container style={{ borderColor: isFocused ? theme.colors.primary : theme.colors.darkGray, ...style }}>
      {leftIcon && (
        <leftIconComponent name={leftIcon} size={theme.size.iconMedium} color={theme.colors.primary} />
      )}
      <StyledTextInput
        placeholder={placeholder}
        keyboardType={type || 'default'}
        autoCapitalize="none"
        secureTextEntry={secureTextEntry ? !isPasswordVisible : false}
        placeholderTextColor={theme.colors.darkGray}
        selectionColor={theme.colors.primary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      {rightIcon || secureTextEntry && (
        <TouchableOpacity onPress={handleRightIconPress}>
          <Ionicons
            name={secureTextEntry ? (isPasswordVisible ? 'eye-outline' : 'eye-off-outline') : rightIcon}
            size={theme.size.iconMedium}
            color={theme.colors.darkGray}
          />
        </TouchableOpacity>
      )}
    </Container>
  );
};

export default Input;
