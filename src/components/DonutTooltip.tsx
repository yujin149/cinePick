interface DonutTooltipProps {
    active?: boolean;
    payload?: {
        value: number;
        name: string;
    }[];
}

function DonutTooltip({
                          active,
                          payload,
                      }: DonutTooltipProps) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const genre = payload[0].name;
    const percentage = payload[0].value;

    return (
        <div className="donut-tooltip">
            <strong>{genre}</strong>
            <span>{percentage}%</span>
        </div>
    );
}

export default DonutTooltip;