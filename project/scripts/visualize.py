import sys
import os
import json
import pandas as pd
import matplotlib.pyplot as plt

plt.rcParams['font.family'] = 'Malgun Gothic'
plt.rcParams['axes.unicode_minus'] = False

def visualize(file_path, output_path, columns):
    # 첫 번째 시트만 읽기 (요구사항)
    data = pd.read_excel(file_path, sheet_name=1)

    fig, axes = plt.subplots(1, len(columns), figsize=(8*len(columns), 6))
    if len(columns) == 1:
        axes = [axes]

    for ax, col in zip(axes, columns):
        if col not in data.columns:
            ax.set_title(f"{col} (컬럼 없음)")
            ax.axis("off")
            continue

        counts = data[col].value_counts(dropna=False)
        counts.plot(
            kind="pie",
            autopct="%.1f%%",
            startangle=90,
            counterclock=False,
            ax=ax
        )
        ax.set_title(f"{col} 분포", fontsize=14)
        ax.set_ylabel("")

    plt.tight_layout()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, dpi=150, bbox_inches="tight")
    plt.close()

if __name__ == "__main__":
    # 사용법: python visualize.py <input_excel_path> <output_img_path> <columns_json_or_csv>
    if len(sys.argv) < 4:
        print("Usage: python visualize.py <input_excel_path> <output_img_path> <columns_json_or_csv>")
        sys.exit(1)

    excel_path = sys.argv[1]
    img_path = sys.argv[2]
    raw = sys.argv[3]

    # columns는 JSON 배열 혹은 콤마문자열 둘 다 허용
    try:
        cols = json.loads(raw)
        if not isinstance(cols, list):
            cols = [str(cols)]
    except Exception:
        cols = [c.strip() for c in raw.split(",") if c.strip()]

    visualize(excel_path, img_path, cols)

# import sys
# import os
# import pandas as pd
# import matplotlib.pyplot as plt

# # ✅ 한글 폰트 깨짐 방지
# plt.rcParams['font.family'] = 'Malgun Gothic'
# plt.rcParams['axes.unicode_minus'] = False

# def visualize(file_path, output_path, columns):
#     # 엑셀 읽기 (100행만 읽음)
#     data = pd.read_excel(file_path, sheet_name=1)

#     # 여러 컬럼을 선택해서 각각 시각화
#     fig, axes = plt.subplots(1, len(columns), figsize=(8*len(columns), 6))
#     if len(columns) == 1:
#         axes = [axes]

#     for ax, col in zip(axes, columns):
#         if col not in data.columns:
#             ax.set_title(f"{col} (컬럼 없음)")
#             continue

#         counts = data[col].value_counts()

#         counts.plot(
#             kind="pie",
#             autopct="%.1f%%",
#             startangle=90,
#             counterclock=False,
#             ax=ax
#         )
#         ax.set_title(f"{col} 분포", fontsize=14)
#         ax.set_ylabel("")  # 불필요한 y라벨 제거

#     plt.tight_layout()
#     os.makedirs(os.path.dirname(output_path), exist_ok=True)
#     plt.savefig(output_path)
#     plt.close()

# if __name__ == "__main__":
#     # Usage: python visualize.py <input_excel_path> <output_img_path> <columns,...>
#     if len(sys.argv) < 4:
#         print("Usage: python visualize.py <input_excel_path> <output_img_path> <columns,...>")
#         sys.exit(1)

#     excel_path = sys.argv[1]
#     img_path = sys.argv[2]
#     columns = sys.argv[3].split(",")

#     visualize(excel_path, img_path, columns)

# import sys
# import os
# import pandas as pd
# import matplotlib.pyplot as plt

# # ✅ 한글 깨짐 방지 (윈도우: Malgun Gothic, 맥/리눅스는 NanumGothic 등 필요)
# plt.rcParams['font.family'] = 'Malgun Gothic'
# plt.rcParams['axes.unicode_minus'] = False

# def visualize(file_path, output_path):
#     # 엑셀 읽기 (30행만, 특정 컬럼만)
#     data = pd.read_excel(file_path, sheet_name="용접불량율(1월)", usecols=["선종", "용도판정"], nrows=30)

#     # 선종별 빈도 계산
#     counts = data["선종"].value_counts()

#     # 그래프 그리기
#     plt.figure(figsize=(8,6))
#     counts.plot(kind="pie", autopct="%.1f%%", startangle=90, counterclock=False)
#     plt.title("선종별 불량율", fontsize=14)
#     plt.ylabel("")  # y라벨 제거
#     plt.tight_layout()

#     # 결과 저장
#     plt.savefig(output_path)
#     plt.close()

# if __name__ == "__main__":
#     if len(sys.argv) != 3:
#         print("Usage: python visualize.py <input_excel_path> <output_img_path>")
#         sys.exit(1)

#     excel_path = sys.argv[1]
#     img_path = sys.argv[2]

#     # 디렉토리 없으면 생성
#     os.makedirs(os.path.dirname(img_path), exist_ok=True)

#     visualize(excel_path, img_path)