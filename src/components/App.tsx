import React, { FC, lazy, Suspense } from 'react';
import Container from 'react-bootstrap/Container';

import Loader from '@Components/Loader';

const Canvas = lazy(() => import('@Components/tabletop/Canvas'));

const App: FC = () => {
  return (
    <Container fluid={true} className="p-0">
      <Suspense fallback={<Loader />}>
        <Canvas width={window.innerWidth} height={window.innerHeight} />
      </Suspense>
    </Container>
  );
};

export default App;
