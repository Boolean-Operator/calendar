import React, { useState } from 'react';
import { format } from 'date-fns';

import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Icon,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';

import { WithStyles, withStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flextDireaction: 'row',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  formControl: {
    margin: '20px',
  },
  group: {
    margin: '10px',
  },
});

interface Props extends WithStyles<typeof styles> {
  onCloseHandler: () => void;
}

function NewReminderForm(props: Props) {
  const { classes, onCloseHandler } = props;
  const now = format(new Date(), 'yyyy-MM-dd');
  const startTime = format(8, 'HH:mm');
  const [enteredBody, setEnteredBody] = useState('');
  const [enteredDate, setEnteredDate] = useState(now);
  const [enteredTime, setEnteredTime] = useState(startTime);
  const [enteredColor, setEnteredColor] = useState('green');

  function bodyChangeHandler(e) {
    setEnteredBody(e.target.value);
  }
  function dateChangeHandler(e) {
    setEnteredDate(e.target.value);
  }
  function timeChangeHandler(e) {
    console.log(e.target.value);
    setEnteredTime(e.target.value);
  }

  function colorChangeHandler(
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) {
    setEnteredColor(value);
  }

  function submitHandler(event) {
    event.preventDefault();
    // const reminderData = {
    //   date: enteredDate,
    //   time: enteredTime,
    //   body: enteredBody,
    //   color: enteredColor,
    // };
    fetch(
      'https://reminders-92c49-default-rtdb.firebaseio.com/reminders.json',
      {
        method: 'POST',
        body: JSON.stringify({
          date: enteredDate,
          time: enteredTime,
          body: enteredBody,
          color: enteredColor,
        }),
      }
    );

    onCloseHandler();
  }

  return (
    <form onSubmit={submitHandler}>
      <div className={classes.container}>
        <TextField
          id="date"
          label="Date"
          type="date"
          className={classes.textField}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{ min: now }}
          onChange={dateChangeHandler}
          value={enteredDate}
        />
        <TextField
          id="time"
          label="Reminder time"
          type="time"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          value={enteredTime}
          onChange={timeChangeHandler}
        />
      </div>
      <div className={classes.container}>
        <TextField
          id="outlined-full-width"
          label="Reminder"
          style={{ margin: 8, width: '40%' }}
          placeholder="Add body text"
          helperText="Max length is 30 characters"
          required
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{ maxLength: 30 }}
          onChange={bodyChangeHandler}
          value={enteredBody}
        />
        <FormControl className={classes.formControl}>
          <FormLabel>Color</FormLabel>
          <RadioGroup
            row
            aria-label="Gender"
            name="gender1"
            className={classes.group}
            value={enteredColor}
            onChange={colorChangeHandler}
          >
            <FormControlLabel
              value="red"
              control={<Radio style={{ color: 'red' }} />}
              label="Red"
            />
            <FormControlLabel
              value="orange"
              control={<Radio style={{ color: 'orange' }} />}
              label="Orange"
            />
            <FormControlLabel
              value="green"
              control={<Radio style={{ color: 'green' }} />}
              label="Green"
            />
          </RadioGroup>
          <Button type="submit" variant="contained" color="primary">
            Set Reminder
          </Button>
        </FormControl>
      </div>
    </form>
  );
}

export default withStyles(styles)(NewReminderForm);
