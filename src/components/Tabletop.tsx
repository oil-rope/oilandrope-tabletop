import { loadCampaign } from '@Utils/apiCalls';

import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import Loader from '@Components/Loader';

import { CampaignContext } from '@Contexts';

import { ICampaign } from '@Interfaces';

const Chat = lazy(() => import('@Components/Chat/Chat'));

const Tabletop = () => {
  const { campaignID } = useParams();

  const [campaign, setCampaign] = useState<ICampaign | null>(null);

  useEffect(() => {
    if (campaign) return;
    if (!campaignID) return;
    loadCampaign(Number(campaignID)).then(setCampaign).catch(alert);
  }, [campaign, campaignID]);

  return (
    <CampaignContext.Provider value={campaign}>
      <Container fluid={true}>
        <Row>
          <Col
            xs={12}
            md={8}
            lg={9}
            xxl={10}
            className="m-0 p-0"
            id="tabletopCanvasContainer"
          >
            <canvas
              style={{
                backgroundColor: 'darkgrey',
                width: '100%',
                height: '100%',
              }}
            ></canvas>
          </Col>
          <Col className="px-0 mx-0">
            <Suspense fallback={<Loader text="Loading chat..." />}>
              <Chat />
            </Suspense>
          </Col>
        </Row>
      </Container>
    </CampaignContext.Provider>
  );
};

export default Tabletop;
