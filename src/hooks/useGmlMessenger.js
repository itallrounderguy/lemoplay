const useGmlMessenger = () => {
  const sendToGml = (message) => {
    if (typeof window.gml_Script_gmcallback_datafromjs === "function") {
      window.gml_Script_gmcallback_datafromjs(message);
    } else {
      console.warn("GML callback function not available.");
    }
  };

  return { sendToGml };
};

export default useGmlMessenger;
