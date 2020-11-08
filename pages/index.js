import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Head from 'next/head'
import LineChart from '../components/LineChart';
import ToolTip from '../components/ToolTip';
import InfoBox from '../components/InfoBox';
import styles from '../styles/Home.module.css'

export default function Home() {

  const [fetchingData, setFetchingData] = useState(true);
  const [data, setData] = useState(null);
  const [hoverLoc, setHoverLoc] = useState(null);
  const [activePoint, setActivePoint] = useState(null);

  const handleChartHover = (hoverLoc, activePoint) => {
    setHoverLoc(hoverLoc);
    setActivePoint(activePoint);
  }

  useEffect(() => {
    const getData = async () => {
      const url = 'https://api.coindesk.com/v1/bpi/historical/close.json';
      const r = await fetch(url);

      try {
        const bitcoinData = await r.json();

        const sortedData = [];
        let count = 0;
        for (let date in bitcoinData.bpi) {
          sortedData.push({
            d: dayjs(date).format('MMM DD'),
            p: bitcoinData.bpi[date].toLocaleString('us-EN', { style: 'currency', currency: 'USD' }),
            x: count, //previous days
            y: bitcoinData.bpi[date] // numerical price
          });
          count++;
        }
        setData(sortedData);
        setFetchingData(false);
      } catch (e) {
        console.log(e);
      }
    }
    getData();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Interactive Bitcoin Chart</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Interactive Bitcoin Chart
        </h1>

        {!fetchingData ? <InfoBox data={data} /> : null }

        <div className={styles.popup}>
          {hoverLoc ? <ToolTip hoverLoc={hoverLoc} activePoint={activePoint} /> : null}
        </div>

        {!fetchingData ? <LineChart data={data} onChartHover={(a, b) => handleChartHover(a, b)} /> : null}
      </main>

      <footer className={styles.footer}>
          Powered by&nbsp;
          <a href="http://www.coindesk.com/price/" target="_blank" rel="noopener noreferrer">CoinDesk</a>
      </footer>
    </div>
  )
}
