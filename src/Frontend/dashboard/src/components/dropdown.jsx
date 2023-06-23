import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelect() {
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  useEffect(() => {
    fetch('https://rd6rmm-3000.csb.app/rastrea/ultimo-setor')
      .then((response) => response.json())
      .then((data) => {
        setDispositivos(data);
      })
      .catch((error) => {
        console.error('Erro ao obter os dados dos dispositivos:', error);
      });
  }, []);

  const names = dispositivos.map((dispositivo) => dispositivo.id_tablet);

  const getStyles = (name, personName, theme) => ({
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  });

  return (
    <div>
      <FormControl sx={{ m: 0, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Dispositivos</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Dispositivos" />}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
