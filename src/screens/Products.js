import React, { useContext, useState } from 'react';
import styled from 'styled-components/native';
import theme from '../styles/theme';
import DrawerSheet from '../components/DrawerSheet';
import MenuItem from '../components/MenuItem';
import { AppContext } from '../context/AppContext';
import { FlatList, ScrollView, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Button from '../components/Button';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
  padding-right: ${theme.spacing.spacing}px;
  padding-left: ${theme.isTablet ? 0 : theme.spacing.spacing}px;
`;

const ContainerPasteis = styled.SafeAreaView`
  flex: 1;
  flex-direction: column;
  background-color: ${theme.colors.background};
`;

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

const Products = ({ category, filter }) => {
  const { menu, sheetModalRef } = useContext(AppContext);
  const items = menu[category] || [];

  const filteredItems = filter ? items.filter(item => item.id === filter) : items;

  const data =
    filteredItems.length === 0
      ? []
      : [
        ...filteredItems,
        { invisible: true },
        { invisible: true },
        { invisible: true },
        { invisible: true },
      ];

  return (
    <Container>
      <FlatList
        data={data}
        key={Math.random().toString()}
        renderItem={({ item }) => {
          if (item.invisible) {
            return <View style={{ width: theme.isTablet ? hp('22%') : wp('40%') }} />;
          }
          return <MenuItem
            price={item.price}
            name={item.name}
            image={item.image}
          />
        }}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ flexWrap: 'wrap', justifyContent: 'space-around' }}
        numColumns={data.length > 0 ? data.length : 2}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <ListEmptyContainer>
            <Text>Nenhum produto encontrado!</Text>
          </ListEmptyContainer>
        }
      />
      {!theme.isTablet &&
        <DrawerSheet ref={sheetModalRef} />
      }
    </Container>
  )
}

const Pasteis = () => {
  const [filter, setFilter] = useState(null);

  const FilterButton = ({ title, IconComponent, iconName, iconSize, filterValue }) => {
    const handlePress = () => {

      setFilter(isSelected ? null : filterValue);
    };

    const isSelected = filter === filterValue;
    return (<View style={{ width: theme.isTablet ? wp('20%') : wp('30%'), marginRight: theme.spacing.small }}>
      <Button
        LeftIconComponent={IconComponent}
        leftIcon={iconName}
        iconSize={iconSize}
        gray={isSelected}
        lightGray={!isSelected}
        small
        title={title}
        onPress={handlePress}
      />
    </View>
    )
  }

  return (
    <ContainerPasteis>
      <View style={{ paddingTop: theme.spacing.medium, paddingBottom: theme.spacing.small }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: theme.spacing.small }}
        >
          <FilterButton title="Carne" iconSize={hp('2%')} IconComponent={MaterialCommunityIcons} iconName="food-steak" filterValue="carne" />
          <FilterButton title="Queijo" iconSize={hp('1.5%')} IconComponent={FontAwesome6} iconName="cheese" filterValue="queijo" />
          <FilterButton title="Frango" IconComponent={MaterialCommunityIcons} iconName="food-drumstick" filterValue="frango" />
          <FilterButton title="Calabresa" IconComponent={MaterialCommunityIcons} iconName="sausage" filterValue="calabresa" />
          <FilterButton title="Camarão" IconComponent={FontAwesome6} iconName="shrimp" filterValue="camarao" />
        </ScrollView>
      </View>
      <Products category="pasteis" filter={filter} />
    </ContainerPasteis>
  )
}

const Lanches = () => <Products category="lanches" />;
const Bebidas = () => <Products category="bebidas" />;
const Doces = () => <Products category="doces" />;

export { Pasteis, Lanches, Doces, Bebidas }
