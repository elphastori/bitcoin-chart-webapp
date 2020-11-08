
import React, { Component } from 'react';
import dayjs from 'dayjs';
import styles from '../styles/ToolTip.module.css';

const ToolTip = (props) => {

  const { hoverLoc, activePoint, transactions } = props;
  const svgLocation = document.getElementsByClassName("linechart")[0].getBoundingClientRect();

  let placementStyles = {};
  let width = 100;
  placementStyles.width = width + 'px';
  placementStyles.left = hoverLoc + svgLocation.left - (width / 2);

  const trans = transactions.find(x => dayjs(x.d).format('MMM DD') === activePoint.d);

  return (
    <div className={styles.hover} style={placementStyles}>
      <div className={styles.date}>{activePoint.d}</div>
      <div className={styles.price}>{activePoint.p}</div>
      { trans && <div>
      <div className={styles.date}>{trans.isBuy ? 'Bought' : 'Sold'} {trans.amount}</div>
      </div> }
    </div>
  );
}

export default ToolTip;