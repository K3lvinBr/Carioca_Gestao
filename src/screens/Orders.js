import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import theme from '../styles/theme';
import { ActivityIndicator, FlatList } from 'react-native';
import OrderItem from '../components/OrderItem';
import { AppContext } from '../context/AppContext';

const Container = styled.View`
  flex: 1;
  padding: 0 ${theme.spacing.spacing}px;
  padding-top: ${theme.spacing.spacing}px;
  background-color: ${theme.colors.lightGray};
`;

const Title = styled.Text`
  font-size: ${theme.fontSize.title}px;  
  font-weight: bold;
  margin-bottom: ${theme.spacing.medium}px;
`

const ListEmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  font-size: ${theme.fontSize.medium}px;
  color: ${theme.colors.text};
  font-weight: 500;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Orders = () => {
  const { orders } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [orders]);

  return (
    <Container>
      <Title>Comandas</Title>
      {loading ? (
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContainer>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(i, index) => index.toString()}
          renderItem={({ item }) =>
            <OrderItem name={item.name} total={item.total} products={item.products} orderId={item.id} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          numColumns={theme.isTablet ? 2 : 1}
          ListEmptyComponent={
            <ListEmptyContainer>
              <Text>Nenhuma comanda registrada!</Text>
            </ListEmptyContainer>
          }
        />)}
    </Container>
  );
};

export default Orders;
