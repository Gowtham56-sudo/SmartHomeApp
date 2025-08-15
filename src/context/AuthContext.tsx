import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, signUpWithEmail, signInWithEmail } from '../config/firebase';
import { createUserProfile } from '../services/firestore';
import { User } from '../types';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          ...(firebaseUser.photoURL && { photoURL: firebaseUser.photoURL }), // Conditionally add photoURL
        };
        
        setUser(userData);
        
        // Create or update user profile in Firestore
        try {
          await createUserProfile(userData);
        } catch (error) {
          console.error('Error creating user profile:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '1035147154678-lu3j8ajmra479viqu4kfu7op9jdftms1035147154678-155bp98ebl03kd37rdoq0ah7k72e78u0.apps.googleusercontent.coms.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    clientId: 'YOUR_EXPO_CLIENT_ID'
  });

  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();
      console.log('Google sign-in result:', result);
      if (!result) {
        throw new Error('No result returned from Google sign-in');
      }
      if (result.type !== 'success') {
        throw new Error(`Google sign-in not successful. Type: ${result.type}`);
      }
      if (!result.params || !result.params.id_token) {
        throw new Error('No id_token found in Google sign-in response');
      }
      const { id_token } = result.params;
      const credential = GoogleAuthProvider.credential(id_token);
      try {
        await signInWithCredential(auth, credential);
      } catch (firebaseError) {
        console.error('Firebase signInWithCredential error:', firebaseError);
        throw firebaseError;
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithEmailPassword = async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const signUpWithEmailPassword = async (email: string, password: string) => {
    try {
      await signUpWithEmail(email, password);
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      signInWithEmailPassword,
      signUpWithEmailPassword,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
