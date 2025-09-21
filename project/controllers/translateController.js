// src/controllers/translateController.js
// 이 예시는 외부 번역 API를 바로 호출하지 않고, 구조만 제공합니다.
// 실제로 Google Cloud Translate나 Naver Papago 등 키 필요.

export async function translate(req, res, next) {
    try {
        const { text, targetLang } = req.body;
        if (!text || !targetLang) return res.status(400).json({ error: true, message: 'text and targetLang required' });

        // TODO: 실제 번역 API 호출. 여기는 mock으로 반환.
        // 예: call Google Translate API or Naver Papago

//          {
//              "text": "이 문장을 영어로 번역해주세요.",
//              "targetLang": "en"
//          }
        const translatedText = `[${targetLang}] ${text}`;

        res.json({ translatedText });
    } catch (err) {
        next(err);
    }
}