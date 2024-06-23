import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import Editor from '@monaco-editor/react';


const parseNestedJson = (obj) => {
    if (typeof obj === 'string') {
        try {
            const parsed = JSON.parse(obj);
            return parseNestedJson(parsed);
        } catch (e) {
            return obj;
        }
    } else if (typeof obj === 'object' && obj !== null) {
        const result = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = parseNestedJson(obj[key]);
            }
        }
        return result;
    }
    return obj;
};

const MonacoEditorComponent = ({ code, setCode, codeType }) => {
    const [formattedJson, setFormattedJson] = useState(code);

    useEffect(() => {
        if (codeType === 'json') {
            try {
                const parsedObject = JSON.parse(code);
                const processedObject = parseNestedJson(parsedObject);
                setFormattedJson(JSON.stringify(processedObject, null, 2));
            } catch (e) {
                console.error("Failed to parse JSON:", e);
                setFormattedJson(code); // If parsing fails, use the original code
            }
        }
    }, [code, codeType]);
     
    return (
        <Editor
            // height="auto"
            height="400px"
            defaultLanguage={codeType}
            defaultValue={codeType === 'json' ? formattedJson : code}
            value={codeType === 'json' ? formattedJson : code}
            onChange={newValue => setCode(newValue)}
            options={{
                readOnly: false,
                automaticLayout: true,
                minimap: { enabled: false }, // Отключение миникарты
                scrollbar: {
                    alwaysConsumeMouseWheel: false
                }, // Улучшение управления прокруткой
                wordWrap: 'on', // Включение переноса слов для избежания горизонтальной прокрутки
                scrollBeyondLastLine: false // Отключение прокрутки за последнюю строку
            }}
        />
    );
};

function ViewCodeTableCell({ open, onClose, title, currentValue, property }) {
    const [code, setCode] = useState({})
    const { t }: { t: any } = useTranslation();


    useEffect(() => {
        if (currentValue) {
            // Если это JSON и currentValue уже является строкой, просто используйте ее.
            // Предполагаем, что currentValue - это уже строка JSON.
            setCode(currentValue);
        } else {
            setCode('');
        }
    }, [currentValue, open]);


    const handleClose = () => {
        setCode(null);
        onClose();
    };


    return (
        <>
            <Dialog
                maxWidth={"lg"}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    p: 3,
                    minWidth: '600px', // Устанавливаем минимальную ширину
                    minHeight: '300px', // Устанавливаем минимальную высоту
                    '& .MuiDialog-container': { // Целевой класс для контейнера диалога
                        '& .MuiPaper-root': { // Целевой класс для бумажного компонента внутри диалога
                            minWidth: '600px', // Минимальная ширина для бумажного компонента
                            minHeight: '300px', // Минимальная высота для бумажного компонента
                        },
                    },
                }}
            >
                <DialogTitle id="max-width-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h3">{title}</Typography>
                    <IconButton onClick={handleClose} sx={{ color: 'grey' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <MonacoEditorComponent code={code} setCode={setCode} codeType={property?.schema?.type} />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                        color="error"
                        variant="text"
                        size="large"
                        sx={{
                            mx: 1,
                        }}
                        onClick={handleClose}
                    >
                        {t("back")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default observer(ViewCodeTableCell);
