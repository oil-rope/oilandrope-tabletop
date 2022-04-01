import { loadSession } from '@Utils/apiCalls';

import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import Loader from '@Components/Loader';

import { SessionContext } from '@Contexts';

import { ISession } from '@Interfaces';

const Canvas = lazy(() => import('@Components/tabletop/Canvas'));
const Chat = lazy(() => import('@Components/Chat/Chat'));

const Tabletop = () => {
  const { sessionID } = useParams();

  const [session, setSession] = useState<ISession | null>(null);

  useEffect(() => {
    if (session) return;
    if (!sessionID) return;
    const fetchData = async () => {
      const sessionJSON = await loadSession(Number(sessionID));
      setSession(sessionJSON);
    };
    fetchData().catch(alert);
  }, [session, sessionID]);

  return (
    <SessionContext.Provider value={session}>
      <Container fluid={true}>
        <Row>
          <Col
            xs={12}
            md={8}
            lg={9}
            xxl={10}
            className="mx-0 px-0"
            id="tabletopCanvasContainer"
          >
            <Suspense fallback={<Loader text="Loading tabletop..." />}>
              <Canvas />
            </Suspense>
          </Col>
          <Col className="px-0 mx-0">
            <Suspense fallback={<Loader text="Loading chat..." />}>
              <Chat />
            </Suspense>
          </Col>
        </Row>
      </Container>
    </SessionContext.Provider>
  );
};

export default Tabletop;
