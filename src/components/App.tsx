import React, { FC, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';

import { AuthContext, IAuthUserContext } from '@/contexts';
import { CURRENT_USER_API } from '@Constants';

const App: FC = () => {
  const [user, setUser] = useState<IAuthUserContext | null>(null);

  const loadUser = () => {
    fetch(CURRENT_USER_API, {
      mode: 'cors',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  };

  useEffect(() => {
    if (user !== null) return;
    loadUser();
  }, [user]);

  return (
    <AuthContext.Provider value={user}>
      <Container></Container>
    </AuthContext.Provider>
  );
};

export default App;
