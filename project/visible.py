import pandas as pd
import matplotlib.pyplot as plt
import matplotlib

# ✅ 한글 폰트 설정 (Windows 기준)
plt.rcParams['font.family'] = 'Malgun Gothic'
plt.rcParams['axes.unicode_minus'] = False  # 마이너스 기호 깨짐 방지

# 엑셀 불러오기
file_path = "C:/Users/samsung/Desktop/교육용db_강사 송부용/5_용접불량율.xlsx"
data = pd.read_excel(file_path, sheet_name="용접불량율(1월)")

# 용접방법별 빈도 계산
welding_counts = data["용접방법"].value_counts()

# 그래프 그리기
plt.figure(figsize=(8,6))
welding_counts.plot(kind="bar", color="skyblue", edgecolor="black")
plt.title("용접방법 분포", fontsize=14)
plt.xlabel("용접방법", fontsize=12)
plt.ylabel("건수", fontsize=12)
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
