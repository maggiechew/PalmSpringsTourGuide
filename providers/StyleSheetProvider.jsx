import { StyleSheet, Text, View } from 'react-native';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Colors } from '../config';

export const StyleSheetContext = createContext(null);

export default function StyleSheetProvider({ children }) {
  return (
    <StyleSheetContext.Provider value={styles}>
      {children}
    </StyleSheetContext.Provider>
  );
}

const styles = StyleSheet.create({
  modal: {
    height: 140,
    padding: 10
  },
  modalSmall: {
    height: 70,
    padding: 10
  },
  audioPlayer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 25,
    marginTop: 0
  },
  siteName: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 10,
    marginBottom: -10,
    color: '#f57c00'
  },
  animationContainer: {},
  avatarModal: {
    backgroundColor: `#111111cc`,
    flex: 1,
    justifyContent: 'flex-end',
    theme: 'dark',
    margin: 20,
    marginTop: 60,
    marginBottom: 270,
    padding: 20,
    zIndex: 100000,
    borderRadius: 20
  },
  modalText: {
    fontSize: 16,
    color: '#f57c00',
    marginVertical: 5,
    marginLeft: 13,
    fontWeight: 'bold'
  },
  avatarButton: {
    marginVertical: 10,
    marginHorizontal: 10,
    textColor: 'white',
    backgroundColor: 'orange',
    marginTop: 30
  },
  signOutButton: {
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: 'red',
    marginBottom: 30
  },
  avatarButtonText: {
    fontFamily: 'RWBold',
    fontSize: 16,
    color: 'white',
    // weight: 'bold'
  },
  avatarButtonClose: {
    fontFamily: 'RWBold',
    alignItems: 'flex-end',
    bottom: 240,
    marginVertical: 5
  },
  loginButtonText: {
    fontSize: 16,
    color: '#f57c00'
  },
  card: {
    margin: 20,
    height: '63%'
  },
  shortDescription: {
    marginBottom: 20,
    marginTop: 10
  },
  tutorialTitle: {
    color: '#f57c00'
  },
  tutorialText: {
    color: 'white'
  },
  newSiteBodyText: {
    textAlign: 'center',
    color: 'white'
  },
  clickMeText: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: -10,
    fontSize: 18,
    color: '#f57c00'
  },
  newSiteContainer: {
    alignItems: 'center'
  },
  closeX: {
    marginLeft: 270,
    marginBottom: 110,
    padding: 0,
    bottom: 0
  },
  siteIconTutorial: {
    width: 28,
    height: 28
  },
  // zoneTutorial: {},
  learnMore: {
    fontSize: 14,
    // marginLeft: 1,
    marginTop:-14,
    // marginTop: 0,
    paddingTop:0,
    color: 'gold'
  },
});