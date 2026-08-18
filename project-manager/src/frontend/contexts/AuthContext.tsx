import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TeamMember, teamMembers } from '@/data/mockData';

interface AuthContextProps {
  currentUser: TeamMember;
  setCurrentUser: (user: TeamMember) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Por padrão, simula que Ana Silva (teamMembers[0]) é a usuária atual
  const [currentUser, setCurrentUser] = useState<TeamMember>(teamMembers[0]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
