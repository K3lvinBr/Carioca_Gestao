import React, { createContext, useEffect, useRef, useState } from 'react';
import { formatPrice } from '../utils/formatPrice';
import { getHistory, getMenu, getOrders } from '../config/firebaseData';
import { checkIfAdmin } from '../config/usersData'
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [menu, setMenu] = useState([])
  const [orders, setOrders] = useState([]);
  const [historic, setHistoric] = useState([]);
  const [menuItemsSelected, setMenuItemsSelected] = useState([]);
  const [printerConnected, setPrinterConnected] = useState(null);
  const [admin, setAdmin] = useState(false);
  const sheetModalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const menuList = await getMenu();
        setMenu(menuList);
        updateOrder();
        updateHistory();

      } catch (error) {
        console.error('Erro ao obter dados:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdmin = await checkIfAdmin(user.uid);
        console.log(isAdmin);
        
        if (isAdmin) {
          setAdmin(isAdmin);
          console.log('Usuário é administrador');
        }
      }
    });

    fetchData();
    return () => {
      unsubscribe();
    };
  }, []);

  const updateOrder = async () => {
    try {
      const ordersList = await getOrders();
      setOrders(ordersList);
    } catch (error) {
      console.error('Erro ao obter as comandas:', error);
    }
  }

  const updateHistory = async () => {
    try {
      const historicList = await getHistory();
      setHistoric(historicList);
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
    }
  }

  const addItemSelected = (newItem) => {
    setMenuItemsSelected((prevItems) => {
      const itemIndex = menuItemsSelected.findIndex(item => item.name === newItem.name);
      if (itemIndex !== -1) {
        return prevItems.map((item, index) =>
          index === itemIndex
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...newItem, amount: 1 }];
      }
    });
  };

  const removeItemSelected = (itemName) => {
    setMenuItemsSelected((prevItems) => {
      const itemIndex = prevItems.findIndex(item => item.name === itemName);
      if (itemIndex !== -1) {
        const updatedItems = prevItems.map((item, index) =>
          index === itemIndex
            ? { ...item, amount: item.amount - 1 }
            : item
        ).filter(item => item.amount > 0);
        return updatedItems;
      } else {
        return prevItems;
      }
    });
  };

  const getItemAmount = (itemName) => {
    const item = menuItemsSelected.find(item => item.name === itemName);
    return item ? item.amount : 0;
  };

  const getTotalAmount = () => {
    return menuItemsSelected.reduce((total, item) => total + item.amount, 0);
  };

  const getTotalPrice = () => {
    const total = menuItemsSelected.reduce((total, item) => total + (item.price * item.amount), 0);
    return formatPrice(total);
  };

  const clearAllItems = () => {
    setMenuItemsSelected([]);
  };

  return (
    <AppContext.Provider value={{
      menu,
      menuItemsSelected,
      orders,
      historic,
      sheetModalRef,
      admin,
      getItemAmount,
      getTotalAmount,
      getTotalPrice,
      updateOrder,
      updateHistory,
      addItemSelected,
      removeItemSelected,
      clearAllItems,
      printerConnected,
      setPrinterConnected,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
