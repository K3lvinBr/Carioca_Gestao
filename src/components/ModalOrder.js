import React, { useContext, useState } from 'react';
import styled from 'styled-components/native';
import { Modal as RNModal, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from './Button';
import DrawerItem from './DrawerItem';
import theme from '../styles/theme';
import { formatPrice } from '../utils/formatPrice';
import Modal from './Modal';
import { deleteOrder } from '../config/firebaseData';
import { AppContext } from '../context/AppContext';

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: ${hp('40%')}px;
  height: ${hp('70%')}px;
  background-color: ${theme.colors.background};
  border-radius: ${theme.size.borderRadius}px;
  padding: ${theme.spacing.mediumLarge}px;
  align-items: center;
`;

const Text = styled.Text`
  font-size: ${theme.fontSize.medium}px;
  color: ${theme.colors.text};
  font-weight: bold;
  margin-bottom: ${theme.spacing.large}px;
  margin-top: ${theme.spacing.small}px;
`;

const ButtonsSections = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: ${theme.spacing.medium}px;
`;

const ButtonContainer = styled.View`
  width: 48%;
`;

const ModalOrder = ({
  products,
  orderId,
  total,
  modalVisible,
  setModalVisible,
  noAction,
  finalizeOrder
}) => {
  const { updateOrder } = useContext(AppContext);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  const handleFinalizeOrder = () => {
    handleCloseModal();
    finalizeOrder()
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleDeleteModal = () => {
    setModalDeleteVisible(true);
  }

  const DeleteOrder = async () => {
    try {
      await deleteOrder(orderId);
      handleCloseModal();
      updateOrder();
    } catch (error) {
      console.error("Error ao deletar comanda: ", error);
    }
  }

  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent
      onRequestClose={handleCloseModal}
    >
      <ModalContainer>
        <ModalContent>
          <FlatList
            data={products}
            renderItem={({ item }) =>
              <DrawerItem
                image={item.image}
                name={item.name}
                price={item.price}
                amount={item.amount}
                removeButtons={true}
              />}
            keyExtractor={(i, index) => index.toString()}
            style={{ width: '100%' }}
          />

          <Text>Total: R$ {total}</Text>

          {!noAction ?
            <>
              <ButtonsSections>
                <ButtonContainer>
                  <Button
                    title="Voltar"
                    onPress={handleCloseModal}
                    lightGray
                  />
                </ButtonContainer>
                <ButtonContainer>
                  <Button
                    title="Deletar"
                    onPress={handleDeleteModal}
                    gray
                    lightGray
                  />
                </ButtonContainer>
              </ButtonsSections>
              <Button
                title="Finalizar Pedido"
                onPress={handleFinalizeOrder}
              />
            </>
            :
            <Button
              title="Voltar"
              onPress={handleCloseModal}
              lightGray
            />
          }
        </ModalContent>
      </ModalContainer>
      <Modal
        title="Deseja deletar esta comanda?"
        buttonText={"Deletar"}
        handleFunction={DeleteOrder}
        modalVisible={modalDeleteVisible}
        setModalVisible={setModalDeleteVisible} />
    </RNModal>
  );
};

export default ModalOrder;
