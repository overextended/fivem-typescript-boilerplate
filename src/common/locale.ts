import Config from "@common/config";
/*
in config.json
add locale : "en"
*/
let currentLocale = Config.locals;
let translations: Record< string, any > = require(`../../locales/${currentLocale}.json`);

function Locale(str: string, ...args: any[]): string {
  let text = translations[str] || str;
  args.forEach((arg, index) => {
    text = text.replace(`\${${index + 1}}`, arg);
  });
  return text;
}

export function setLocale(lang: string) {
  currentLocale = lang;
  translations = require(`../../locales/${lang}.json`);
}

export function getLocale() {
  return currentLocale;
}

export default Locale;
