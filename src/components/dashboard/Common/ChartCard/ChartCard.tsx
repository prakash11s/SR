import React, {ReactNode} from 'react';

export interface IChartCard {
    styleName: string,
    children?: ReactNode[],
    chartHeaderStyle?: string
}

const ChartCard: React.FC<IChartCard> = ({styleName, children, chartHeaderStyle}) => {
    return (
        <div className={`card border-0 shadow ${styleName}`}>
            <div className={`chart-header ${chartHeaderStyle}`}>
                {children && children[0]}
            </div>
            {children && children[1]}
        </div>
    )
};

export default ChartCard;