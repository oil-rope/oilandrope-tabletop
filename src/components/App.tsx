import React, { FC, useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Loader from '@Components/Loader';
import NotFound from '@Components/NotFound';

import { AuthContext } from '@Contexts';
import { loadUser } from '@Utils/apiCalls';

import { IUser } from '@Interfaces';

const Tabletop = lazy(() => import('@Components/Tabletop'));

const App: FC = () => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (user !== null) return;
    const fetchData = async () => {
      const userJSON = await loadUser();
      setUser(userJSON);
    };
    fetchData();
  }, [user]);

  return (
    <Suspense fallback={<Loader text="Loading..." />}>
      <BrowserRouter>
        <AuthContext.Provider value={user}>
          <Routes>
            <Route path="/session/:sessionID" element={<Tabletop />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
