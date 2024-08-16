import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import theme from '../styles/theme';
import { AppContext } from '../context/AppContext';
import { formatPrice } from '../utils/formatPrice';

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.lightGray};
`;

const Header = styled.View`
  padding: ${theme.spacing.spacing}px;
  background-color: ${theme.colors.background};
`;

const HeaderContainer = styled.View`
 align-items: center;
 justify-content: space-around;
 flex-direction: row;
`;

const RevenueContainer = styled.View`
  align-items: center;
`;

const Title = styled.Text`
  font-size: ${theme.fontSize.title}px;  
  font-weight: bold;
  margin-bottom: ${theme.spacing.medium}px;
`

const Text = styled.Text`
  font-size: ${theme.fontSize.medium}px;
  color: ${theme.colors.text};
  font-weight: 600;
`;

const TextLarge = styled.Text`
  font-size: ${theme.fontSize.title}px;
  color: ${theme.colors.text};
`;


const calculateRevenue = (historic) => {
    let dailyRevenue = 0;
    let monthlyRevenue = 0;
    const currentDate = new Date();

    historic.forEach((item) => {
        const itemDate = new Date(item.createdAt);
        let amount = 0;

        if (item.total !== undefined) {
            amount = parseFloat(item.total);
        } else if (item.price !== undefined) {
            amount = item.price;
        }

        if (itemDate.toDateString() === currentDate.toDateString()) {
            dailyRevenue += amount;
        }

        if (
            itemDate.getMonth() === currentDate.getMonth() &&
            itemDate.getFullYear() === currentDate.getFullYear()
        ) {
            monthlyRevenue += amount;
        }
    });

    return { dailyRevenue, monthlyRevenue };
};

const Management = () => {
    const { historic } = useContext(AppContext);
    const [dailyRevenue, setDailyRevenue] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState(0);

    useEffect(() => {
        const { dailyRevenue, monthlyRevenue } = calculateRevenue(historic);

        setDailyRevenue(dailyRevenue);
        setMonthlyRevenue(monthlyRevenue);
    }, [historic]);

    return (
        <Container>
            <Header>
                <Title>Gestão</Title>
                <HeaderContainer>
                    <RevenueContainer>
                        <Text>Receita Diária</Text>
                        <TextLarge>R$ {formatPrice(dailyRevenue)}</TextLarge>
                    </RevenueContainer>
                    <RevenueContainer>
                        <Text>Receita Mensal</Text>
                        <TextLarge>R$ {formatPrice(monthlyRevenue)}</TextLarge>
                    </RevenueContainer>
                </HeaderContainer>
            </Header>
        </Container>
    );
};

export default Management;


