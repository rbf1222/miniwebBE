
// src/lib/i18n.ts
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import HttpBackend from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import ko from "../../public/locales/ko/translation.json";
import en from "../../public/locales/en/translation.json";
import ja from "../../public/locales/ja/translation.json";

i18n
  .use(HttpBackend) // public/locales에서 json 불러오기
  .use(LanguageDetector) // 브라우저 언어 감지
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
      ja: { translation: ja },
    },
    lng: "ko",
    fallbackLng: "ko",
    supportedLngs: ["en", "ko", "ja"],
    debug: false,
    interpolation: {
      escapeValue: false, // react는 자동으로 escaping 처리함
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },
  })

if (typeof window !== "undefined") {
  const saved = localStorage.getItem("lang")
  if (saved) {
    // 앱 부팅 직후 저장된 언어로 강제
    import("i18next").then(({ default: i18n }) => i18n.changeLanguage(saved))
  }
}

export default i18n

