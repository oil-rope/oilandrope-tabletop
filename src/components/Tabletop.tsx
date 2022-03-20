import { loadSession } from '@/utils/apiCalls';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import { SessionContext } from '@Contexts';

import { ISession } from '@/interfaces';

import Chat from '@Components/Chat/Chat';

const Tabletop = () => {
  const { sessionID } = useParams();

  const [session, setSession] = useState<ISession | null>(null);

  useEffect(() => {
    if (session !== null) return;
    loadSession(Number(sessionID) || 0, setSession);
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
            <canvas
              style={{ backgroundColor: 'darkgrey', width: '100%' }}
            ></canvas>
          </Col>
          <Col className="px-0 mx-0">
            <Chat />
          </Col>
        </Row>
      </Container>
    </SessionContext.Provider>
  );
};

export default Tabletop;
