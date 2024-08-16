import React, { useContext, useState } from 'react';
import styled from 'styled-components/native';
import { Modal as RNModal, FlatList, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from './Button';
import OrderItem from './OrderItem';
import theme from '../styles/theme';
import { AppContext } from '../context/AppContext';
import Modal from './Modal';
import { addOrder } from '../config/firebaseData';
import LoadingModal from './LoadingModal';
import { generateId } from '../utils/generateId';

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: ${hp('40%')}px;
  height: ${hp('80%')}px;
  background-color: ${theme.colors.background};
  border-radius: ${theme.size.borderRadius}px;
  padding: ${theme.spacing.mediumLarge}px;
  align-items: center;
`;

const Text = styled.Text`
  font-size: ${theme.fontSize.medium}px;
  color: ${theme.colors.text};
  font-weight: bold;
  margin-bottom: ${theme.spacing.medium}px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
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

const ModalMenu = ({ products, total, modalVisible, setModalVisible }) => {
  const { orders, updateOrder } = useContext(AppContext);
  const [orderIdentifier, setOrderIdentifier] = useState(null);
  const [modalCreateVisible, setModalCreateVisible] = useState(false);
  const [modalVisibleFinalize, setModalVisibleFinalize] = useState(false);
  const [orderName, setOrderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const createOrder = async () => {
    try {
      setLoading(true);
      await addOrder({ name: orderName, total: 0, products: [], id: generateId() });
      setOrderName('');
      await updateOrder();
      setModalCreateVisible(false);
    } catch (error) {
      console.error('Erro ao criar a comanda:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleFinalizeAction = (actionValue) => {
    setAction(actionValue)
    setModalVisibleFinalize(true)
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
          <Text style={{ alignSelf: 'flex-start' }}>Selecione uma comanda ou finalize o pedido.</Text>

          {loading ? (
            <LoadingContainer>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </LoadingContainer>
          ) : (
            <FlatList
              data={orders}
              renderItem={({ item }) =>
                <OrderItem
                  simple
                  hideButton
                  orderIdentifier={orderIdentifier}
                  setOrderIdentifier={setOrderIdentifier}
                  name={item.name}
                  total={item.total}
                  products={item.products}
                  orderId={item.id}
                />}
              keyExtractor={(i, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1, }}
              style={{ width: '100%', }}
            />
          )}

          <Text style={{ marginTop: theme.spacing.small }}>Total: R$ {total}</Text>

          <ButtonsSections>
            <ButtonContainer>
              <Button
                title="Cancelar"
                onPress={() => handleCloseModal()}
                lightGray
              />
            </ButtonContainer>
            <ButtonContainer>
              <Button
                title="Criar Comanda"
                onPress={() => setModalCreateVisible(true)}
                lightGray
              />
            </ButtonContainer>
          </ButtonsSections>

          <Button
            title="Finalizar"
            onPress={() => handleFinalizeAction(1)}
          />

          <Button
            style={{ marginTop: theme.spacing.small }}
            title="Finalizar e Imprimir"
            onPress={() => handleFinalizeAction(2)}
          />
        </ModalContent>
      </ModalContainer>
      <Modal
        title="Digite o nome da nova comanda."
        buttonText="Criar"
        handleFunction={() => createOrder()}
        input
        orderName={orderName}
        setOrderName={setOrderName}
        modalVisible={modalCreateVisible}
        setModalVisible={setModalCreateVisible}
      />
      <LoadingModal products={products} action={action} orderIdentifier={orderIdentifier} handleCloseMenuModal={handleCloseModal} modalVisible={modalVisibleFinalize} setModalVisible={setModalVisibleFinalize} />
    </RNModal>
  );
};

export default ModalMenu;
