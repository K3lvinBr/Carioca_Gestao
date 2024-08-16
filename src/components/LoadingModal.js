import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Modal, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../styles/theme';
import Button from './Button';
import { BluetoothManager, BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
import { PermissionsAndroid } from 'react-native';
import { AppContext } from '../context/AppContext';
import { addProductToOrder, addToHistory, deleteOrder } from '../config/firebaseData';

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: ${hp('40%')}px;
  height: ${hp('30%')}px;
  background-color: ${theme.colors.background};
  border-radius: ${theme.size.borderRadius}px;
  padding: ${theme.spacing.mediumLarge}px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  font-size: ${theme.fontSize.large}px;
  color: ${theme.colors.text};
  font-weight: bold;
  margin-top: ${theme.spacing.mediumLarge}px;
  text-align: center;
`;

const ButtonsSections = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  margin-top: ${theme.spacing.medium}px;
`;

const ButtonContainer = styled.View`
  width: 48%;
`;

const LoadingModal = ({ modalVisible, action, setModalVisible, products, orderIdentifier, handleCloseMenuModal, orderFinalized }) => {
    const { clearAllItems, sheetModalRef, printerConnected, setPrinterConnected, updateHistory, updateOrder } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [printStatus, setPrintStatus] = useState('Buscando impressora...');
    const [errorMessage, setErrorMessage] = useState('Ocorreu algum erro. Tente novamente.');
    const iconSize = hp('10%');

    const checkAndRequestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                ]);

                const allPermissionsGranted = Object.values(granted).every(
                    status => status === PermissionsAndroid.RESULTS.GRANTED
                );

                if (!allPermissionsGranted) {
                    setError(true);
                    setErrorMessage('Permissões necessárias não foram concedidas.');
                    setLoading(false);
                }
            } catch (err) {
                setError(true);
                setErrorMessage('Erro ao solicitar permissões.');
                setLoading(false);
            }
        }
    };

    const checkBluetoothStatus = async () => {
        try {
            const isBluetoothEnabled = await BluetoothManager.isBluetoothEnabled();
            if (!isBluetoothEnabled) {
                setError(true);
                setErrorMessage('Bluetooth está desativado!');
                await enableBluetooth();
            } else {
                setErrorMessage('');
                scanDevices();
            }
        } catch (err) {
            setError(true);
            setErrorMessage('Erro ao verificar o status do Bluetooth.');
            setLoading(false);
        }
    };

    const enableBluetooth = async () => {
        try {
            if (!isEnabled) {
                await BluetoothManager.enableBluetooth();
                setIsEnabled(true);
            }
        } catch (err) {
            setError(true);
            setErrorMessage('Ative o Bluetooth para continuar.');
            setLoading(false);
        }
    };

    const scanDevices = async () => {
        if (printerConnected) {
            setPrintStatus('Imprimindo...');
            printProducts();
            return;
        }

        try {
            setPrintStatus('Buscando impressora...');
            const result = await BluetoothManager.scanDevices();
            const parsedResult = JSON.parse(result);
            const pairedDevices = parsedResult.paired || [];
            const foundDevices = parsedResult.found || [];
            const allDevices = [...pairedDevices, ...foundDevices];
            const printerDevices = allDevices.filter(
                (device) => device.name && device.name.toUpperCase().includes('MTP')
            );

            if (printerDevices.length > 0) {
                connectToDevice(printerDevices[0].address);
            } else {
                setError(true);
                setErrorMessage('Impressora não encontrada.');
                setLoading(false);
            }
        } catch (err) {
            setError(true);
            setErrorMessage('Erro ao procurar impressora. Verifique o Bluetooth!');
            setLoading(false);
        }
    };

    const connectToDevice = async (address) => {
        try {
            setPrintStatus('Conectando com impressora...');
            await BluetoothManager.connect(address);
            setPrinterConnected(address);
            printProducts();
        } catch (err) {
            setError(true);
            setErrorMessage('Erro ao conectar com a impressora.');
            setLoading(false);
        }
    };

    const printProducts = async () => {
        try {
            setPrintStatus('Imprimindo...');
            await BluetoothEscposPrinter.setBlob(3);
            for (const product of products) {
                const textToPrint = `${product.name} x ${product.amount}\n`;
                await BluetoothEscposPrinter.printText(textToPrint, {});
            }
            await BluetoothEscposPrinter.printText('\x1B\x64\x06', {});
            handleRegisterOrder();
        } catch (err) {
            setError(true);
            setErrorMessage('Erro ao Imprimir.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (modalVisible && products && products.length > 0) {
            setLoading(true);
            if (action === 2) {
                checkAndRequestPermissions().then(() => {
                    checkBluetoothStatus();
                });
            } else if (action === 1) {
                handleRegisterOrder();
            }
        }
    }, [modalVisible]);

    useEffect(() => {
        let timer;
        if (!loading && !error && modalVisible) {
            timer = setTimeout(() => {
                handleCloseModal()
                if (products && products.length > 0) {
                    clearAllItems();
                    handleCloseMenuModal();
                    sheetModalRef.current?.close();
                }
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [loading, error, modalVisible]);

    useEffect(() => {
        if (orderFinalized) {
            setLoading(true);
            setPrintStatus('Finalizando a comanda...');
            handleFinalizeOrder();
        }

    }, [orderFinalized]);

    const handleFinalizeOrder = async () => {
        try {
            const orderData = JSON.parse(orderIdentifier);
            await deleteOrder(orderData.id);
            setLoading(false);
            await updateOrder()
            await addToHistory({
                ...orderData,
                createdAt: new Date().toISOString()
            });
            await updateHistory()
        } catch (error) {
            setError(true);
            setErrorMessage('Erro ao finalizar comanda.');
        }
    };

    const handleRegisterOrder = async () => {
        try {
            if (orderIdentifier) {
                const orderData = JSON.parse(orderIdentifier);
                await addProductToOrder(orderData.id, products);
                await updateOrder()
            } else {
                await addToHistory(
                    products.map(product => ({
                        ...product,
                        createdAt: new Date().toISOString()
                    }))
                );
            }
            await updateHistory()
            setLoading(false);
        } catch (error) {
            setError(true);
            setErrorMessage('Erro ao registrar o pedido.');
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setError(false);
        setLoading(false);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            statusBarTranslucent
            onRequestClose={handleCloseModal}
        >
            <ModalContainer>
                <ModalContent>
                    {loading ? (
                        <ActivityIndicator size={iconSize} color={theme.colors.primary} />
                    ) : error ? (
                        <Ionicons name="close-circle" size={iconSize} color={theme.colors.errorText} />
                    ) : (
                        <Ionicons name="checkmark-circle" size={iconSize} color={theme.colors.success} />
                    )}
                    <Text>
                        {loading
                            ? printStatus
                            : error
                                ? errorMessage
                                : 'Produto Cadastrado!'
                        }
                    </Text>

                    {error && (
                        <ButtonsSections>
                            <ButtonContainer>
                                <Button title="Voltar" onPress={handleCloseModal} gray />
                            </ButtonContainer>
                            <ButtonContainer>
                                <Button
                                    title="Tentar Novamente"
                                    onPress={() => {
                                        setError(false);
                                        setLoading(true);
                                        scanDevices();
                                    }}
                                    gray
                                />
                            </ButtonContainer>
                        </ButtonsSections>
                    )}
                </ModalContent>
            </ModalContainer>
        </Modal>
    );
};

export default LoadingModal;
