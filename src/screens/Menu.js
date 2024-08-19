import React, { useContext } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import styled from 'styled-components/native';
import theme from '../styles/theme';
import { Pasteis, Lanches, Doces, Bebidas } from './Products';
import Image from '../components/Image';
import { AppContext } from '../context/AppContext';
import DrawerSheet from '../components/DrawerSheet';

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  padding-left: ${theme.isTablet ? theme.spacing.spacing : 0}px;
  background-color: ${theme.colors.background};
`;

const TabletMenu = styled.View`
  width: 30%;
  height: 100%;
  background-color: ${theme.colors.lightGray};
`;

const TabLabelContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TabLabelText = styled.Text`
  color: ${({ color }) => color};
  font-size: ${theme.fontSize.medium}px;
  margin-left: ${theme.spacing.small}px;
`;

const TabIcon = ({ text, imageSource }) => (
  <TabLabelContainer>
      <Image source={imageSource} />
    <TabLabelText>
      {text}
    </TabLabelText>
  </TabLabelContainer>
);

const Menu = () => {
  const { sheetModalRef } = useContext(AppContext);
  const Tab = createMaterialTopTabNavigator();

  return (
    <Container>
      <Tab.Navigator
        initialRouteName="Pasteis"
        screenOptions={{
          tabBarScrollEnabled: true,
          swipeEnabled: false,
          tabBarItemStyle: {
            width: hp("16%"),
            paddingLeft: theme.isTablet ? 0 : "none",
            paddingVertical: hp("2%")
          },
        tabBarStyle: {
          marginLeft: theme.isTablet ? wp("-1.5%") : "none",
        },
          tabBarIndicatorStyle: { backgroundColor: theme.colors.primary, height: 3, },
        }}
      >
        <Tab.Screen
          name="Pasteis"
          component={Pasteis}
          options={{
            tabBarLabel: () => (
              <TabIcon
                text="Pasteis"
                imageSource={require("../../assets/images/pastel.png")}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Lanches"
          component={Lanches}
          options={{
            tabBarLabel: () => (
              <TabIcon
                text="Lanches"
                imageSource={require("../../assets/images/lanche.png")}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Bebidas"
          component={Bebidas}
          options={{
            tabBarLabel: () => (
              <TabIcon
                text="Bebidas"
                imageSource={require("../../assets/images/bebidas.png")} />
            ),
          }}
        />
        <Tab.Screen
          name="Doces"
          component={Doces}
          options={{
            tabBarLabel: () => (
              <TabIcon
                text="Doces"
                imageSource={require("../../assets/images/doce.png")}
              />
            ),
          }}
        />
      </Tab.Navigator>
      {!theme.isTablet &&
        <DrawerSheet ref={sheetModalRef} />
      }
      {theme.isTablet &&
        <TabletMenu>
        </TabletMenu>
      }
    </Container>
  );
};

export default Menu;
