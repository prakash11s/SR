import { useEffect } from "react";

const AutoLogin = ({ onServiceRightClick }) => {
  useEffect(() => {
    localStorage.clear();
    onServiceRightClick("auto");
  }, []);

  return null;
};

export default AutoLogin;
