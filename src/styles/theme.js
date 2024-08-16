import { Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const theme = {
    colors: {
        primary: '#000000',
        background: '#ffffff',
        lightGray: '#f0f0f0',
        gray: '#cccccc',
        darkGray: '#888888',
        success: '#28a745',
        errorText: '#b00020',
        errorBalloon: '#FFCCCB',
        text: '#000000',
        subText: '#ffffff',
    },
    spacing: {
        small: hp('1%'),
        medium: hp('2%'),
        mediumLarge: hp('3%'),
        large: hp('5%'),
        spacing: hp('2%'),
    },
    fontSize: {
        extraSmall : Dimensions.get('window').width >= 768 ? hp('1.1%') : hp('1.4%'),
        small: Dimensions.get('window').width >= 768 ? hp('1.2%') : hp('1.5%'),
        medium: Dimensions.get('window').width >= 768 ? hp('1.5%') : hp('1.8%'),
        large: Dimensions.get('window').width >= 768 ? hp('1.7%') : hp('2.0%'),
        title: Dimensions.get('window').width >= 768 ? hp('2.3%') : hp('2.6%'),
    },
    size: {
        borderWidth: hp('0.2%'),
        borderSmallRadius: hp('1%'),
        borderRadius: hp('1.8%'),
        iconSmall: hp('1.8%'),
        iconMedium: hp('2.5%'),
        iconLarge: hp('3.2%')
    },
    isTablet: Dimensions.get('window').width >= 768,

};

export default theme;