import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import usersStore from '@/store/users_store';
import teamsStore from '@/store/teams_store';

const useStyles = makeStyles({
    singleIcon: {
        borderRadius: '50%',
        width: 30,
        height: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        color: '#fff',
        fontSize: '0.75rem',
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    multiIcon: {
        borderRadius: '50%',
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderWidth: '1px',
        width: 30,
        height: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        position: 'relative',
        cursor: 'pointer',
        marginRight: 0,
        transform: 'none',
        transition: 'transform 0.3s ease',
        overflow: 'hidden',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    hiddenTeamsContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
});

const stringToColor = (str) => {
    if (!str) return '#000'; // Default color if string is invalid
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 100%, 30%)`;
};

const getDisplayName = (item, type) => {
    return type === 'portal_team_property' ? item.title : `${item.firstName} ${item.lastName}`;
};

const getInitials = (item, type) => {
    const name = getDisplayName(item, type);
    return name.split(' ').slice(0, 2).map(word => word[0]).join('');
};

const TeamAndUsersTableCell = ({ ids, type }) => {
    const [hovered, setHovered] = useState(null);
    const data = type === 'portal_team_property' ? teamsStore?.teams?.filter(team => ids?.includes(team.id)) : usersStore?.users?.filter(user => ids?.includes(user.id));
    const classes = useStyles();

    if (!data?.length) return <span>-</span>;

    return (
        <div className={classes.container}>
            {data.length === 1 ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        className={classes.singleIcon}
                        style={{ backgroundColor: stringToColor(getDisplayName(data[0], type)) }}
                    >
                        {data[0].avatar ? (
                            <img src={data[0].avatar} alt="avatar" className={classes.avatar} />
                        ) : (
                            getInitials(data[0], type)
                        )}
                    </Box>
                    <span>{getDisplayName(data[0], type)}</span>
                </div>
            ) : (
                data.slice(0, 4).map((item, index) => (
                    <Tooltip key={item.id} title={getDisplayName(item, type)} placement="top">
                        <Box
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            className={classes.multiIcon}
                            style={{
                                backgroundColor: stringToColor(getDisplayName(item, type)),
                                transform: hovered === index ? 'translateY(-5px)' : 'none',
                            }}
                        >
                            {item.avatar ? (
                                <img src={item.avatar} alt="avatar" className={classes.avatar} />
                            ) : (
                                getInitials(item, type)
                            )}
                        </Box>
                    </Tooltip>
                ))
            )}
            {data.length > 4 && (
                <Tooltip
                    title={
                        <div className={classes.hiddenTeamsContainer}>
                            {data.slice(4).map(item => (
                                <Tooltip key={item.id} title={getDisplayName(item, type)} placement="top">
                                    <Box
                                        className={classes.singleIcon}
                                        style={{ backgroundColor: stringToColor(getDisplayName(item, type)) }}
                                    >
                                        {item.avatar ? (
                                            <img src={item.avatar} alt="avatar" className={classes.avatar} />
                                        ) : (
                                            getInitials(item, type)
                                        )}
                                    </Box>
                                </Tooltip>
                            ))}
                        </div>
                    }
                    placement="top"
                >
                    <Box
                        className={classes.multiIcon}
                        style={{
                            backgroundColor: '#ccc',
                            transform: hovered === 4 ? 'translateY(-5px)' : 'none',
                        }}
                        onMouseEnter={() => setHovered(4)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        +{data.length - 4}
                    </Box>
                </Tooltip>
            )}
        </div>
    );
};

export default TeamAndUsersTableCell;
