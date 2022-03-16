export interface ILanguageItemProps {
 language: ILanguageData,
 switchLanguage: (language: ILanguageData) => void,
 handleRequestClose: () => void
}

interface ILanguageData {
 ISO: string,
 icon: string,
 languageId: string,
 locale: string,
 name: string
}