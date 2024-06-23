import React from 'react';
import { Autocomplete, TextField, Box, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import teamsStore from '@/store/teams_store';

const useStyles = makeStyles({
  icon: {
    borderRadius: '50%',
    width: 30,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    color: '#fff',
    fontSize: '0.75rem',
  },
});

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 100%, 30%)`;
  return color;
};

const Icon = ({ name }) => {
  const classes = useStyles();
  const color = stringToColor(name);
  const letters = name.split(' ').slice(0, 2).map(word => word[0]).join('');
  return <div className={classes.icon} style={{ backgroundColor: color }}>{letters}</div>;
};

const TeamAutocomplete = ({ teamIds, onTeamChange }) => {
  if (!teamsStore?.teams) {
    return null;
  }

  const teamsOptions = teamsStore.teams.map(team => ({
    id: team.id,
    title: team.title,
  }));

  const [selectedTeamIds, setSelectedTeamIds] = React.useState(() => {
    return teamsOptions.filter(option => teamIds?.includes(option.id));
  });

  const handleOnChange = (_event, newValues) => {
    setSelectedTeamIds(newValues);
    onTeamChange(newValues.map(value => value.id));
  };

  return (
    <Autocomplete
      multiple
      fullWidth
      options={teamsOptions}
      getOptionLabel={(option) => option.title}
      value={selectedTeamIds}
      onChange={handleOnChange}
      renderOption={(props, option) => (
        <li {...props}>
          <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon name={option.title} />
            {option.title}
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            startAdornment: selectedTeamIds.map(team => 
              <Chip
                key={team.id}
                icon={<Icon name={team.title} />}
                label={team.title}
                onDelete={() => {
                  const newSelectedTeamIds = selectedTeamIds.filter(t => t.id !== team.id);
                  setSelectedTeamIds(newSelectedTeamIds);
                  onTeamChange(newSelectedTeamIds.map(t => t.id));
                }}
              />
            )
          }}
        />
      )}
    />
  );
};

export default TeamAutocomplete;
