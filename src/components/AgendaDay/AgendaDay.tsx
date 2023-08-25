import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {
  WithStyles,
  withStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';

import * as dateFns from 'date-fns';
import { error } from 'console';

const styles = (theme: Theme) =>
  createStyles({
    remindersContainer: {
      minHeight: '250px',
      marginTop: '10px',
    },
    closeButton: {
      position: 'absolute',
      right: '10px',
      top: '10px',
    },
    toolbarButtonHidden: {
      visibility: 'hidden',
    },
    toolbarButtonVisible: {
      visibility: 'visible',
    },
  });

interface Props extends WithStyles<typeof styles> {
  agendaStatus: {
    isOpen: boolean;
    date: Date;
  };
  onClose: () => void;
}

const AgendaDay = (props: Props) => {
  const { classes, agendaStatus, onClose } = props;
  const [reminders, setReminders] = useState([]);
  const dateTitle = agendaStatus.date
    ? dateFns.format(agendaStatus.date, 'LLLL do, yyyy')
    : 'Closing';
  const todayDate = agendaStatus.date
    ? dateFns.format(agendaStatus.date, 'yyyy-MM-dd')
    : null;
  console.dir(agendaStatus);

  console.log(todayDate);

  useEffect(() => {
    const fetchReminders = async () => {
      const response = await fetch(
        'https://reminders-92c49-default-rtdb.firebaseio.com/reminders.json'
      );
      const data = await response.json();
      console.log(data);
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

  return (
    <Dialog
      open={agendaStatus.isOpen}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle id="form-dialog-title">
        {dateTitle}
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider light />
      <DialogContent className={classes.remindersContainer}>
        {filteredReminders.map((elem) => (
          <div style={{ backgroundColor: `${elem.color}` }}>
            <Typography variant="h6" noWrap style={{ color: 'white' }}>
              {elem.body}
            </Typography>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default withStyles(styles)(AgendaDay);
