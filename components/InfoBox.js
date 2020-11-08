import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import styles from '../styles/InfoBox.module.css';

dayjs.extend(relativeTime)

const InfoBox = (props) => {

    const [currentPrice, setCurrentPrice] = useState(null);
    const [monthChangeD, setMonthChangeD] = useState(null);
    const [monthChangeP, setMonthChangeP] = useState(null);
    const [updatedAt, setUpdatedAt] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const { data } = props;
            const url = 'https://api.coindesk.com/v1/bpi/currentprice.json';

            try {
                const r = await fetch(url);
                const bitcoinData = await r.json();

                const price = bitcoinData.bpi.USD.rate_float;
                const change = price - data[0].y;
                const changeP = (price - data[0].y) / data[0].y * 100;

                setCurrentPrice(bitcoinData.bpi.USD.rate_float);
                setMonthChangeD(change.toLocaleString('us-EN', { style: 'currency', currency: 'USD' }));
                setMonthChangeP(changeP.toFixed(2) + '%');
                setUpdatedAt(bitcoinData.time.updated);

            } catch (e) {
                console.log(e);
            };
        }
        getData();
        setInterval(() => getData(), 90000);
    }, []);

    //   componentWillUnmount(){
    //     clearInterval(this.refresh);
    //   }

    return (
        <div className={styles.dataContainer}>
            { currentPrice ?
                <div className={styles.leftBox}>
                    <div className={styles.heading}>{currentPrice.toLocaleString('us-EN', { style: 'currency', currency: 'USD' })}</div>
                    <div className={styles.subtext}>{'Updated ' + dayjs(updatedAt).fromNow()}</div>
                </div>
                : null}
            { currentPrice ?
                <div className={styles.middleBox}>
                    <div className={styles.heading}>{monthChangeD}</div>
                    <div className={styles.subtext}>Change Since Last Month (USD)</div>
                </div>
                : null}
            <div className={styles.rightBox}>
                <div className={styles.heading}>{monthChangeP}</div>
                <div className={styles.subtext}>Change Since Last Month (%)</div>
            </div>

        </div>
    );
}

export default InfoBox;