import React, { FC, useState, useEffect, Suspense, lazy } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Loader from '@Components/Loader';

import { AuthContext } from '@Contexts';
import { loadUser } from '@Utils/apiCalls';

import { IUser } from '@/interfaces';

const Chat = lazy(() => import('@Components/Chat/Chat'));

const App: FC = () => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (user === null) loadUser(setUser);
    if (user instanceof Error) throw new Error(user.message);
  }, [user]);

  return (
    <AuthContext.Provider value={user}>
      <Container fluid={true}>
        <Row>
          <Col xs={12} md={8} lg={9} xxl={10} className="mx-0 px-0">
            <h2 className="text-center fw-lighter">
              Here will go a very huge canvas; The tabletop
            </h2>
            <canvas
              style={{ backgroundColor: 'darkgrey', width: '100%' }}
            ></canvas>
          </Col>
          <Col className="px-0 mx-0">
            <Suspense fallback={<Loader />}>
              <Chat />
            </Suspense>
          </Col>
        </Row>
      </Container>
    </AuthContext.Provider>
  );
};

export default App;
