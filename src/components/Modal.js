import React from 'react';
import styled from 'styled-components/native';
import { Modal as RNModal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from './Button';
import theme from '../styles/theme';
import Input from './Input';

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: ${hp('40%')}px;
  height: ${({ input }) => input ? hp('25%') : hp('20%')}px;
  background-color: ${theme.colors.background};
  border-radius: ${theme.size.borderRadius}px;
  padding: ${theme.spacing.mediumLarge}px;
  align-items: center;
  justify-content: space-between;
`;

const Text = styled.Text`
  font-size: ${theme.fontSize.large}px;
  color: ${theme.colors.text};
  font-weight: bold;
  margin-bottom: ${theme.spacing.medium}px;
`;

const ButtonsSections = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  `;

const ButtonContainer = styled.View`
  width: 48%;
`;

const Modal = ({
    title,
    input,
    handleFunction,
    buttonText,
    orderName,
    setOrderName,
    modalVisible,
    setModalVisible
}) => {

    const handleAction = () => {
        handleCloseModal()
        handleFunction();
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <RNModal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            statusBarTranslucent
            onRequestClose={handleCloseModal}
        >
            <ModalContainer>
                <ModalContent input={input}>

                    <Text>{title}</Text>

                    {input &&
                        <Input
                            placeholder="Comanda"
                            type={'text'}
                            value={orderName}
                            onChangeText={setOrderName}
                        />
                    }

                    <ButtonsSections>
                        <ButtonContainer>
                            <Button
                                title="Cancelar"
                                onPress={handleCloseModal}
                                lightGray
                            />
                        </ButtonContainer>
                        <ButtonContainer>
                            <Button
                                title={buttonText}
                                onPress={handleAction}
                            />
                        </ButtonContainer>
                    </ButtonsSections>
                </ModalContent>
            </ModalContainer>
        </RNModal>
    );
};

export default Modal;
