// EditorContext.js
import React, { createContext, useState } from 'react';

const EditorContext = createContext();

 const EditorProvider = ({ children }) => {
  const [editorData, setEditorData] = useState({});

  return (
    <EditorContext.Provider value={{ editorData, setEditorData }}>
      {children}
    </EditorContext.Provider>
  );
};

export  {EditorContext,EditorProvider};
