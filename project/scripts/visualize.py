import sys
import os
import pandas as pd
import matplotlib.pyplot as plt

# ✅ 한글 깨짐 방지 (윈도우: Malgun Gothic, 맥/리눅스는 NanumGothic 등 필요)
plt.rcParams['font.family'] = 'Malgun Gothic'
plt.rcParams['axes.unicode_minus'] = False

def visualize(file_path, output_path):
    # 엑셀 읽기 (30행만, 특정 컬럼만)
    data = pd.read_excel(file_path, sheet_name="용접불량율(1월)", usecols=["선종", "용도판정"], nrows=30)

    # 선종별 빈도 계산
    counts = data["선종"].value_counts()

    # 그래프 그리기
    plt.figure(figsize=(8,6))
    counts.plot(kind="pie", autopct="%.1f%%", startangle=90, counterclock=False)
    plt.title("선종별 불량율", fontsize=14)
    plt.ylabel("")  # y라벨 제거
    plt.tight_layout()

    # 결과 저장
    plt.savefig(output_path)
    plt.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python visualize.py <input_excel_path> <output_img_path>")
        sys.exit(1)

    excel_path = sys.argv[1]
    img_path = sys.argv[2]

    # 디렉토리 없으면 생성
    os.makedirs(os.path.dirname(img_path), exist_ok=True)

    visualize(excel_path, img_path)
