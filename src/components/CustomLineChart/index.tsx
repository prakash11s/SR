import React, {useEffect} from 'react';
import Chart from 'chart.js'

const CustomLineChart: React.FC<any> = props => {

  const chartRef: React.RefObject<HTMLCanvasElement> = React.createRef<HTMLCanvasElement>();

  const {
    labels,
    label,
    borderColor,
    chartData,
    pointBackgroundColor,
    height,
    pointBorderColor,
    borderWidth,
    shadowColor,
    pointBorderWidth,
    lineTension,
    pointRadius,
    pointHoverBorderColor,
    gridLinesDisplay,
    gridLineWidth,
    fill
  } = props;

  useEffect(() => {
    if (chartRef.current) {
      const myChartRef: CanvasRenderingContext2D | null = chartRef.current.getContext("2d");
      if (myChartRef) {
        new Chart(myChartRef, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: label,
                fill: fill,
                lineTension: lineTension,
                borderColor: borderColor,
                borderWidth: borderWidth,
                pointBorderColor: pointBorderColor,
                pointBackgroundColor: pointBackgroundColor,
                pointBorderWidth: pointBorderWidth,
                pointRadius: pointRadius,
                pointHoverBackgroundColor: pointBackgroundColor,
                pointHoverBorderColor: pointHoverBorderColor,
                pointHoverBorderWidth: 4,
                pointHoverRadius: 6,
                data: chartData,
              }
            ]
          },
          options: {
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: true,
                ticks: {
                  display: false,
                  min: 0
                },
                gridLines: {
                  display: gridLinesDisplay,
                  drawBorder: false,
                  lineWidth: gridLineWidth
                }
              }],
              yAxes: [{
                display: false,
                ticks: {
                  suggestedMin: 0,
                  beginAtZero: true
                }
              }],

            },
            layout: {
              padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: -10,
              },
            }
          }
        });
      }
    }
  });

  return (
    <canvas
      id="myChart"
      ref={chartRef}
      height={height}
    />
  );
}

export default CustomLineChart;
