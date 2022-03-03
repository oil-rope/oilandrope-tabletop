import React, { FC, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';

import { AuthContext, IUser } from '@Contexts';
import { loadUser } from '@Utils/apiCalls';

const App: FC = () => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (user !== null) return;
    loadUser(setUser);
  }, [user]);

  return (
    <AuthContext.Provider value={user}>
      <Container></Container>
    </AuthContext.Provider>
  );
};

export default App;
