import React from 'react';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../styles/theme';

const StyledDivider = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${props => props.width || '100%'};
  margin: ${({ margin }) => margin || theme.spacing.medium}px 0;
`;

const Line = styled.View`
  flex: 1;
  height: ${hp('0.1%')}px;
  background-color: ${props => (props.dark ? theme.colors.darkGray : theme.colors.gray)};
`;

const DividerText = styled.Text`
  color: ${theme.colors.darkGray};
  font-size: ${theme.fontSize.small}px;
  margin: 0 ${wp('1%')}px;
`;

const Divider = ({ width, margin, dark, children }) => {
  return (
    <StyledDivider width={width} margin={margin}>
      <Line dark={dark} />
      {children && <DividerText dark={dark}>{children}</DividerText>}
      {children && <Line dark={dark} />}
    </StyledDivider>
  );
};

export default Divider;
