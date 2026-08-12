interface CustomTooltipProps {
    active?: boolean;
    payload?: {
        value: number;
    }[];
    label?: string;

    side?: "left" | "right";
}

function CustomTooltip({
    active,
    payload,
    label,
    side = "right",
                       }: CustomTooltipProps){
    if(!active || !payload || payload.length === 0){
        return null;
    }

    const percentage = payload[0].value;
    return (
        <div className={`custom-tooltip ${side}`}>
            <h3>영화 취향 분석</h3>

            <div className="tooltip-content">
                <span>{label}</span>
                <strong>{percentage}%</strong>
            </div>
        </div>
    );
}

export default CustomTooltip;