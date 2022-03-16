import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import './style.scss'

const YearlyProfitChart: React.FC<any> = props => {

    const {
        shadowColor,
        height,
        backgroundColor,
        borderColor,
        hoverBorderColor,
        hoverBorderWidth,
        rotation,
        chartType
    } = props;

    const data = (canvas) => {
        const ctx = canvas.getContext("2d");
        const _stroke = ctx.stroke;
        ctx.stroke = function () {
            ctx.save();
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 10;
            _stroke.apply(this, arguments);
            ctx.restore();
        };

        return {
            labels: [
                'red',
                'sky',
            ],
            datasets: [{
                data: [100, 300],
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                hoverBorderColor: hoverBorderColor,
                hoverBorderWidth: hoverBorderWidth
            }],
        }
    }


    const options = {
        maintainAspectRatio: false,
        chartType: chartType,
        legend: {
            display: false,
            labels: {
                fontColor: '#AAAEB3'
            }
        },
        layout: {
            padding: {
                top: 5,
                bottom: 5,
                right: 0,
                left: 0,
            }
        },
        cutoutPercentage: 75,
        borderWidth: 0,
        rotation: (-0.5 * Math.PI) - (25 / rotation * Math.PI)
    };
    return (
      <Doughnut data={data} options={options} height={height}/>
    );
}

export default YearlyProfitChart;