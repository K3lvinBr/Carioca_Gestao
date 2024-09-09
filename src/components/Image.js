import React from 'react';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../styles/theme';

const getSize = (size) => {
  switch (size) {
    case 'small':
      return theme.isTablet ? hp('4%') : hp('5%');
    case 'medium':
      return hp('5.5%');
    case 'large':
      return theme.isTablet ? hp('8%') : hp('14%');
    default:
      return hp('5.5%');
  }
};

const getBorderRadius = (size) => {
  switch (size) {
    case 'small':
      return theme.size.borderSmallRadius;
    default:
      return theme.size.borderRadius;
  }
};

const ImageContainer = styled.View`
  width: ${({ size }) => getSize(size)}px;
  height: ${({ size }) => getSize(size)}px;
  border-radius: ${({ size }) => getBorderRadius(size)}px;
  overflow: hidden;
`;

const StyledImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const Image = ({ source, size = 'medium' }) => {
  const imageSource = (typeof source === 'string' && source === '')
    ? require('../../assets/images/image_empty.jpg')
    : (typeof source === 'string' ? { uri: source } : source);

  return (
    <ImageContainer size={size}>
      <StyledImage
        resizeMode='cover'
        source={imageSource}
      />
    </ImageContainer>
  );
};

export default Image;
