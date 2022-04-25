import React, { FC, useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Loader from '@Components/Loader';
import NotFound from '@Components/NotFound';

import { AuthContext } from '@Contexts';
import { loadBot, loadUser } from '@Utils/apiCalls';

import { IBot, IUser } from '@Interfaces';

const Tabletop = lazy(() => import('@Components/Tabletop'));

const App: FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [bot, setBot] = useState<IBot | null>(null);

  useEffect(() => {
    if (user !== null) return;
    const fetchData = async () => {
      const userJSON = await loadUser();
      setUser(userJSON);
    };
    fetchData().catch(alert);
  }, [user]);

  useEffect(() => {
    if (bot !== null) return;
    const fetchData = async () => {
      const botJSON = await loadBot();
      setBot(botJSON);
    };
    fetchData().catch(alert);
  }, [bot]);

  if (!user) return <Loader text="Loading user..." />;
  if (!bot) return <Loader text="Loading bot..." />;

  return (
    <Suspense fallback={<Loader text="Loading..." />}>
      <BrowserRouter>
        <AuthContext.Provider value={{ user, bot }}>
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
