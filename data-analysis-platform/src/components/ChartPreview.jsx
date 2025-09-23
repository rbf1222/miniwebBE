"use client"

import { useEffect, useRef } from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ChartPreview({ data }) {
  const canvasRefs = useRef([])

  useEffect(() => {
    if (!data || data.length === 0) return

    // Cleanup existing charts
    canvasRefs.current.forEach((chart) => {
      if (chart) chart.destroy()
    })
    canvasRefs.current = []

    // Create new charts
    data.forEach((chartData, index) => {
      const canvas = document.getElementById(`chart-${index}`)
      if (!canvas) return

      const ctx = canvas.getContext("2d")

      const chart = new ChartJS(ctx, {
        type: "doughnut",
        data: {
          labels: chartData.data.map((item) => item.label),
          datasets: [
            {
              data: chartData.data.map((item) => item.count),
              backgroundColor: ["#2563eb", "#7c3aed", "#dc2626", "#ea580c", "#ca8a04", "#16a34a", "#0891b2", "#c2410c"],
              borderWidth: 2,
              borderColor: "#ffffff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                generateLabels: (chart) => {
                  const data = chart.data
                  return data.labels.map((label, i) => {
                    const count = data.datasets[0].data[i]
                    const percentage = chartData.data[i].percentage
                    return {
                      text: `${label} — ${percentage.toFixed(1)}% (${count})`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      hidden: false,
                      index: i,
                    }
                  })
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const percentage = chartData.data[context.dataIndex].percentage
                  return `${context.label}: ${percentage.toFixed(1)}% (${context.parsed})`
                },
              },
            },
          },
          elements: {
            arc: {
              borderWidth: 2,
            },
          },
        },
        plugins: [
          {
            id: "centerText",
            beforeDraw: (chart) => {
              const { ctx, width, height } = chart
              ctx.restore()

              const fontSize = Math.min(width, height) / 10
              ctx.font = `${fontSize}px sans-serif`
              ctx.textAlign = "center"
              ctx.textBaseline = "middle"
              ctx.fillStyle = "#374151"

              const centerX = width / 2
              const centerY = height / 2

              ctx.fillText(`Total`, centerX, centerY - fontSize / 2)
              ctx.fillText(`${chartData.total}`, centerX, centerY + fontSize / 2)
              ctx.save()
            },
          },
        ],
      })

      canvasRefs.current[index] = chart
    })

    return () => {
      canvasRefs.current.forEach((chart) => {
        if (chart) chart.destroy()
      })
    }
  }, [data])

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-slate-500">차트 데이터가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {data.map((chartData, index) => (
        <div key={index} className="space-y-2">
          <h4 className="text-sm font-medium text-center">{chartData.column}</h4>
          <div className="relative h-64">
            <canvas id={`chart-${index}`} />
          </div>
        </div>
      ))}
    </div>
  )
}
