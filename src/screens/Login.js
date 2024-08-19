import React, { useState } from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import theme from '../styles/theme';
import Input from '../components/Input';
import Button from '../components/Button';
import Divider from '../components/Divider';
import GoogleButtonLogin from '../components/GoogleButtonLogin';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { statusCodes } from '@react-native-google-signin/google-signin';
import { auth, GoogleSignin } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { createNavigationContainerRef } from '@react-navigation/native';


const Container = styled.View`
  flex: 1;
  flex-direction: ${theme.isTablet ? 'row' : 'column'};
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.background};
`;

const LogoContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: ${theme.isTablet ? '50%' : '100%'};
`;

const Logo = styled.View`
  margin-bottom: ${theme.isTablet ? 0 : hp('5%')}px;
`;

const TextLogoTop = styled.Text`
  align-self: flex-start;
  font-size: ${wp('5.5%')}px;
  font-weight: bold;
  color: ${theme.colors.primary};
  font-family: ${Platform.OS === 'ios' ? 'Gill Sans' : 'sans-serif-medium'};
  margin-bottom: ${wp('-5%')}px;
  margin-left: ${wp('1%')}px;
`;

const TextLogoBottom = styled.Text`
  font-size: ${wp('16%')}px;
  font-weight: bold;
  color: ${theme.colors.primary};
  font-family: ${Platform.OS === 'ios' ? 'Gill Sans' : 'sans-serif-medium'};
`;

const TextLogin = styled.Text`
  font-size: ${theme.fontSize.title}px;
  color: ${theme.colors.darkGray};
  margin-bottom: ${hp('2%')}px;
`;

const LoginContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: ${theme.isTablet ? '50%' : '100%'};
  padding: 0 ${wp('10%')}px;
`;

const ErrorBalloon = styled.View`
  background-color: ${theme.colors.errorBalloon};
  padding: ${hp('1%')}px ${wp('5%')}px;
  border-radius: ${wp('2%')}px;
  margin-bottom: ${hp('2%')}px;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.errorText};
  font-size: ${theme.fontSize.small}px;
  text-align: center;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const navigationRef = createNavigationContainerRef();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuário logado com sucesso!');
      setError('');

      if (navigationRef.current?.isReady()) {
        navigationRef.current.navigate('Menu');
      } else {
        setTimeout(() => {
          if (navigationRef.current?.isReady()) {
            navigationRef.current.navigate('Menu');
          }
        }, 100);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error.code);
      switch (error.code) {
        case 'auth/invalid-email':
          setError('E-mail inválido.');
          break;
        case 'auth/invalid-credential':
          setError('Usuário não encontrado.');
          break;
        case 'auth/missing-password':
          setError('Insira sua senha.');
          break;
        default:
          setError('Erro ao fazer login.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = userInfo;

      setError('');
      setLoadingGoogle(true);
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredential);

      if (navigationRef.current?.isReady()) {
        navigationRef.current.navigate('Menu');
      } else {
        setTimeout(() => {
          if (navigationRef.current?.isReady()) {
            navigationRef.current.navigate('Menu');
          }
        }, 100);
      }

    } catch (error) {
      setError('Erro ao Entrar com o Google.');
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.error('Error during Google sign-in:', error);
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <Container>
      <LogoContainer>
        <Logo>
          <TextLogoTop>Pastel do</TextLogoTop>
          <TextLogoBottom>Carioca</TextLogoBottom>
        </Logo>
      </LogoContainer>
      <LoginContainer>
        <TextLogin>Faça seu login</TextLogin>
        {error ? (
          <ErrorBalloon>
            <ErrorText>{error}</ErrorText>
          </ErrorBalloon>
        ) : null}
        <Input
          placeholder="Email"
          type={'email-address'}
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title="Entrar"
          onPress={handleLogin}
          style={{ marginTop: hp('4%') }}
          loading={loading}
        />
        <Divider>ou</Divider>
        <GoogleButtonLogin
          title={'Entrar com o Google'}
          onPress={handleGoogleLogin}
          loading={loadingGoogle}
        />
      </LoginContainer>
    </Container>
  );
};

export default Login;
