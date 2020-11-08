import React, { useState } from "react";
import styles from '../styles/LineChart.module.css';

const LineChart = (props) => {
    const {
        data = [],
        svgWidth = 900,
        svgHeight = 300,
        color = "#2196F3",
        pointRadius = 5,
        xLabelSize = 20,
        yLabelSize = 80,
        onChartHover
    } = props;

    const [hoverLoc, setHoverLoc] = useState(null);
    const [activePoint, setActivePoint] = useState(null);

    // Get min and max cordinates

    const getX = () => {
        return {
            min: data[0].x,
            max: data[data.length - 1].x
        };
    }

    const getY = () => {
        return {
            min: data.reduce((min, p) => p.y < min ? p.y : min, data[0].y),
            max: data.reduce((max, p) => p.y > max ? p.y : max, data[0].y)
        };
    }

    const getSvgX = (x) => {
        const maxX = getX().max;
        return yLabelSize + (x / maxX * (svgWidth - yLabelSize));
    }

    const getSvgY = (y) => {
        const gY = getY();
        return ((svgHeight - xLabelSize) * gY.max - (svgHeight - xLabelSize) * y) / (gY.max - gY.min);
    }

    // Build SVG path
    const makePath = () => {
        let pathD = "M " + getSvgX(data[0].x) + " " + getSvgY(data[0].y) + " ";

        pathD += data.map((point, i) => {
            return "L " + getSvgX(point.x) + " " + getSvgY(point.y) + " ";
        });

        return (
            <path className={styles.linechart_path} d={pathD} style={{ stroke: color }} />
        );
    }

    // Build grid axis
    const makeAxis = () => {
        const x = getX();
        const y = getY();

        return (
            <g className={styles.linechart_axis}>
                <line
                    x1={getSvgX(x.min) - yLabelSize} y1={getSvgY(y.min)}
                    x2={getSvgX(x.max)} y2={getSvgY(y.min)}
                    strokeDasharray="5"
                />
                <line
                    x1={getSvgX(x.min) - yLabelSize} y1={getSvgY(y.max)}
                    x2={getSvgX(x.max)} y2={getSvgY(y.max)}
                    strokeDasharray="5"
                />
            </g>
        );
    }

    // Build shaded area
    const makeArea = () => {
        let pathD = "M " + getSvgX(data[0].x) + " " + getSvgY(data[0].y) + " ";

        pathD += data.map((point, i) => {
            return "L " + getSvgX(point.x) + " " + getSvgY(point.y) + " ";
        }).join("");

        const x = getX();
        const y = getY();
        pathD += "L " + getSvgX(x.max) + " " + getSvgY(y.min) + " "
            + "L " + getSvgX(x.min) + " " + getSvgY(y.min) + " ";

        return <path className={styles.linechart_area} d={pathD} />
    }

    const makeLabels = () => {
        const padding = 5;
        return (
            <g className={styles.linechart_label}>
                {/* Y AXIS LABELS */}
                <text transform={`translate(${yLabelSize / 2}, 20)`} textAnchor="middle">
                    {getY().max.toLocaleString('us-EN', { style: 'currency', currency: 'USD' })}
                </text>
                <text transform={`translate(${yLabelSize / 2}, ${svgHeight - xLabelSize - padding})`} textAnchor="middle">
                    {getY().min.toLocaleString('us-EN', { style: 'currency', currency: 'USD' })}
                </text>
                {/* X AXIS LABELS */}
                <text transform={`translate(${yLabelSize}, ${svgHeight})`} textAnchor="start">
                    {data[0].d}
                </text>
                <text transform={`translate(${svgWidth}, ${svgHeight})`} textAnchor="end">
                    {data[data.length - 1].d}
                </text>
            </g>
        );
    }

    // Find the closet point to the mouse
    const getCoords = (e) => {
        const svgLocation = document.getElementsByClassName("linechart")[0].getBoundingClientRect();
        const adjustment = (svgLocation.width - svgWidth) / 2; //takes padding into consideration
        const relativeLoc = e.clientX - svgLocation.left - adjustment;

        let svgData = [];
        data.map((point, i) => {
            svgData.push({
                svgX: getSvgX(point.x),
                svgY: getSvgY(point.y),
                d: point.d,
                p: point.p
            });
        });

        let closestPoint = {};
        for (let i = 0, c = 500; i < svgData.length; i++) {
            if (Math.abs(svgData[i].svgX - hoverLoc) <= c) {
                c = Math.abs(svgData[i].svgX - hoverLoc);
                closestPoint = svgData[i];
            }
        }

        if (relativeLoc - yLabelSize < 0) {
            stopHover();
        } else {
            setActivePoint(closestPoint);
            setHoverLoc(relativeLoc);
            onChartHover(relativeLoc, closestPoint);
        }
    }

    const stopHover = () => {
        setHoverLoc(null);
        setActivePoint(null);
        onChartHover(null, null);
    }

    // Make active point
    const makeActivePoint = () => {
        return (
            <circle
                className={styles.linechart_point}
                style={{ stroke: color }}
                r={pointRadius}
                cx={activePoint.svgX}
                cy={activePoint.svgY}
            />
        );
    }

    // Make hover line
    const createLine = () => {
        return (
            <line
                className={styles.hoverLine}
                x1={hoverLoc} y1={-8}
                x2={hoverLoc} y2={svgHeight - xLabelSize}
            />
        )
    }

    return (
        <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="linechart"
            onMouseLeave={() => stopHover()}
            onMouseMove={(e) => getCoords(e)}
        >
            {makeAxis()}
            {makePath()}
            {makeArea()}
            {makeLabels()}
            {hoverLoc ? createLine() : null}
            {hoverLoc ? makeActivePoint() : null}
            <style jsx>{`
                .linechart {
                    padding: 8px;
                }
            `}</style>
        </svg>
    );
}

export default LineChart;