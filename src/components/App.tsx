import React, { FC, Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Loader from '@Components/Loader';
import LoginModal from '@Components/LoginModal';
import NotFound from '@Components/NotFound';

import { AuthContext } from '@Contexts';
import { loadBot, loadUser } from '@Utils/apiCalls';

import { IBot, IUser } from '@Interfaces';

const Tabletop = lazy(() => import('@Components/Tabletop'));

const App: FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [bot, setBot] = useState<IBot | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleUserLogin = () => {
    loadUser()
      .then(setUser)
      .catch(() => {
        setIsAuthenticated(false);
        setShowModal(true);
      });
  };

  useEffect(() => {
    if (user !== null) return;
    handleUserLogin();
  }, [user]);

  useEffect(() => {
    if (user === null || bot !== null) return;
    const fetchData = async () => {
      const botJSON = await loadBot();
      setBot(botJSON);
    };
    fetchData().catch((msg) => {
      alert(msg);
    });
  }, [bot, user]);

  /*
  if (user === null && !isAuthenticated)
    return (
      <>
        <Loader text="Loading user..." />
        {showModal && (
          <LoginModal
            onLogin={handleUserLogin}
            onFail={() => alert('Credentials incorrect.')}
          />
        )}
      </>
    );
  if (bot === null && user !== null) return <Loader text="Loading bot..." />;
  */

  return (
    <Suspense fallback={<Loader text="Loading..." />}>
      <AuthContext.Provider value={{ user, bot }}>
        <Routes>
          <Route path="/campaign/:campaignID" element={<Tabletop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthContext.Provider>
    </Suspense>
  );
};

export default App;
