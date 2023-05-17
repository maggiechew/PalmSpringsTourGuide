import React, { createContext, useContext, useState } from 'react';

export const SiteUserContext = createContext(null);

export const useSiteUserContext = () => {
  return useContext(SiteUserContext);
};

export default function SiteSoundProvider({ children }) {
  const [currentSite, setCurrentSite] = useState(null);
  const [sound, setSound] = useState(undefined);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [duration, setDuration] = useState(undefined);
  const [position, setPosition] = useState(0);
  // MODAL STATES: enterZone, tutorial, newSite
  const [modalType, setModalType] = useState('newSite');

  const siteSoundValue = {
    currentSite,
    setCurrentSite,
    sound,
    setSound,
    isPlayerReady,
    setIsPlayerReady,
    isPlaying,
    setIsPlaying,
    sheetOpen,
    setSheetOpen,
    showModal,
    setShowModal,
    duration,
    setDuration,
    position,
    setPosition,
    modalType,
    setModalType,
  };

  return (
    <SiteUserContext.Provider value={siteSoundValue}>
      {children}
    </SiteUserContext.Provider>
  );
}
