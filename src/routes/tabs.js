import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import theme from '../styles/theme';
import Menu from '../screens/Menu';
import Orders from '../screens/Orders';
import Historic from '../screens/Historic';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import Management from '../screens/Management';


const Tab = createBottomTabNavigator();

function Tabs() {
    const { admin } = useContext(AppContext);
    iconSize = theme.size.iconLarge;
    iconSizeFocused = theme.size.iconLarge + hp('0.5%');
    return (
        <BottomSheetModalProvider>
            <Tab.Navigator
                initialRouteName="Menu"
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: "#bbbbbb",
                    tabBarStyle: {
                        height: hp('8%'),
                        paddingTop: hp('1.2%'),
                    },
                    tabBarLabelStyle: {
                        marginBottom: 7,
                        fontWeight: '500',
                    },
                }}>
                <Tab.Screen
                    name="Menu"
                    component={Menu}
                    options={{
                        tabBarLabel: 'Cardápio',
                        tabBarIcon: ({ focused, color }) => (
                            <MaterialIcons name={"restaurant-menu"} size={focused ? iconSizeFocused : iconSize} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Orders"
                    component={Orders}
                    options={{
                        tabBarLabel: 'Comandas',
                        tabBarIcon: ({ focused, color }) => (
                            <MaterialCommunityIcons name={"clipboard-account-outline"} size={focused ? iconSizeFocused : iconSize} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Historic"
                    component={Historic}
                    options={{
                        tabBarLabel: 'Histórico',
                        tabBarIcon: ({ focused, color }) => (
                            <MaterialIcons name={"history"} size={focused ? iconSizeFocused : iconSize} color={color} />
                        ),
                    }}
                />
                {admin &&
                    <Tab.Screen
                        name="Management"
                        component={Management}
                        options={{
                            tabBarLabel: 'Gestão',
                            tabBarIcon: ({ focused, color }) => (
                                <MaterialIcons name={"manage-accounts"} size={focused ? iconSizeFocused : iconSize} color={color} />
                            ),
                        }}
                    />
                }
            </Tab.Navigator>
        </BottomSheetModalProvider>
    );
}

export default Tabs;