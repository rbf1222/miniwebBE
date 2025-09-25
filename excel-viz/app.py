# app.py (필요 부분만 추가/수정)

from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import pandas as pd
import os, uuid

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# CORS가 필요하면 주석 해제
from flask_cors import CORS
CORS(app, resources={r"/*": {"origins": "*"}})

@app.post("/columns-from-file")
def columns_from_file():
    """
    xlsx/xls/csv 파일을 받아 '첫 번째 시트'의 컬럼 목록만 반환.
    시트 선택은 없고, 반드시 2번 기준(컬럼만)으로 동작.
    """
    f = request.files.get("file")
    if not f:
        return jsonify({"error":"file part required"}), 400

    # 파일 저장(충돌 방지용 prefix)
    safe = secure_filename(f.filename or "uploaded.xlsx")
    name = f"{uuid.uuid4().hex[:8]}_{safe}"
    path = os.path.join(UPLOAD_FOLDER, name)
    f.save(path)

    try:
        # 첫 번째 시트만 읽어서 컬럼 반환
        if safe.lower().endswith(".csv"):
            df = pd.read_csv(path, nrows=5)  # 헤더만 가져오면 충분
        else:
            xls = pd.ExcelFile(path)
            first = xls.sheet_names[1]
            df = pd.read_excel(path, sheet_name=first, nrows=5)

        cols = list(map(str, df.columns))
        return jsonify({"columns": cols})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000, debug=True)