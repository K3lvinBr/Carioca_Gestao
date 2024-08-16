import React, { useContext, useState } from 'react';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../styles/theme';
import Image from './Image';
import { AppContext } from '../context/AppContext';
import { formatPrice } from '../utils/formatPrice';

const Container = styled.View`
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: ${theme.spacing.small}px;
`;

const InfoContainer = styled.View`
  width: ${theme.isTablet ? wp('18%') : wp('40%')}px;
  flex-direction: row;
  align-items: center;
`;

const SubText = styled.Text`
  flex: 1;
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.small}px;
  margin-left: ${theme.isTablet ? theme.spacing.small : theme.spacing.medium}px;
  font-weight: 500;
`;

const MainText = styled.Text`
  color: ${theme.colors.text};
  margin: 0 ${theme.spacing.small}px;
  font-size: ${theme.fontSize.small}px;
  font-weight: bold;
`;

const AmountContainer = styled.View`
flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Button = styled.TouchableOpacity`
  height: ${theme.isTablet ? hp('2.5%') : hp('3.5%')}px;
  width:${theme.isTablet ? hp('2.5%') : hp('3.5%')}px;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.primary};
  border-radius: ${theme.size.borderSmallRadius}px;
`;

const ButtonText = styled.Text`
  color: ${theme.colors.subText};
  font-size: ${theme.fontSize.large}px;
`;

const DrawerItem = ({ image, name, price, amount, removeButtons }) => {
  const { sheetModalRef, addItemSelected, removeItemSelected, getTotalAmount } = useContext(AppContext);

  const handleAddItem = () => {
    addItemSelected({ image, name, price });
  };

  const handleRemoveItem = () => {
    if (getTotalAmount() === 1) {
      sheetModalRef.current?.close();
    }
    removeItemSelected(name);
  };

  const ButtonSquare = ({ text, onPress }) => (
    <Button activeOpacity={0.7} onPress={onPress}>
      <ButtonText>{text}</ButtonText>
    </Button>
  )

  return (
    <Container>
      <InfoContainer>
        <Image source={image} size="small" />
        <SubText numberOfLines={2}>{name}</SubText>
      </InfoContainer>
      <MainText numberOfLines={1}>
        {formatPrice(price)}
      </MainText>
      <AmountContainer>
        {!removeButtons &&
          <ButtonSquare text={'-'} onPress={handleRemoveItem} />
        }
        <MainText style={{
          marginLeft: theme.isTablet ?
            theme.spacing.small :
            theme.spacing.medium,
          marginRight: theme.isTablet ?
            theme.spacing.small :
            theme.spacing.medium
        }} numberOfLines={1}>
          {amount}
        </MainText>
        {!removeButtons &&
          <ButtonSquare text={'+'} onPress={handleAddItem} />
        }
      </AmountContainer>
    </Container>
  );
};

export default DrawerItem;
