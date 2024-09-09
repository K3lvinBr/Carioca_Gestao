import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import theme from '../styles/theme';
import { ActivityIndicator, FlatList } from 'react-native';
import OrderItem from '../components/OrderItem';
import { AppContext } from '../context/AppContext';
import HistoricItem from '../components/HistoricItem';
import Divider from '../components/Divider';
import { formatDate } from '../utils/formatDate';

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

const Historic = () => {
  const { historic } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [historic]);

  const renderItem = ({ item, index }) => {
    const currentDate = new Date(item.createdAt);
    const previousItem = historic[index > 0 ? index - 1 : 0];
    const previousDate = new Date(previousItem.createdAt)

    const shouldRenderDivider = formatDate(currentDate) !== formatDate(previousDate)

    return (
      <>
        {shouldRenderDivider && (
          <Divider>{formatDate(currentDate)}</Divider>
        )}
        {item.products ? (
          <OrderItem
            simple
            noAction
            name={item.name}
            total={item.total}
            products={item.products}
          />
        ) : (
          <HistoricItem
            image={item.image}
            name={item.name}
            price={item.price}
            amount={item.amount}
          />
        )}
      </>
    );
  };

  return (
    <Container>
      <Title>Histórico</Title>
      {loading ? (
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContainer>
      ) : (
        <FlatList
          data={historic.slice().reverse()}
          keyExtractor={(i, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          numColumns={theme.isTablet ? 2 : 1}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <ListEmptyContainer>
              <Text>Histórico vazio!</Text>
            </ListEmptyContainer>
          }
        />
      )}
    </Container>
  );
};

export default Historic;
