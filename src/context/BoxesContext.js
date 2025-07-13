import React, { createContext, useState, useEffect, useContext } from 'react';
import { getBoxes, createBox, deleteAllBoxes } from '../services/api';
import { AuthContext } from './AuthContext';

export const BoxesContext = createContext({
  boxes: [],
  addBox: () => {},
});

export const BoxesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [boxes, setBoxes] = useState([]);

  // Başlangıçta backend'den kutuları yükle
  useEffect(() => {
    async function load() {
      try {
        const all = await getBoxes();
        setBoxes(all);
      } catch (err) {
        console.error('Boxes fetch error:', err);
      }
    }
    load();
  }, []);

  const addBox = async (box) => {
    if (!user) throw new Error('Kullanıcı doğrulanmadı');
    try {
      const data = {
        ...box,
        userId: user.id,
        username: user.username,
      };
      const saved = await createBox(data);
      setBoxes((prev) => [...prev, saved]);
    } catch (err) {
      console.error('Box creation error:', err);
    }
  };

  const clearBoxes = async () => {
    try {
      await deleteAllBoxes();
      setBoxes([]);
    } catch (err) {
      console.error('Boxes delete error:', err);
    }
  };

  return (
    <BoxesContext.Provider value={{ boxes, addBox, clearBoxes }}>
      {children}
    </BoxesContext.Provider>
  );
}; 