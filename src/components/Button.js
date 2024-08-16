import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../styles/theme';

const ButtonContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${props => {
    if (props.extraSmall) return theme.isTablet ? hp('3.8%') : hp('3.5%');
    if (props.small) return theme.isTablet ? hp('3.3%') : hp('4%');
    return hp('5%')
  }}px;
  background-color: ${props => {
    if (props.lightGray) return theme.colors.lightGray;
    if (props.gray) return theme.colors.gray;
    return theme.colors.primary;
  }};
  border-radius: ${props => props.borderSmallRadius ? theme.size.borderSmallRadius : theme.size.borderRadius}px;
  padding: ${props => props.paddingVertical || 0} 0px;
`;

const ButtonText = styled.Text`
  color: ${props => {
    if (props.lightGray) return theme.colors.darkText;
    if (props.gray) return theme.colors.text;
    return theme.colors.subText;
  }};
  font-size: ${props => props.extraSmall ? theme.fontSize.small : theme.fontSize.medium}px;
  font-weight: ${props => props.small ? 'normal' : 500};
  margin: 0 ${wp('2%')}px;
  text-align: center;
`;

const Button = ({
  title,
  gray,
  lightGray,
  small,
  extraSmall,
  borderSmallRadius,
  RightIconComponent,
  LeftIconComponent,
  leftIcon,
  rightIcon,
  iconSize,
  paddingVertical,
  onPress,
  ...rest
}) => {
  return (
    <ButtonContainer
      gray={gray}
      lightGray={lightGray}
      small={small}
      extraSmall={extraSmall}
      borderSmallRadius={borderSmallRadius}
      onPress={onPress}
      activeOpacity={0.7}
      paddingVertical={paddingVertical}
      {...rest}
    >
      {leftIcon && (
        <LeftIconComponent
          name={leftIcon}
          size={iconSize || theme.size.iconSmall}
          color={gray || lightGray ? theme.colors.text : theme.colors.subText}
        />
      )}
      <ButtonText extraSmall={extraSmall} small={small} gray={gray} lightGray={lightGray}>
        {title}
      </ButtonText>
      {rightIcon && (
        <RightIconComponent
          name={rightIcon}
          size={iconSize || theme.size.iconSmall}
          color={gray || lightGray ? theme.colors.text : theme.colors.subText}
        />
      )}
    </ButtonContainer>
  );
};

export default Button;
