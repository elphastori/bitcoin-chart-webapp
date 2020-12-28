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

  const [fetchingTransactions, setFetchingTransactions] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [apiKeyId, setApiKeyId] = useState('');
  const [apiKeySecret, setApiKeySecret] = useState('');
  const [accountId, setAccountId] = useState('');

  const [snackBarMessage, setSnackBarMessage] = useState('');

  const handleChartHover = (hoverLoc, activePoint) => {
    setHoverLoc(hoverLoc);
    setActivePoint(activePoint);
  }

  const handleApiKeyIdChange = (e) => {
    setApiKeyId(e.target.value)
  }

  const handleApiKeySecretChange = (e) => {
    setApiKeySecret(e.target.value);
  }

  const handleAccountIdChange = (e) => {
    setAccountId(e.target.value);
  }

  const showSnackBar = (message) => {
    setSnackBarMessage(message);
    setTimeout(() => setSnackBarMessage(''), 3000);
  }

  useEffect(() => {
    const getData = async () => {
      const url = 'https://api.coindesk.com/v1/bpi/historical/close.json';

      try {
        const r = await fetch(url);
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
        console.error(e);
        showSnackBar(e.message)
      }
    }
    getData();
  }, []);

  const fetchTransactions = async () => {
    setFetchingTransactions(true);
    const url = `https://luno-api.herokuapp.com/api/1/accounts/${accountId}/transactions?min_row=1&max_row=40`;

    try {
      const r = await fetch(url, { method: 'GET', headers: { 'Authorization': 'Basic ' + btoa(apiKeyId + ":" + apiKeySecret) } });

      if (r.status !== 200)
        throw new Error("Failed to get your transactions :-(");

      const transData = await r.json();

      setTransactions(transData.transactions.map(trans => ({
        d: dayjs(trans.timestamp).format('YYYY-MM-DD'),
        isBuy: trans.balance_delta > 0,
        amount: trans.balance_delta
      })));

      setFetchingTransactions(false);
      showSnackBar("Got your luno transactions!")
      setApiKeyId('');
      setApiKeySecret('');
      setAccountId('');
    } catch (e) {
      console.error(e);
      showSnackBar(e.message)
    }
  };

  const importButtonDisabled = !(apiKeyId && apiKeySecret && accountId)

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

        <div className={snackBarMessage ? styles.snackbarShow : styles.snackbar}>{snackBarMessage}</div>

        <h1 className={styles.description} style={{ marginBottom: '32px' }}>
          Interactive Bitcoin Chart
        </h1>

        {!fetchingData ? <InfoBox data={data} /> : null}

        <div className={styles.popup}>
          {hoverLoc && <ToolTip hoverLoc={hoverLoc} activePoint={activePoint} transactions={transactions} />}
        </div>

        {!fetchingData && <LineChart data={data} onChartHover={(a, b) => handleChartHover(a, b)} transactions={transactions} />}

        <div className={styles.card}>
          <h1 className={styles.description}>
            Add your Luno!
          </h1>

          <div className={styles.warningAlert}>
            <div>Please use a read-only API</div>
            <div>key for your security</div>
          </div>

          <div>API Key ID: <input type="text" value={apiKeyId} onChange={handleApiKeyIdChange} /></div>
          <div>Secret: <input type="password" value={apiKeySecret} onChange={handleApiKeySecretChange} /></div>
          <div>Account: <input type="text" value={accountId} onChange={handleAccountIdChange} /></div>
          <input
            className={importButtonDisabled ? styles.buttonDisabled : styles.button}
            type="button"
            value="Get transactions"
            onClick={fetchTransactions}
            disabled={importButtonDisabled}
          />
        </div>
      </main>

      <footer className={styles.footer}>
        Powered by&nbsp;
          <a href="http://www.coindesk.com/price/" target="_blank" rel="noopener noreferrer">CoinDesk</a>
      </footer>
    </div>
  )
}
