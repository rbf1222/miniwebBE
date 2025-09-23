import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.patheffects as pe
import sys
import json
import os

plt.rcParams['font.family'] = 'Malgun Gothic'
plt.rcParams['axes.unicode_minus'] = False

def analyze_excel_donut(file_path, sheet_name, column_name, output_dir="./output"):
    """
    Analyze Excel data and generate donut chart
    Returns either image path or series data
    """
    try:
        # Read Excel file
        df = pd.read_excel(file_path, sheet_name=sheet_name)
        
        # Check if column exists
        if column_name not in df.columns:
            return {"error": f"Column '{column_name}' not found in sheet '{sheet_name}'"}
        
        # Aggregate data with 3% threshold for "Others"
        counts = df[column_name].value_counts(dropna=False)
        total = counts.sum()
        threshold = 0.03
        major = counts[counts/total >= threshold]
        minor_sum = counts[counts/total < threshold].sum()
        
        labels = major.index.tolist()
        sizes = major.values.astype(float)
        if minor_sum > 0:
            labels.append("기타")
            sizes = np.append(sizes, minor_sum)
        
        # Sort by size descending
        order = np.argsort(sizes)[::-1]
        labels = [labels[i] for i in order]
        sizes = sizes[order]
        total = sizes.sum()
        
        # Create donut chart
        fig, ax = plt.subplots(figsize=(8.6, 8.6))
        wedges, _ = ax.pie(
            sizes, startangle=90, counterclock=False, labels=None, autopct=None,
            pctdistance=0.78,
            wedgeprops=dict(width=0.38, edgecolor="white", linewidth=1.2, antialiased=True),
        )
        
        # Text color selection function
        def best_text_color(rgba):
            r, g, b, _ = rgba
            luminance = 0.2126*r + 0.7152*g + 0.0722*b
            return "black" if luminance > 0.55 else "white"
        
        # Add labels for slices >= 5%
        for w, lab, val in zip(wedges, labels, sizes):
            pct = val/total*100
            if pct < 5:
                continue
            theta = (w.theta1 + w.theta2)/2
            r = 0.68
            x, y = r*np.cos(np.deg2rad(theta)), r*np.sin(np.deg2rad(theta))
            txt_color = best_text_color(w.get_facecolor())
            outline = "white" if txt_color == "black" else "black"
            ax.text(x, y, f"{lab}\n{pct:.1f}% ({int(val):,}건)",
                    ha="center", va="center", fontsize=11, color=txt_color,
                    path_effects=[pe.withStroke(linewidth=2.2, foreground=outline)])
        
        # Center total
        ax.text(0, 0, f"총 {int(total):,}건", ha="center", va="center",
                fontsize=13, weight="bold")
        
        ax.set_title(f"{sheet_name} — {column_name} 분포 (도넛 차트)", pad=14, fontsize=14)
        ax.set_aspect("equal")
        
        # Legend
        legend_labels = [f"{lab} — {val/total*100:.1f}% ({int(val):,}건)"
                         for lab, val in zip(labels, sizes)]
        leg = ax.legend(wedges, legend_labels, title=column_name,
                        loc="center left", bbox_to_anchor=(1.02, 0.5),
                        frameon=True, fontsize=10, title_fontsize=11)
        leg.get_frame().set_alpha(0.92)
        
        plt.tight_layout()
        
        # Save image
        os.makedirs(output_dir, exist_ok=True)
        image_path = os.path.join(output_dir, f"donut_{sheet_name}_{column_name}.png")
        plt.savefig(image_path, dpi=150, bbox_inches='tight')
        plt.close()
        
        # Return both image path and series data
        series_data = [
            {"label": str(lab), "value": int(val)}
            for lab, val in zip(labels, sizes)
        ]
        
        return {
            "imageUrl": image_path,
            "series": series_data,
            "total": int(total)
        }
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Usage: python donut_analysis.py <file_path> <sheet_name> <column_name>"}))
        sys.exit(1)
    
    file_path = sys.argv[1]
    sheet_name = sys.argv[2]
    column_name = sys.argv[3]
    
    result = analyze_excel_donut(file_path, sheet_name, column_name)
    print(json.dumps(result, ensure_ascii=False))
