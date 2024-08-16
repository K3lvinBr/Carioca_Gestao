import React, { forwardRef, useCallback, useContext, useMemo, useState } from 'react';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from './Button';
import styled from 'styled-components/native';
import Divider from './Divider';
import theme from '../styles/theme';
import { AppContext } from '../context/AppContext';
import DrawerItem from './DrawerItem';
import ModalMenu from './ModalMenu';
import LoadingModal from './LoadingModal';

const Container = styled.View`
  flex: 1;
  padding: 0 ${theme.spacing.spacing}px;
`;

const Header = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const TextContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const MainText = styled.Text`
  font-size: ${theme.fontSize.large}px;
  color: ${theme.colors.text};
  font-weight: bold;
`;

const SubText = styled.Text`
  font-size: ${theme.fontSize.medium}px;
  color: ${theme.colors.darkGray};
  font-weight: normal;
`;

const ButtonContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const DrawerSheet = forwardRef((props, ref) => {
  const { menuItemsSelected, getTotalAmount, getTotalPrice, clearAllItems } = useContext(AppContext);
  const snapPoints = useMemo(() => ['10%', '50%'], []);

  const [modalMenuVisible, setModalMenuVisible] = useState(false);
  // const [modalVisible, setModalVisible] = useState(false);

  const openMenuModal = () => {
    setModalMenuVisible(true)
  }

  // const openModal = () => {
  //   setModalVisible(true)
  //   setModalMenuVisible(false)
  // }

  const cancelSelection = () => {
    clearAllItems()
    ref.current?.close();
  }

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backgroundStyle={{
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
      }}
      style={{
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
      }}
    >
      <Container>
        <Header>
          <TextContainer>
            <SubText>Total de produtos</SubText>
            <MainText>R$ {getTotalPrice()}
              <SubText> / {getTotalAmount()} {getTotalAmount() > 1 ? 'itens' : 'item'}</SubText>
            </MainText>
          </TextContainer>
          <ButtonContainer>
            <Button title='Pronto' onPress={() => openMenuModal()} />
          </ButtonContainer>
        </Header>
        <Divider margin={0} />
        <BottomSheetFlatList
          data={menuItemsSelected}
          keyExtractor={(i, index) => index.toString()}
          style={{ borderRadius: theme.size.borderRadius }}
          renderItem={({ item }) =>
            <DrawerItem image={item.image} name={item.name} price={item.price} amount={item.amount} />
          }
          showsVerticalScrollIndicator={false}
        />
        <Divider />
        <Button style={{ marginBottom: hp('2%') }} gray title='Cancelar' onPress={() => cancelSelection()} />
      </Container>

      <ModalMenu products={menuItemsSelected} total={getTotalPrice()} modalVisible={modalMenuVisible} setModalVisible={setModalMenuVisible} />
      {/* <LoadingModal products={menuItemsSelected} modalVisible={modalVisible} setModalVisible={setModalVisible} /> */}
    </BottomSheetModal>
  );
});

export default DrawerSheet;
