import React, { useState, useEffect } from 'react';
import { IconButton, Autocomplete, TextField, Paper, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import iconsData from './iconsData';

const IconPicker = ({ selectedIcon, onIconSelect }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedIconSvg, setSelectedIconSvg] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (selectedIcon) {
            const icon = iconsData.find(icon => icon.id === selectedIcon);
            if (icon) {
                setSelectedIconSvg(icon.svg);
            }
        } else {
            setSelectedIconSvg(null);
            setInputValue(''); // Очищаем значение в input, если иконка не выбрана
        }
    }, [selectedIcon]);

    const handleIconClick = (option) => {
        onIconSelect(option ? option.id : null);
        setSelectedIconSvg(option ? option.svg : null);
        setInputValue(''); // Очищаем значение в input при выборе иконки
        setMenuOpen(false);
    };

    const renderIcon = (option) => (
        <Tooltip title={option.id} placement="top">
            <IconButton onClick={() => handleIconClick(option)}>
                <div dangerouslySetInnerHTML={{ __html: option.svg }} style={{ fontSize: '24px' }} />
            </IconButton>
        </Tooltip>
    );

    const PaperComponent = (props) => (
        <Paper {...props} style={{ display: 'flex', flexWrap: 'wrap', padding: 8, overflowY: 'auto' }}>
            {props.children}
        </Paper>
    );

    return (
        <Autocomplete
            open={menuOpen}
            onOpen={() => setMenuOpen(true)}
            onClose={() => setMenuOpen(false)}
            value={iconsData.find(icon => icon.id === selectedIcon)}
            onChange={(_event, newValue) => {
                handleIconClick(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(_event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={iconsData}
            //@ts-ignore
            getOptionLabel={(option) => option.id}
            fullWidth
            renderOption={(_props, option) => renderIcon(option)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Выбрать иконку"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: selectedIconSvg ? (
                            <div dangerouslySetInnerHTML={{ __html: selectedIconSvg }} style={{ fontSize: '24px' }} />
                        ) : null,
                        endAdornment: (
                            <>
                                {selectedIcon && (
                                    <IconButton onClick={() => handleIconClick(null)}>
                                        <ClearIcon />
                                    </IconButton>
                                )}
                            </>
                        ),
                    }}
                />
            )}
            PaperComponent={PaperComponent}
        />
    );
};

export default IconPicker;
