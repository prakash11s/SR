import React from 'react';
import {Radar} from 'react-chartjs-2';


const data = (canvas) => {
    let gradientBlue = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
    gradientBlue.addColorStop(0, 'rgba(85, 85, 255, 0.9)');
    gradientBlue.addColorStop(1, 'rgba(151, 135, 255, 0.8)');

    let gradientHoverBlue = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
    gradientHoverBlue.addColorStop(0, 'rgba(65, 65, 255, 1)');
    gradientHoverBlue.addColorStop(1, 'rgba(131, 125, 255, 1)');

    let gradientRed = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
    gradientRed.addColorStop(0, 'rgba(255, 85, 184, 0.9)');
    gradientRed.addColorStop(1, 'rgba(255, 135, 135, 0.8)');

    let gradientHoverRed = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
    gradientHoverRed.addColorStop(0, 'rgba(255, 65, 164, 1)');
    gradientHoverRed.addColorStop(1, 'rgba(255, 115, 115, 1)');

    return {
        labels: ["", "", "", "", "", ""],
        datasets: [{
            label: "Donté Panlin",
            data: [70, 85, 65, 65, 85, 82],
            fill: true,
            backgroundColor: gradientBlue,
            borderColor: 'transparent',
            pointBackgroundColor: "transparent",
            pointBorderColor: "transparent",
            pointHoverBackgroundColor: "transparent",
            pointHoverBorderColor: "transparent",
            pointHitRadius: 50,
        }, {
            label: "Mireska Sunbreeze",
            data: [80, 70, 80, 80, 75, 40],
            fill: true,
            backgroundColor: gradientRed,
            borderColor: "transparent",
            pointBackgroundColor: "transparent",
            pointBorderColor: "transparent",
            pointHoverBackgroundColor: "transparent",
            pointHoverBorderColor: "transparent",
            pointHitRadius: 50,
        }]
    }
};

let shadowed = {
    beforeDatasetsDraw: function (chart, options) {
        chart.ctx.shadowColor = 'rgba(0, 0, 0, 0.50)';
        chart.ctx.shadowBlur = 10;
    },
    afterDatasetsDraw: function (chart, options) {
        chart.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        chart.ctx.shadowBlur = 0;
    }
};

const options = {
    chartType: 'customRadar',
    legend: {
        display: false,
        labels: {
            fontColor: '#AAAEB3'
        }
    },
    plugins: [shadowed]
};


const RadarChart: React.FC<any> = (props: any) => {

    return (
        <Radar data={data} options={options} height={250}/>
    );
}

export default RadarChart;