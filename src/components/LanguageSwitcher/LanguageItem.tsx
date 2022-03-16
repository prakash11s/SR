import React from 'react';
import { ILanguageItemProps } from './Interface/LanguageItemInterface';

const LanguageItem = ({ language, switchLanguage, handleRequestClose }: ILanguageItemProps): JSX.Element => {
  const { icon, name } = language;
  return (
    <li className="pointer" onClick={() => {
      localStorage.setItem("locale", JSON.stringify(language))
      handleRequestClose();
      switchLanguage(language);
    }}>
      <div className="d-flex align-items-center">
        <i className={`flag flag-24 flag-${icon}`} />
        <h4 className="mb-0 ml-2">{name}</h4>
      </div>
    </li>
  );
};

export default LanguageItem;
