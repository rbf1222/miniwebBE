// src/controllers/translateController.js

import { Translate } from '@google-cloud/translate/build/src/v2/index.js';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.GOOGLE_API_KEY); // 잘 불러와지는지 확인용

// API 키 환경변수로 설정하도록 수정됨 ↓
const translate = new Translate({
  key: process.env.GOOGLE_API_KEY,  // 수정됨
});

export async function translateText(req, res, next) {
  // text → texts (배열)로 수정됨 ↓
  const { texts, targetLang } = req.body;

  // 배열 검증 추가 ↓
  if (!texts || !Array.isArray(texts) || !targetLang) {
    return res.status(400).json({
      error: true,
      message: 'texts (string[])와 targetLang이 필요합니다.', // 메시지도 수정됨
    });
  }

  try {
    // 여러 문장 번역 처리로 수정됨 ↓
    const translations = await Promise.all(
      texts.map(async (text) => {
        const [translation] = await translate.translate(text, targetLang);
        return translation;
      })
    );

    res.json({ translations }); // 배열 형태로 반환하도록 수정됨 ↓
  } catch (err) {
    console.error('❌ Translation error:', err);
    next(err);
  }
}
