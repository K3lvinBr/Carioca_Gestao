import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../styles/theme';
import Image from './Image';
import { AppContext } from '../context/AppContext';
import { formatPrice } from '../utils/formatPrice';

const ButtonContainer = styled.TouchableOpacity`
  height: ${theme.isTablet ? hp('10%') : hp('24%')}px;
  width: ${theme.isTablet ? hp('22%') : wp('40%')}px;
  padding: ${hp('1%')}px;
  align-items: center;
  margin-top: ${theme.isTablet ? theme.spacing.small : theme.spacing.spacing}px;
  margin-bottom: ${theme.isTablet ? theme.spacing.spacing : 0}px;
  flex-direction: ${theme.isTablet ? 'row' : 'column'};
  border-radius: ${theme.size.borderRadius}px;
  background-color: ${props => (props.selected ? theme.colors.lightGray : 'transparent')};
`;

const TextContainer = styled.View`
  flex: ${theme.isTablet ? 1 : 'none'};
  padding: 0 ${theme.isTablet ? 0 : wp("4%")}px;
  margin-top: ${theme.isTablet ? 0 : theme.spacing.small}px;
  margin-left: ${theme.isTablet ? theme.spacing.medium : 0}px;
  align-items: ${theme.isTablet ? 'flex-start' : 'center'};
`;

const SubText = styled.Text`
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.medium}px;
  text-align: ${theme.isTablet ? 'left' : 'center'};
`;

const MainText = styled.Text`
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.medium}px;
  font-weight: bold;
  text-align: ${theme.isTablet ? 'left' : 'center'};
`;

const MenuItem = ({ image, name, price }) => {
  const { presentDrawerSheet, addItemSelected, getItemAmount } = useContext(AppContext);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (getItemAmount(name) === 0) {
      setSelected(false);
    } else {
      setSelected(true);
    }
  }, [getItemAmount(name)]);

  const handlePress = () => {
    addItemSelected({ image, name, price });

    if (!theme.isTablet) {
      presentDrawerSheet();
    }
  };

  return (
    <ButtonContainer
      onPress={handlePress}
      selected={selected}
      activeOpacity={0.7}>
      <Image source={image} size="large" />
      <TextContainer>
        <SubText numberOfLines={theme.isTablet ? 3 : 2}>{name}</SubText>
        <MainText numberOfLines={1}>
          R$ {formatPrice(price)}
          {selected && (
            <SubText style={{ color: theme.colors.darkGray, fontWeight: 'normal' }}> x {getItemAmount(name)}</SubText>
          )}
        </MainText>
      </TextContainer>
    </ButtonContainer>
  );
};

export default MenuItem;
