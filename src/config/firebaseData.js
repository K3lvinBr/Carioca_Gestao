import { formatPrice } from '../utils/formatPrice';
import { db } from './firebase';
import { collection, doc, deleteDoc, getDocs, query, orderBy, addDoc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const getMenu = async () => {
    try {
        const categories = ['pasteis', 'lanches', 'bebidas', 'doces'];
        const menuItems = {};

        for (const category of categories) {
            const categoryRef = collection(db, 'data', 'cardapio', category);
            const querySnapshot = await getDocs(categoryRef);
            menuItems[category] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        return menuItems;
    } catch (error) {
        console.error('Erro ao obter itens do cardápio:', error);
    }
};

const getOrders = async () => {
    try {
        const ordersRef = doc(db, 'data', 'pedidos');
        const ordersDoc = await getDoc(ordersRef);
        const orders = ordersDoc.data().comandas || [];

        return orders;
    } catch (error) {
        console.error('Erro ao obter itens das comandas:', error);
    }
};

const getHistory = async () => {
    try {
        const historyRef = doc(db, 'data', 'pedidos');
        const historyDoc = await getDoc(historyRef);
        const history = historyDoc.data().historico || [];

        return history;
    } catch (error) {
        console.error('Erro ao obter histórico de pedidos:', error);
    }
};

const addOrder = async (orderData) => {
    try {
        const updatedOrderData = {
            ...orderData,
            products: orderData.products.map(product => ({
                ...product,
                image: product.image || ''
            }))
        };
        const ordersRef = doc(db, 'data', 'pedidos');
        const ordersDoc = await getDoc(ordersRef);
        await updateDoc(ordersRef, {
            comandas: [...ordersDoc.data().comandas, updatedOrderData]
        });

    } catch (error) {
        console.error('Erro ao adicionar comanda:', error);
    }
};

const addProductToOrder = async (orderId, products) => {
    try {
        const ordersRef = doc(db, 'data', 'pedidos');
        const ordersDoc = await getDoc(ordersRef);

        const currentComandas = ordersDoc.data().comandas;

        const updatedComandas = currentComandas.map(order => {
            if (order.id === orderId) {
                const updatedProducts = products.reduce((acc, newProduct) => {
                    const existingProductIndex = acc.findIndex(item => item.name === newProduct.name);
                    if (existingProductIndex !== -1) {
                        acc[existingProductIndex].amount += newProduct.amount;
                    } else {
                        acc.push({
                            ...newProduct,
                            image: newProduct.image || '',
                        });
                    }
                    return acc;
                }, [...order.products]);

                const updatedTotal = updatedProducts.reduce((total, product) => {
                    return total + (product.price * product.amount);
                }, 0);

                return {
                    ...order,
                    products: updatedProducts,
                    total: updatedTotal,
                };
            }
            return order;
        });

        await updateDoc(ordersRef, { comandas: updatedComandas });

    } catch (error) {
        console.error('Erro ao adicionar produtos à comanda:', error);
    }
};



const addToHistory = async (historyData) => {
    try {
        let updatedHistoryData;

        if (Array.isArray(historyData)) {

            updatedHistoryData = historyData.map(product => ({
                ...product,
                image: product.image || ''
            }));

        } else if (historyData.products) {

            updatedHistoryData = {
                ...historyData,
                products: historyData.products.map(product => ({
                    ...product,
                    image: product.image || ''
                }))
            };

        } else {
            throw new Error('Formato de historyData não reconhecido');
        }

        const historyRef = doc(db, 'data', 'pedidos');
        const historyDoc = await getDoc(historyRef);
        const existingHistory = historyDoc.data()?.historico || [];

        if (Array.isArray(historyData)) {

            await updateDoc(historyRef, {
                historico: [...existingHistory, ...updatedHistoryData]
            });
        } else {

            await updateDoc(historyRef, {
                historico: [...existingHistory, updatedHistoryData]
            });
        }

    } catch (error) {
        console.error('Erro ao adicionar histórico:', error);
    }
};

const deleteOrder = async (orderId) => {
    try {
        const ordersRef = doc(db, 'data', 'pedidos');
        const ordersDoc = await getDoc(ordersRef);

        const currentComandas = ordersDoc.data().comandas;

        const updatedComandas = currentComandas.filter(order => order.id !== orderId);

        await updateDoc(ordersRef, { comandas: updatedComandas });

    } catch (error) {
        console.error('Erro ao remover comanda:', error);
    }
};

const addToFirestore = async () => {
    const pasteis = [
        { name: "Caldo de Cana Pequeno", price: 6.00 },
        { name: "Caldo de Cana Médio", price: 7.00 },
        { name: "Caldo de Cana Grande", price: 8.00 },
        { name: "Refrigerante 600ml", price: 9.00 },
        { name: "Refrigerante Lata", price: 6.00 }
    ];


    const removeSlashes = (name) => {
        return name.replace(/\//g, ''); // Substitui todas as barras por hífens
    };

    try {
        for (let item of pasteis) {
            const documentId = removeSlashes(item.name);
            // Criando um documento com o ID modificado
            await setDoc(doc(db, "data/cardapio/bebidas", documentId), {
                name: item.name, // Nome original, com barra
                price: item.price,
                image: '' // Adicione o link da imagem se houver
            });
            console.log(`Item ${item.name} adicionado com sucesso!`);
        }
    } catch (error) {
        console.error("Erro ao adicionar item: ", error);
    }
};

export {
    addToFirestore,
    getMenu,
    getOrders,
    getHistory,
    addOrder,
    addProductToOrder,
    addToHistory,
    deleteOrder
};
