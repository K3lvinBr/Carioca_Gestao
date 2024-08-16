import React from 'react';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../styles/theme';
import Image from './Image';
import { formatPrice } from '../utils/formatPrice';

const Container = styled.View`
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: ${theme.spacing.small}px;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.spacing}px;
  border-radius: ${theme.size.borderRadius}px;
  border-color: ${theme.colors.lightGray};
  border-width: ${theme.size.borderWidth}px;
`;

const InfoContainer = styled.View`
  width: ${theme.isTablet ? wp('18%') : wp('40%')}px;
  flex-direction: row;
  align-items: center;
`;

const SubText = styled.Text`
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.small}px;
  margin-left: ${theme.isTablet ? theme.spacing.small : theme.spacing.medium}px;
`;

const MainText = styled.Text`
  color: ${theme.colors.text};
  margin: 0 ${theme.spacing.small}px;
  font-size: ${theme.fontSize.small}px;
  font-weight: 500;
`;

const AmountContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const HistoricItem = ({ image, name, price, amount }) => {
  return (
    <Container>
      <InfoContainer>
        <Image source={image} size="medium" />
        <SubText numberOfLines={2}>{name}</SubText>
      </InfoContainer>
      <AmountContainer>
        <SubText style={{
          marginLeft: theme.isTablet ? theme.spacing.small : theme.spacing.medium,
          marginRight: theme.isTablet ? theme.spacing.small : theme.spacing.medium
        }} numberOfLines={1}>
          {amount}
        </SubText>
      </AmountContainer>
      <MainText numberOfLines={1}>
        {formatPrice(price)}
      </MainText>
    </Container>
  );
};

export default HistoricItem;
