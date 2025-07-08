import React, { createContext, useState } from 'react';

export const BoxesContext = createContext({
  boxes: [],
  addBox: () => {},
});

export const BoxesProvider = ({ children }) => {
  const [boxes, setBoxes] = useState([]);

  const addBox = (box) => {
    setBoxes((prev) => [...prev, box]);
  };

  return (
    <BoxesContext.Provider value={{ boxes, addBox }}>
      {children}
    </BoxesContext.Provider>
  );
}; 