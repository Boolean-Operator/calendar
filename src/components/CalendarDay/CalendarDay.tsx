import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

import Avatar from '@material-ui/core/Avatar';
import deepPurple from '@material-ui/core/colors/deepPurple';
import {
  WithStyles,
  withStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import { isSameMonth, isSameDay, getDate } from 'date-fns';
import { List, ListItem, Typography } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    dayCell: {
      display: 'flex',
      flex: '1 0 13%',
      flexDirection: 'column',
      border: '1px solid lightgray',
      cursor: 'pointer',
    },
    dayCellOutsideMonth: {
      display: 'flex',
      flex: '1 0 13%',
      flexDirection: 'column',
      border: '1px solid lightgray',
      backgroundColor: 'rgba( 211, 211, 211, 0.4 )',
      cursor: 'pointer',
    },
    dateNumber: {
      margin: 5,
      height: '28px',
      width: '28px',
      fontSize: '0.85rem',
      color: '#000',
      backgroundColor: 'transparent',
    },
    todayAvatar: {
      margin: 5,
      height: '28px',
      width: '28px',
      fontSize: '0.85rem',
      color: '#fff',
      backgroundColor: deepPurple[400],
    },
    focusedAvatar: {
      margin: 5,
      height: '28px',
      width: '28px',
      fontSize: '0.85rem',
      color: '#000',
      backgroundColor: '#f1f1f1',
    },
    focusedTodayAvatar: {
      margin: 5,
      height: '28px',
      width: '28px',
      fontSize: '0.85rem',
      color: '#fff',
      backgroundColor: deepPurple[800],
    },
    remindersContainer: {
      height: '100%',
    },
  });

interface DateObj {
  date: Date;
}

interface Props extends WithStyles<typeof styles> {
  calendarDate: Date;
  dateObj: DateObj;
  onDayClick: (dateObj: DateObj) => void;
}

const CalendarDay = (props: Props) => {
  const { classes, dateObj, calendarDate, onDayClick } = props;
  const [focused, setFocused] = useState(false);
  const [reminders, setReminders] = useState([]);

  const todayDate = format(dateObj.date, 'yyyy-MM-dd');

  useEffect(() => {
    const fetchReminders = async () => {
      const response = await fetch(
        'https://reminders-92c49-default-rtdb.firebaseio.com/reminders.json'
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error('There was a problem locating the Data, Michael.');
      }

      const loadedReminders = [];
      for (const key in data) {
        const reminderObj = {
          id: key,
          body: data[key].body,
          date: data[key].date,
          time: data[key].time,
          color: data[key].color,
        };
        loadedReminders.push(reminderObj);
      }
      console.log(loadedReminders);
      setReminders(loadedReminders);
    };
    fetchReminders();
    // add error catch
  }, []);

  const filteredReminders = reminders.filter((elem) => elem.date == todayDate);
  console.log(filteredReminders);

  const isToday = isSameDay(dateObj.date, new Date());
  const avatarClass =
    isToday && focused
      ? classes.focusedTodayAvatar
      : isToday
      ? classes.todayAvatar
      : focused
      ? classes.focusedAvatar
      : classes.dateNumber;

  const onMouseOver = () => setFocused(true);
  const onMouseOut = () => setFocused(false);

  return (
    <div
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={() => onDayClick(dateObj)}
      className={
        isSameMonth(dateObj.date, calendarDate)
          ? classes.dayCell
          : classes.dayCellOutsideMonth
      }
    >
      <Avatar className={avatarClass}>{getDate(dateObj.date)}</Avatar>
      <div className={classes.remindersContainer}>
        {filteredReminders.map((elem) => (
          <div style={{ backgroundColor: `${elem.color}` }}>
            <Typography variant="h6" noWrap style={{ color: 'white' }}>
              {elem.body}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withStyles(styles)(CalendarDay);
