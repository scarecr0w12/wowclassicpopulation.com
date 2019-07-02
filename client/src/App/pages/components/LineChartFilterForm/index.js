import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  slider: {
    width: 300
  },
  button: {
    '&:hover': {
      color: '#DC143C',
      textShadow: '0 0 1px hsl(0, 0%, 40%)'
    }
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 150
  },
  outlinedPrimary: {
    border: '1px solid #D7CB83',
    color: '#D7CB83',
    '&:hover': {
      border: '1px solid #000',
      textShadow: '0 0 1px black',
      color: '#9ACD32',
      backgroundColor: 'rgba(233, 135, 70, 0.08);'
    }
  }
}));

export default function FilterForm({ realmOptions, onChange }) {
  const classes = useStyles();

  const [selectedRealm, setSelectedRealm] = React.useState([]);
  const [selectedDateFrom, setSelectedDateFrom] = React.useState('');
  const [selectedDateTo, setSelectedDateTo] = React.useState('');

  function handleRealmChange(event) {
    setSelectedRealm(event.target.value);
  }

  function handleDateFromChange(event) {
    const newDateFrom = event.target.value;
    // switch the fields if dateTo < dateFrom
    if (selectedDateTo !== '' && new Date(selectedDateTo) < new Date(newDateFrom)) {
      setSelectedDateFrom(selectedDateTo);
      setSelectedDateTo(newDateFrom);
    } else {
      setSelectedDateFrom(newDateFrom);
    }
  }

  function handleDateToChange(event) {
    const newDateTo = event.target.value;
    // switch the fields if dateFrom >  dateTo
    if (selectedDateFrom !== '' && new Date(selectedDateFrom) > new Date(newDateTo)) {
      setSelectedDateTo(selectedDateFrom);
      setSelectedDateFrom(newDateTo);
    } else {
      setSelectedDateTo(newDateTo);
    }
  }

  function handleResetClick() {
    setSelectedRealm([]);
    setSelectedDateFrom('');
    setSelectedDateTo('');
    onChange({});
  }

  function handleApplyClick() {
    const query = {};
    if (selectedRealm !== []) {
      query.realm = selectedRealm.map(realm => realm.label);
    }
    if (selectedDateFrom !== '') {
      query.dateFrom = selectedDateFrom;
    }
    if (selectedDateTo !== '') {
      query.dateTo = selectedDateTo;
    }
    onChange(query);
  }

  function handlePreset(event) {
    const preset = event.target.name;
    if (preset === 'bothBetaStart') {
      const pveIndex = realmOptions.findIndex(find => find.value === '4618_classic_beta_pve');
      const pveObj = realmOptions[pveIndex];
      const pvpIndex = realmOptions.findIndex(find => find.value === '4619_classic_beta_pvp');
      const pvpObj = realmOptions[pvpIndex];
      setSelectedRealm([pveObj, pvpObj]);
      setSelectedDateFrom('2019-06-20');
      setSelectedDateTo('');
    } else if (preset === 'avTest') {
      const alteracIndex = realmOptions.findIndex(find => find.value === '4620_field_of_strife');
      const alteracObj = realmOptions[alteracIndex];
      setSelectedRealm([alteracObj]);
      setSelectedDateFrom('');
      setSelectedDateTo('');
    } else if (preset === 'allStressTest') {
      const stress2Index = realmOptions.findIndex(find => find.value === '9902_classic_realm_2');
      const stress2Obj = realmOptions[stress2Index];
      const stress3Index = realmOptions.findIndex(find => find.value === '9903_classic_realm_3');
      const stress3Obj = realmOptions[stress3Index];
      const stress12Index = realmOptions.findIndex(find => find.value === '9912_classic_realm_12');
      const stress12Obj = realmOptions[stress12Index];
      const stress15Index = realmOptions.findIndex(find => find.value === '9915_classic_realm_15');
      const stress15Obj = realmOptions[stress15Index];
      setSelectedRealm([stress2Obj, stress3Obj, stress12Obj, stress15Obj]);
      setSelectedDateFrom('');
      setSelectedDateTo('');
    }
  }

  return (
    <form className={classes.root} autoComplete="ON">
      <div className="form-wrapper box-wrapper filter-form">
        <p>Filter presets you may find interesting</p>
        <ul>
          <li>
            <button type="button" className="list" name="bothBetaStart" onClick={handlePreset}>
              Both beta realms from 2019-06-20 (project start)
            </button>
          </li>
          <li>
            <button type="button" className="list" name="avTest" onClick={handlePreset}>
              Alterac Valley Test
            </button>
          </li>
          <li>
            <button type="button" className="list" name="allStressTest" onClick={handlePreset}>
              All stress test realms
            </button>
          </li>
        </ul>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="realm-filter">Realm</InputLabel>
            <Select
              multiple
              value={selectedRealm}
              onChange={handleRealmChange}
              renderValue={selected => selected.map(element => element.labelClean).join(', ')}
              input={<Input id="realm-filter" name="realm" />}
              MenuProps={MenuProps}
            >
              {realmOptions.map(element => (
                <MenuItem key={element.value} value={element}>
                  <Checkbox checked={selectedRealm.indexOf(element) > -1} />
                  <ListItemText primary={element.labelClean} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{ marginBottom: 10 }}>
          <TextField
            id="dateFrom"
            label="From"
            type="date"
            value={selectedDateFrom}
            onChange={handleDateFromChange}
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            id="dateTo"
            label="To"
            type="date"
            value={selectedDateTo}
            onChange={handleDateToChange}
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />
        </div>
        <div>
          <Button className={classes.button} onClick={handleResetClick}>
            Reset
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={classes.outlinedPrimary}
            onClick={handleApplyClick}
          >
            Apply filter
          </Button>
        </div>
      </div>
    </form>
  );
}
