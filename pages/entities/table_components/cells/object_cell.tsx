import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from "react-i18next";
import ViewCodeTableCell from "./view_code_table_cell";


const useStyles = makeStyles({
    mainContainer: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
    },
    container: {
        borderRadius: '10px', // Слегка закругленные края
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderWidth: '1px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', // Светло-серый фон
        color: '#666', // Темно-серый текст
        cursor: 'pointer',
        padding: '5px', // Добавляем немного внутренних отступов
        '&:hover': {
            backgroundColor: '#e0e0e0', // Слегка темнее при наведении
        }
    },
    copyIcon: {
        maxWidth: '100%',
        maxHeight: '100%',
        color: '#ccc',
        cursor: 'pointer',
    },
});



const ObjectCell = ({ value, property }) => {
    const classes = useStyles();
    const [openSecretDialog, setOpenSecretDialog] = useState(false);
    const [openCodeView, setOpenCodeView] = useState(false);
    const [unlockedValue, setUnlockedValue] = useState(null);
    const { t } = useTranslation();


    if (value == null) {
        return <div>-</div>
    }



    const displayValue = unlockedValue ? unlockedValue : (property?.schema?.protected ? '*****' : (value.length > 20 ? `${value.substring(0, 20)}...` : value));

    return (
        <>
            <ViewCodeTableCell
                open={openCodeView}
                onClose={() => setOpenCodeView(false)}
                currentValue={value}
                title={`${t('editor')}`}
                property={property}
            />
            <div
                style={{ display: 'flex', flexWrap: 'wrap' }}
                className={classes.mainContainer}>
                <div className={classes.container} onClick={() => {
                    if (property?.schema?.protected) {
                        if (!unlockedValue) {
                            setOpenSecretDialog(true);
                        } else {
                            setOpenCodeView(true);
                        }
                    } else {
                        setOpenCodeView(true);
                    }
                }}>
                    <Tooltip title={displayValue} placement="top">
                        <Box component="span" >
                            {displayValue}
                        </Box>
                    </Tooltip>
                </div>
            </div></>
    );
};

export default ObjectCell;
