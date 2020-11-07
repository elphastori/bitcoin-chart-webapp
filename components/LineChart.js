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
        yLabelSize = 80
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

    const getCoords = (e) => {
    }

    const stopHover = () => {
    }

    return (
        <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className={styles.linechart}
            onMouseLeave={() => stopHover()}
            onMouseMove={(e) => getCoords(e)}
        >
            {makeAxis()}
            {makePath()}
            {makeArea()}
        </svg>
    );
}

export default LineChart;