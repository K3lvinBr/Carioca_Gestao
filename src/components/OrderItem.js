import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../styles/theme';
import Button from './Button';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ModalOrder from './ModalOrder';
import LoadingModal from './LoadingModal';
import { formatPrice } from '../utils/formatPrice';

const Container = styled(TouchableOpacity)`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  margin-bottom: ${theme.spacing.small}px;
  border-radius: ${theme.size.borderRadius}px;
  border-color: ${theme.colors.lightGray};
  border-width: ${theme.size.borderWidth}px;
  background-color: ${({ pressed }) => (pressed ? theme.colors.lightGray : theme.colors.background)};
`;

const ItemBackground = styled.View`
  flex: 1;
  padding: ${theme.spacing.spacing}px;
`;

const ItemContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.small}px;
`;

const InfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${hp('0.5%')}px;
`;

const ListContainer = styled.View`
  padding: 0 ${theme.spacing.large}px;
`;

const TextLarge = styled.Text`
  max-width: ${hp('15%')}px;
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.large}px;
  margin-right: ${theme.spacing.medium}px;
`;

const TextList = styled.Text`
 color: ${theme.colors.text};
 font-size: ${({ simple }) => simple ? theme.fontSize.small : theme.fontSize.medium}px;
 margin-right: ${hp('5%')}px;
`

const Text = styled.Text`
 color: ${theme.colors.text};
 font-size: ${({ simple }) => simple ? theme.fontSize.small : theme.fontSize.medium}px;
`;

const TextSmall = styled.Text`
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.small}px;
  font-weight: 500;
`;

const ButtonContainer = styled.View`
  width: ${hp('9%')}px;
`;

const ButtonSection = styled(TouchableOpacity)`
  width: ${hp('9%')}px;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.gray};
`;

const OrderItem = ({ name, total, products, orderId, simple, hideButton, orderIdentifier, setOrderIdentifier, noAction }) => {
  const [modalOrderVisible, setModalOrderVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderFinalized, setOrderFinalized] = useState(false);
  const [pressed, setPressed] = useState(false);

  const orderData = JSON.stringify({ name, total, products, id: orderId });

  useEffect(() => {
    if (orderIdentifier === orderData) {
      setPressed(true);
    } else {
      setPressed(false);
    }
  }, [orderIdentifier]);

  const handlePress = () => {
    if (orderIdentifier === orderData) {
      setOrderIdentifier(null);
    } else {
      setOrderIdentifier(orderData);
    }
  };

  const handleFinalizeOrder = async () => {
    setModalVisible(true);
    setOrderFinalized(true);
  };

  return (
    <Container simple={simple} disabled={!hideButton} pressed={pressed} onPress={handlePress}>
      <ItemBackground>
        <ItemContainer>
          <InfoContainer>
            <TextLarge numberOfLines={1}>{name}</TextLarge>
            {!simple &&
              <ButtonContainer>
                <Button onPress={handleFinalizeOrder} extraSmall borderSmallRadius title="Finalizar" />
              </ButtonContainer>
            }
          </InfoContainer>
          <TextSmall>
            Total: {formatPrice(total)}
          </TextSmall>
        </ItemContainer>

        <ListContainer>
          {products[0] &&
            <InfoContainer>
              <TextList simple={simple}>
                {products[0].amount}
              </TextList>
              <Text simple={simple} numberOfLines={2}>
                {products[0].name}
              </Text>
            </InfoContainer>
          }
          {products[1] &&
            <InfoContainer>
              <TextList simple={simple}>
                {products[1].amount}
              </TextList>
              <Text simple={simple} numberOfLines={2}>
                {products[1].name}
              </Text>
            </InfoContainer>
          }
          {products[2] &&
            <InfoContainer>
              <TextList simple={simple}>
                {products[2].amount}
              </TextList>
              <Text simple={simple} numberOfLines={2}>
                {products[2].name}
              </Text>
            </InfoContainer>
          }
        </ListContainer>


      </ItemBackground>

      {!hideButton &&
        <ButtonSection onPress={() => setModalOrderVisible(true)} activeOpacity={0.7}>
          <Ionicons name="chevron-forward" size={theme.size.iconMedium} color="black" />
        </ButtonSection>
      }

      <ModalOrder finalizeOrder={handleFinalizeOrder} orderId={orderId} products={products} noAction={noAction} total={total} modalVisible={modalOrderVisible} setModalVisible={setModalOrderVisible} />
      <LoadingModal orderFinalized={orderFinalized} orderIdentifier={orderData} modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </Container>
  );
};

export default OrderItem;
