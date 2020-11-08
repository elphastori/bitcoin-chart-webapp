  
import React, { Component } from 'react';
import styles from '../styles/ToolTip.module.css';

const ToolTip = (props) => {

    const {hoverLoc, activePoint} = props;
    const svgLocation = document.getElementsByClassName("linechart")[0].getBoundingClientRect();

    let placementStyles = {};
    let width = 100;
    placementStyles.width = width + 'px';
    placementStyles.left = hoverLoc + svgLocation.left - (width/2);

    return (
      <div className={styles.hover} style={ placementStyles }>
        <div className={styles.date}>{ activePoint.d }</div>
        <div className={styles.price}>{activePoint.p }</div>
      </div>
    );
}

export default ToolTip;