import React, { FC, lazy, Suspense, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';

import { AuthContext, IAuthUserContext } from '@Contexts';
import { loadUser } from '@Utils/apiCalls';

import Loader from '@Components/Loader';

const Canvas = lazy(() => import('@Components/tabletop/Canvas'));

const App: FC = () => {
  const [user, setUser] = useState<IAuthUserContext | null>(null);

  useEffect(() => {
    if (user !== null) return;
    loadUser(setUser);
  }, [user]);

  return (
    <AuthContext.Provider value={user}>
      <Container fluid={true} className="p-0">
        <Suspense fallback={<Loader />}>
          <Canvas width={window.innerWidth} height={window.innerHeight} />
        </Suspense>
      </Container>
    </AuthContext.Provider>
  );
};

export default App;
