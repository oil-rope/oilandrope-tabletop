import React, { FC, useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Loader from '@Components/Loader';

import { AuthContext } from '@Contexts';
import { loadUser } from '@Utils/apiCalls';

import { IUser } from '@/interfaces';

const Tabletop = lazy(() => import('@Components/Tabletop'));

const App: FC = () => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (user === null) loadUser(setUser);
    if (user instanceof Error) throw new Error(user.message);
  }, [user]);

  return (
    <Suspense fallback={<Loader text="Loading..." />}>
      <BrowserRouter>
        <AuthContext.Provider value={user}>
          <Routes>
            <Route path="/session/:sessionID" element={<Tabletop />} />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
