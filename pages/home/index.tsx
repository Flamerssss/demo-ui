import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import {
    Button,
    Grid,
    Typography,
} from "@mui/material";
import Head from "next/head";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Loader from '@/components/Loader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccentSidebarLayout from '@/layouts/AccentSidebarLayout';


const HomePage = () => {
    const { t }: { t: any } = useTranslation();


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('');

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (value: string) => {
        setSelectedValue(value);
        setDialogOpen(true);
        handleClose();
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };


    const menuItems = [
        // { title: 'number_chart', value: 'number_chart' },
        { title: t('pie_chart'), value: 'pie_chart' },
        { title: t('markdown'), value: 'markdown' },
        { title: t('iframe'), value: 'iframe' },
        { title: t('table'), value: 'table' },
        // Добавьте больше пунктов по необходимости
    ];



    // const layout = [
    //     { i: 'a', x: 0, y: 0, w: 4, h: 4 },
    //     // Добавьте другие элементы сюда
    // ];


    // Обработчик окончания перемещения карточки
    const onDragStop = (layout) => {
        // layout содержит данные о расположении всех карточек после перемещения

    };

    // Обработчик окончания изменения размера карточки
    const onResizeStop = (layout) => {
        // layout содержит данные о расположении и размерах всех карточек после изменения размера

    };



    const [layoutData, setLayoutData] = useState(null);

    useEffect(() => {
        // Предположим, что у dashboardsStore есть метод для асинхронной загрузки данных
        const loadData = async () => {

        };

        loadData();
    }, [setLayoutData]); // Пустой массив зависимостей гарантирует, что эффект запустится только при монтировании компонента

    // Проверяем, загружены ли данные
    if (!layoutData) {
        return <Loader></Loader>; // Или любой другой индикатор загрузки
    }

    return (
        <>
            <Head>
                <title>{t('Welcome')}</title>
            </Head>
            <PageTitleWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            {t('Welcome')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            sx={{ mt: { xs: 2, sm: 0 } }}
                            onClick={handleClick}
                            endIcon={<ExpandMoreIcon />}
                            variant="contained"
                            startIcon={<AddTwoToneIcon fontSize="small" />}
                        >
                            {t('add')}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {menuItems.map((item) => (
                                <MenuItem key={item.value} onClick={() => handleMenuItemClick(item.value)}>
                                    {item.title}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <GridLayout
                className="layout"
                cols={12}
                rowHeight={30}
                width={600}
                layout={layoutData?.map(card => ({
                    i: card.id.toString(),
                    x: card.x,
                    y: card.y,
                    w: card.w,
                    h: card.h,
                    static: card.static,
                }))}
                draggableHandle=".drag-handle"
                onDragStop={onDragStop}
                onResizeStop={onResizeStop}
            >
                {layoutData?.map(card => (
                    <div key={card.id}>

                    </div>
                ))}
            </GridLayout >
        </>
    );
};


HomePage.getLayout = (page) => (
    <AccentSidebarLayout>{page}</AccentSidebarLayout>
);

export default observer(HomePage);