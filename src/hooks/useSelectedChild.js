import { useEffect, useState, useCallback } from 'react';

const LOCAL_ID_KEY = 'selectedChildId';
const LOCAL_DATA_KEY = 'selectedChildData';

export default function useSelectedChild() {
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedChildData, setSelectedChildData] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const id = localStorage.getItem(LOCAL_ID_KEY);
    const data = localStorage.getItem(LOCAL_DATA_KEY);
    if (id && data) {
      setSelectedChildId(id);
      try {
        setSelectedChildData(JSON.parse(data));
      } catch {
        setSelectedChildData(null);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (selectedChildId && selectedChildData) {
      localStorage.setItem(LOCAL_ID_KEY, selectedChildId);
      localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(selectedChildData));
    } else {
      localStorage.removeItem(LOCAL_ID_KEY);
      localStorage.removeItem(LOCAL_DATA_KEY);
    }
  }, [selectedChildId, selectedChildData]);

  // Reset function
  const resetSelection = useCallback(() => {
    setSelectedChildId(null);
    setSelectedChildData(null);
    localStorage.removeItem(LOCAL_ID_KEY);
    localStorage.removeItem(LOCAL_DATA_KEY);
  }, []);

  return {
    selectedChildId,
    selectedChildData,
    setSelectedChildId,
    setSelectedChildData,
    resetSelection,
  };
}
