import React from "react";
import styles from '../styles/LineChart.module.css';

const LineChart = (props) => {
    const {
        data = [],
        svgWidth = 700,
        svgHeight = 300,
        color = "#2196F3"
    } = props;

    const getMinX = () => {
        return data[0].x;
    }

    const getMaxX = () => {
        return data[data.length - 1].x;
    }

    const getMinY = () => {
        return data.reduce((min, p) => p.y < min ? p.y : min, data[0].y);
    }

    const getMaxY = () => {
        return data.reduce((max, p) => p.y > max ? p.y : max, data[0].y);
    }

    const getSvgX = (x) => {
        return (x / getMaxX() * svgWidth);
    }

    const getSvgY = (y) => {
        return svgHeight - (y / getMaxY() * svgHeight);
    }

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
        const minX = getMinX();
        const maxX = getMaxX();
        const minY = getMinY();
        const maxY = getMaxY();

        return (
            <g className={styles.linechart_axis}>
                <line
                    x1={getSvgX(minX)} y1={getSvgY(minY)}
                    x2={getSvgX(maxX)} y2={getSvgY(minY)}
                />
                <line
                    x1={getSvgX(minX)} y1={getSvgY(minY)}
                    x2={getSvgX(minX)} y2={getSvgY(maxY)}
                />
            </g>
        );
    }

    return (
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            {makePath()}
            {makeAxis()}
        </svg>
    );
}

export default LineChart;