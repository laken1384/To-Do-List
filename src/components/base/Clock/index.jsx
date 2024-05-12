import React, { useState, useEffect } from 'react'
import classnames from 'classnames/bind';
import styles from './style.module.scss';
import dayjs from 'dayjs';
import { MdAccessAlarm } from 'react-icons/md';

const cx = classnames.bind(styles);





export default function Clock() {
    const [time, setTime] = useState(dayjs());

    useEffect(() => {
        const counter = () => setTime(time.add(1, 's'));
        const timeId = setInterval(counter, 1000);
        return () => {
            clearInterval(timeId);
        }
    }, [time])
        
    return(
        <div className={cx('clock')}>
            <div className={cx('date')}>
               {time.format('ddd, MMM DD, YYYY ')}
            </div>
            <div className={cx('time')}>
               <div className={cx('alarm-icon')}><MdAccessAlarm /></div>
               {time.format('HH:mm:ss')}
            </div>
            
        </div>
    )
}