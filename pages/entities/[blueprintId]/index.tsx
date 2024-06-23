import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  Popover,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  TableHead,
  IconButton,
  Collapse,
} from "@mui/material";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { observer } from "mobx-react-lite";
import { reaction } from "mobx";
import { useRouter } from "next/router";
import iconsData from "@/components/IconPicker/iconsData";
import EntityTableCell from "../table_components/table_cell";
import snackbar from "@/components/Snackbars/Snackbar";
import { makeStyles } from "@mui/styles";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";

const useStyles = makeStyles({
  tableRow: {
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    flexWrap: "nowrap",
  },
  tableContainer: {
    overflowX: "auto",
    maxHeight: 'calc(100vh - 310px)',
  },
  table: {
    minWidth: 750,
  },
  stickyHeader: {
    position: "sticky",
    top: 0,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  tableHeadContainer: {
    overflowX: 'hidden',
    position: 'relative',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  searchInput: {
    flex: 1,
    marginRight: '16px',
    maxWidth: '300px',
  },
  iconButton: {
    marginLeft: '8px',
  },
});

const ColumnSettings = ({ columns, onChange, storageKey }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (column) => {
    const updatedColumns = columns.map((col) =>
      col.id === column.id ? { ...col, hidden: !col.hidden } : col
    );
    onChange(updatedColumns);
  };

  const open = Boolean(anchorEl);
  const id = open ? "column-settings-popover" : undefined;

  return (
    <div>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        className={classes.iconButton}
      >
        <SettingsIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <FormGroup style={{ padding: "1rem" }}>
          {columns.map((column) => (
            <FormControlLabel
              key={column.id}
              control={
                <Checkbox
                  checked={!column.hidden}
                  onChange={() => handleToggle(column)}
                />
              }
              label={column.label}
            />
          ))}
        </FormGroup>
      </Popover>
    </div>
  );
};

const GroupBySettings = ({ properties, groupBy, onChange, storageKey, sx }) => {
  const { t } = useTranslation();

  const handleChange = (e) => {
    onChange(e.target.value);
    localStorage.setItem(storageKey, e.target.value);
  };

  return (
    <Select
      value={groupBy}
      onChange={handleChange}
      displayEmpty
      sx={sx}
    >
      <MenuItem value="">
        {t("None")}
      </MenuItem>
      {properties.map((property) => (
        <MenuItem key={property.id} value={property.id}>
          {property.title}
        </MenuItem>
      ))}
    </Select>
  );
};

const EnhancedTableHead = (props) => {
  const classes = useStyles();
  const { order, orderBy, onRequestSort, columns } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const getIconSvg = (iconId) => {
    const matchingIcon = iconsData.find((icon) => icon.id === iconId);
    return matchingIcon ? matchingIcon.svg : null;
  };

  return (
    <Droppable droppableId="droppable-columns" direction="horizontal">
      {(provided) => (
        <TableHead
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={classes.stickyHeader}
        >
          <TableRow className={classes.tableRow}>
            {columns.map((column, index) => (
              !column.hidden && ( // добавляем условие для скрытия заголовков
                <Draggable key={column.id} draggableId={column.id} index={index}>
                  {(provided) => (
                    <TableCell
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      align={column.align}
                      sortDirection={orderBy === column.id ? order : false}
                      className={classes.tableRow}
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={createSortHandler(column.id)}
                      >
                        {column.iconId && (
                          <Box
                            sx={{
                              mr: 1,
                              display: "inline",
                              "& svg": {
                                verticalAlign: "middle",
                                width: 15,
                                height: 15,
                              },
                            }}
                            dangerouslySetInnerHTML={{ __html: getIconSvg(column.iconId) }}
                          />
                        )}
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  )}
                </Draggable>
              )
            ))}
            {provided.placeholder}
          </TableRow>
        </TableHead>
      )}
    </Droppable>
  );
};



const applyFilters = (entities, query) => {
  return entities?.filter((entity) => {
    if (query) {
      const queryLower = query.toLowerCase();
      return ["id", "title", "team"].some(
        (property) =>
          entity[property] && entity[property].toLowerCase().includes(queryLower)
      );
    }
    return true;
  });
};

const GroupedTableBody = ({ entities, properties, groupBy, columns, setDialogEntity }) => {
  const [openGroups, setOpenGroups] = useState({});

  const handleToggleGroup = (group) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const groupedEntities = groupBy
    ? _.groupBy(entities, (entity) => {
      const property = entity.properties.find((p) => p.property?.id === groupBy);
      return property ? property.value : "Ungrouped";
    })
    : { all: entities };

  const getGroupTitle = (groupValue) => {
    const property = properties.find((p) => p.id === groupBy);
    if (!property || !property.schema) return groupValue;

    const schemaValue = property.schema[groupValue];
    return schemaValue ? schemaValue.value : groupValue;
  };

  return (
    <>
      {Object.keys(groupedEntities).map((group) => (
        group !== "Ungrouped" && (
          <React.Fragment key={group}>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box display="flex" alignItems="center">
                  <Typography variant="h6">{getGroupTitle(group)}</Typography>
                  <IconButton size="small" onClick={() => handleToggleGroup(group)}>
                    {openGroups[group] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={columns.length} style={{ padding: 0 }}>
                <Collapse in={openGroups[group]} timeout="auto" unmountOnExit>
                  <Table>
                    <TableBody>
                      {groupedEntities[group].map((entity) => (
                        <EntityTableCell
                          key={entity.id}
                          entity={entity}
                          properties={properties}
                          columns={columns} // Передача всех столбцов
                          setDialogEntity={setDialogEntity}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        )
      ))}
    </>
  );
};

function EntitiesView() {
  const classes = useStyles();
  const router = useRouter();
  const blueprint_id = router.query.blueprintId;
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [properties, setProperties] = useState([
    {
      "id": "0468048b-a872-460c-8972-59b26cf30afe",
      "title": "Body",
      "icon": null,
      "identifier": "Body",
      "description": null,
      "required": true,
      "many": false,
      "type": "object_property",
      "orderIndex": 0,
      "isRelation": false,
      "isMirror": false,
      "schema": {
        "type": "json",
        "protected": false
      },
      "createdAt": "2024-06-18T22:33:33.463Z",
      "updatedAt": "2024-06-18T22:36:42.501Z",
      "action": null,
      "blueprint": {
        "id": "6f03323a-00f0-47db-b5bb-55ebdadaaf46",
        "title": "ConfigMaps",
        "icon": "k8s",
        "identifier": "ConfigMaps",
        "type": "custom",
        "description": null,
        "x": 3801.7699136083766,
        "y": 210.67121275927138,
        "createdAt": "2024-06-18T19:48:14.591Z",
        "updatedAt": "2024-06-19T19:07:35.799Z",
        "index": 2
      }
    },
  ],
  );
  const [dialogEntity, setDialogEntity] = useState(false);
  const { showError } = snackbar();
  const [groupBy, setGroupBy] = useState("");

  const storageKeyColumns = `columns_${blueprint_id}`;
  const storageKeyGroupBy = `groupBy_${blueprint_id}`;

  const defaultColumns = [
    { id: "title", label: t("title"), numeric: false, align: "left" },
    ...properties.map((property) => ({
      id: property.title,
      label: property.title,
      numeric: property.type === "number_property",
      align: "left",
      iconId: property.icon,
    })),
    { id: "updatedAt", label: t("last_update"), numeric: false, align: "left" },
    { id: "actions", label: t("actions"), numeric: false, align: "right" },
  ];

  const [columns, setColumns] = useState(defaultColumns);

  const handleColumnsChange = (updatedColumns) => {
    setColumns(updatedColumns);
    localStorage.setItem(storageKeyColumns, JSON.stringify(updatedColumns));
  };

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
    window.sessionStorage.setItem("entitiesearchQuery", event.target.value);
  };


  const handleOnDragEndColumns = (result) => {
    if (!result.destination) return;

    const items = Array.from(columns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setColumns(items);
    localStorage.setItem(storageKeyColumns, JSON.stringify(items));
  };


  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("data");
  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };





  const blueprint = {
    "id": "6f03323a-00f0-47db-b5bb-55ebdadaaf46",
    "title": "ConfigMaps",
    "icon": "k8s",
    "identifier": "ConfigMaps",
    "type": "custom",
    "description": null,
    "x": 3801.7699136083766,
    "y": 210.67121275927138,
    "createdAt": "2024-06-18T19:48:14.591Z",
    "updatedAt": "2024-06-19T19:07:35.799Z",
    "index": 2,
    "company": {
      "id": "2c2b889e-4d4a-4a32-a0ee-d61ba36be863",
      "name": "TestCompany"
    },
    "createdBy": {
      "id": "251f4692-e230-4d38-af72-a90a24d15549",
      "username": "test",
      "firstName": "Viktor",
      "lastName": "Volodin",
      "email": "test@test.com",
      "role": "admin",
      "avatar": null,
      "status": "active",
      "positionId": "test"
    },
    "updatedBy": {
      "id": "251f4692-e230-4d38-af72-a90a24d15549",
      "username": "test",
      "firstName": "Viktor",
      "lastName": "Volodin",
      "email": "test@test.com",
      "role": "admin",
      "avatar": null,
      "status": "active",
      "positionId": "test"
    }
  }


  const entities = [
    {
      "id": "8766a8a5-6b7c-4392-a13e-297a1104edb7",
      "title": "mdm-event-cm",
      "icon": "k8s",
      "identifier": "mdm-event-cm-DEV",
      "team": null,
      "createdAt": "2024-06-19T16:09:20.266Z",
      "updatedAt": "2024-06-19T23:15:23.900Z",
      "blueprint": {
        "id": "6f03323a-00f0-47db-b5bb-55ebdadaaf46",
        "title": "ConfigMaps",
        "icon": "k8s",
        "identifier": "ConfigMaps",
        "type": "custom",
        "description": null,
        "x": 3801.7699136083766,
        "y": 210.67121275927138,
        "createdAt": "2024-06-18T16:48:14.591Z",
        "updatedAt": "2024-06-19T16:07:35.799Z"
      },
      "properties": [
        {
          "id": "af6edb6f-8465-4409-9149-bba679ab1788",
          "entityId": "8766a8a5-6b7c-4392-a13e-297a1104edb7",
          "value": "8bafb6cc-9a21-4323-a127-143ca986abb1",
          "isRelation": true,
          "isMirror": false,
          "identifier": "Stand_cm",
          "property": {
            "id": "2f6401d8-2fa3-4aea-b92f-193f9feaa9b3",
            "title": "Стенд",
            "icon": "instance",
            "description": "null",
            "required": true,
            "many": true,
            "type": "entity_property",
            "isRelation": true,
            "isMirror": false,
            "schema": [
              {
                "id": "8bafb6cc-9a21-4323-a127-143ca986abb1",
                "title": "mdm"
              }
            ],
            "createdAt": "2024-06-18T19:31:08.566Z",
            "updatedAt": "2024-06-19T23:15:30.179Z",
            "blueprint": null,
            "action": null,
            "identifier": "Stand_cm"
          },
          "relation": {
            "id": "2f6401d8-2fa3-4aea-b92f-193f9feaa9b3",
            "title": "Стенд",
            "identifier": "Stand_cm",
            "description": "null",
            "required": true,
            "many": true,
            "createdAt": "2024-06-18T19:31:08.566Z",
            "updatedAt": "2024-06-19T16:07:46.016Z",
            "source": {
              "id": "6f03323a-00f0-47db-b5bb-55ebdadaaf46",
              "title": "ConfigMaps",
              "icon": "k8s",
              "identifier": "ConfigMaps",
              "type": "custom",
              "description": null,
              "x": 3801.7699136083766,
              "y": 210.67121275927138,
              "createdAt": "2024-06-18T16:48:14.591Z",
              "updatedAt": "2024-06-19T16:07:35.799Z"
            },
            "target": {
              "id": "7821289d-c1b5-4b78-8351-6472d0d9a00e",
              "title": "Стенды",
              "icon": "instance",
              "identifier": "Stendy",
              "type": "custom",
              "description": null,
              "x": 554.7533292676524,
              "y": -636.3377847912177,
              "createdAt": "2024-06-11T10:15:46.158Z",
              "updatedAt": "2024-06-18T17:46:53.280Z"
            }
          }
        },
        {
          "id": "f2f59687-c973-433f-8036-c4f4ed1bebb8",
          "entityId": "8766a8a5-6b7c-4392-a13e-297a1104edb7",
          "value": "{\"appsettings.json\":\"{\\n  \\\"MdmEventsDB\\\": {\\n    \\\"ConnectionString\\\": \\\"Host=svc-mdm-postgres;Port=5432;Database=mdm_events;Username=mdm;Password=navicon123;Include Error Detail=true;Log Parameters=true;Maximum Pool Size=1000;Application Name=mdm-evt\\\",\\n    \\\"DataBaseProvider\\\": \\\"PgSql\\\"\\n  },\\n  \\\"Kestrel\\\": {\\n    \\\"Limits\\\": {\\n      \\\"MaxRequestBodySize\\\": null,\\n      \\\"MaxConcurrentConnections\\\": 200,\\n      \\\"KeepAliveTimeout\\\": { \\\"Minutes\\\": 120 },\\n      \\\"MinRequestBodyDataRate\\\": {\\n        \\\"BytesPerSecond\\\": 100,\\n        \\\"GracePeriod\\\": { \\\"Seconds\\\": 10 }\\n      },\\n      \\\"MinResponseDataRate\\\": {\\n        \\\"BytesPerSecond\\\": 100,\\n        \\\"GracePeriod\\\": { \\\"Seconds\\\": 10 }\\n      }\\n    }\\n  },\\n  \\\"ServiceBus\\\": {\\n    \\\"AzureServiceBusConnection\\\": \\\"\\\",\\n    \\\"UseAzureServiceBus\\\": false,\\n    \\\"RabbitMqConnection\\\": \\\"host=svc-rabbitmq;VirtualHost=mdm;username=mdm;password=123456;UseTls=false\\\",\\n    \\\"UseAudit\\\": true\\n  },\\n  \\\"AuthType\\\": \\\"Anonymous\\\",\\n  \\\"HostType\\\": \\\"Self\\\",\\n  \\\"EnableSensitiveDataLogging\\\": true,\\n  \\\"MaxUnsyncRecordsCount\\\": 1000,\\n  \\\"Logging\\\": {\\n    \\\"LogLevel\\\": {\\n      \\\"Default\\\": \\\"Debug\\\"\\n    },\\n    \\\"NLog\\\": {\\n      \\\"IncludeScopes\\\": true,\\n      \\\"RemoveLoggerFactoryFilter\\\": true\\n    }\\n  },\\n  \\\"NLog\\\": {\\n    \\\"autoReload\\\": true,\\n    \\\"throwConfigExceptions\\\": true,\\n    \\\"internalLogLevel\\\": \\\"Info\\\",\\n    \\\"internalLogFile\\\": \\\"${basedir}/internal-nlog.txt\\\",\\n    \\\"extensions\\\": [{ \\\"assembly\\\": \\\"NLog.Web.AspNetCore\\\" }],\\n    \\\"variables\\\": {\\n      \\\"var_logdir\\\": \\\"c:/mdm/svc/logs\\\",\\n      \\\"var_serviceName\\\": \\\"mdm-evt\\\"\\n    },\\n    \\\"time\\\": {\\n      \\\"type\\\": \\\"AccurateUTC\\\"\\n    },\\n    \\\"default-wrapper\\\": {\\n      \\\"type\\\": \\\"AsyncWrapper\\\",\\n      \\\"overflowAction\\\": \\\"Block\\\"\\n    },\\n    \\\"targets\\\": {\\n      \\\"file\\\": {\\n        \\\"type\\\": \\\"File\\\",\\n        \\\"fileName\\\": \\\"${var_logdir}/${var_serviceName}.log\\\",\\n        \\\"layout\\\": \\\"${longdate}|${event-properties:item=EventId.Id}|${uppercase:${level}}|${logger}|${message} ${exception:format=tostring}|url: ${aspnet-request-url}|action: ${aspnet-mvc-action}\\\",\\n        \\\"archiveFileName\\\": \\\"${var_logdir}/${var_serviceName}/${var_serviceName}.{#}.log.gz\\\",\\n        \\\"archiveEvery\\\": \\\"Day\\\",\\n        \\\"archiveNumbering\\\": \\\"Rolling\\\",\\n        \\\"archiveDateFormat\\\": \\\"yyyyMMdd\\\",\\n        \\\"enableArchiveFileCompression\\\": \\\"true\\\",\\n        \\\"maxArchiveFiles\\\": \\\"7\\\",\\n        \\\"concurrentWrites\\\": \\\"true\\\",\\n        \\\"keepFileOpen\\\": \\\"false\\\"\\n      },\\n      \\\"console\\\": {\\n        \\\"type\\\": \\\"ColoredConsole\\\",\\n        \\\"layout\\\": \\\"${MicrosoftConsoleLayout}\\\",\\n        \\\"rowHighlightingRules\\\": [\\n          {\\n            \\\"condition\\\": \\\"level == LogLevel.Error\\\",\\n            \\\"foregroundColor\\\": \\\"Red\\\"\\n          },\\n          {\\n            \\\"condition\\\": \\\"level == LogLevel.Fatal\\\",\\n            \\\"foregroundColor\\\": \\\"Red\\\",\\n            \\\"backgroundColor\\\": \\\"White\\\"\\n          }\\n        ],\\n        \\\"wordHighlightingRules\\\": [\\n          {\\n            \\\"regex\\\": \\\"on|off\\\",\\n            \\\"foregroundColor\\\": \\\"DarkGreen\\\"\\n          },\\n          {\\n            \\\"condition\\\": \\\"level == LogLevel.Debug\\\",\\n            \\\"text\\\": \\\"[TEST]\\\",\\n            \\\"foregroundColor\\\": \\\"Blue\\\"\\n          }\\n        ]\\n      }\\n    },\\n    \\\"rules\\\": [\\n      {\\n        \\\"logger\\\": \\\"Program\\\",\\n        \\\"minLevel\\\": \\\"Info\\\",\\n        \\\"maxLevel\\\": \\\"Warning\\\",\\n        \\\"writeTo\\\": \\\"file\\\"\\n      },\\n      {\\n        \\\"logger\\\": \\\"Navicon.*\\\",\\n        \\\"minLevel\\\": \\\"Debug\\\",\\n        \\\"maxLevel\\\": \\\"Warning\\\",\\n        \\\"writeTo\\\": \\\"file\\\"\\n      },\\n      {\\n        \\\"logger\\\": \\\"Navicon.*\\\",\\n        \\\"minLevel\\\": \\\"Info\\\",\\n        \\\"maxLevel\\\": \\\"Warning\\\",\\n        \\\"writeTo\\\": \\\"console\\\"\\n      },\\n      {\\n        \\\"logger\\\": \\\"*\\\",\\n        \\\"minLevel\\\": \\\"Error\\\",\\n        \\\"writeTo\\\": \\\"file, console\\\"\\n      },\\n      {\\n        \\\"logger\\\": \\\"Microsoft.Hosting.Lifetime\\\",\\n        \\\"minLevel\\\": \\\"Info\\\",\\n        \\\"writeTo\\\": \\\"console\\\",\\n        \\\"final\\\": true\\n      },\\n      {\\n        \\\"logger\\\": \\\"Microsoft.*\\\",\\n        \\\"minLevel\\\": \\\"Info\\\",\\n        \\\"maxLevel\\\": \\\"Warning\\\",\\n        \\\"writeTo\\\": \\\"console\\\",\\n        \\\"final\\\": true\\n      }\\n    ]\\n  }\\n}\\n\"}",
          "isRelation": false,
          "isMirror": false,
          "identifier": "Body",
          "property": {
            "id": "0468048b-a872-460c-8972-59b26cf30afe",
            "title": "Body",
            "icon": null,
            "identifier": "Body",
            "description": null,
            "required": true,
            "many": false,
            "type": "object_property",
            "isRelation": false,
            "isMirror": false,
            "schema": {
              "type": "json",
              "protected": false
            },
            "createdAt": "2024-06-18T19:33:33.463Z",
            "updatedAt": "2024-06-18T19:36:42.501Z"
          },
          "relation": null
        }
      ]
    },
    {
      "id": "cb7c5306-a06d-41da-b228-571b34d246ee",
      "title": "mdm-api-cm",
      "icon": "k8s",
      "identifier": "mdm-api-cm-DEV",
      "team": null,
      "createdAt": "2024-06-19T16:09:20.485Z",
      "updatedAt": "2024-06-19T23:15:23.839Z",
      "blueprint": {
        "id": "6f03323a-00f0-47db-b5bb-55ebdadaaf46",
        "title": "ConfigMaps",
        "icon": "k8s",
        "identifier": "ConfigMaps",
        "type": "custom",
        "description": null,
        "x": 3801.7699136083766,
        "y": 210.67121275927138,
        "createdAt": "2024-06-18T16:48:14.591Z",
        "updatedAt": "2024-06-19T16:07:35.799Z"
      },
      "properties": [
        {
          "id": "ef268884-a377-4284-b39d-9076e0554ed2",
          "entityId": "cb7c5306-a06d-41da-b228-571b34d246ee",
          "value": "{\"appsettings.json\":\"{\\n  \\\"MdmDB\\\": {\\n    \\\"ConnectionString\\\": \\\"Host=svc-mdm-postgres;Port=5432;Database=mdm;Username=mdm;Password=navicon123;Include Error Detail=true;Log Parameters=true;Maximum Pool Size=1000;Application Name=mdm-api\\\",\\n    \\\"DataBaseProvider\\\": \\\"PgSql\\\"\\n  },\\n  \\\"MdmObjDB\\\": {\\n    \\\"ConnectionString\\\": \\\"Host=svc-mdm-postgres;Port=5432;Database=mdm_objects;Username=mdm;Password=navicon123;Include Error Detail=true;Log Parameters=true;Application Name=mdm-api\\\",\\n    \\\"DataBaseProvider\\\": \\\"PgSql\\\"\\n  },\\n  \\\"Kestrel\\\": {\\n    \\\"Limits\\\": {\\n      \\\"MaxRequestBodySize\\\": null,\\n      \\\"MaxConcurrentConnections\\\": 200,\\n      \\\"KeepAliveTimeout\\\": { \\\"Minutes\\\": 120 },\\n      \\\"MinRequestBodyDataRate\\\": {\\n        \\\"BytesPerSecond\\\": 100,\\n        \\\"GracePeriod\\\": { \\\"Seconds\\\": 10 }\\n      },\\n      \\\"MinResponseDataRate\\\": {\\n        \\\"BytesPerSecond\\\": 100,\\n        \\\"GracePeriod\\\": { \\\"Seconds\\\": 10 }\\n      }\\n    }\\n  },\\n  \\\"ServiceBus\\\": {\\n    \\\"AzureServiceBusConnection\\\": \\\"\\\",\\n    \\\"UseAzureServiceBus\\\": false,\\n    \\\"RabbitMqConnection\\\": \\\"host=svc-rabbitmq;VirtualHost=mdm;username=mdm;password=123456\\\",\\n    \\\"UseAudit\\\": false\\n  },\\n  \\\"Elastic\\\": {\\n    \\\"Uri\\\": \\\"http://svc-elastic:9200\\\",\\n    \\\"EnableDebugMode\\\": false,\\n    \\\"PrettyJson\\\": true,\\n    \\\"ReplicasPerIndex\\\": 1,\\n    \\\"ShardsPerIndex\\\": 1,\\n    \\\"RequestTimeout\\\": 20,\\n    \\\"MaximumRetries\\\": 3,\\n    \\\"MaxRetryTimeout\\\": 60,\\n    \\\"BulkRequestTimeout\\\": 1000,\\n    \\\"BulkAllBatchSize\\\": 1000,\\n    \\\"EnableSSL\\\": false,\\n    \\\"CertificateFileName\\\": \\\"mdm-es.crt\\\",\\n    \\\"DisableDirectStreaming\\\": false,\\n    \\\"ScrollContextLifetime\\\": \\\"1m\\\",\\n    \\\"ScrollBatchCount\\\": 5,\\n    \\\"ScrollBatchSize\\\": 10000\\n  },\\n  \\\"Cache\\\": {\\n    \\\"TimeoutForLinkAttributeFilter\\\": 30\\n  },\\n  \\\"WorkflowHttpClient\\\": {\\n    \\\"BaseAddress\\\": \\\"http://svc-mdm-wf\\\"\\n  },\\n  \\\"NotificationHttpClient\\\": {\\n     \\\"BaseAddress\\\": \\\"http://svc-mdm-ns\\\"\\n  },\\n  \\\"EventHttpClient\\\": {\\n    \\\"BaseAddress\\\": \\\"http://svc-mdm-event\\\"\\n  },\\n  \\\"AuthType\\\": \\\"Bearer\\\",\\n  \\\"HostType\\\": \\\"Self\\\",\\n  \\\"EnableSystemColumnsInExcelTemplate\\\": true,\\n  \\\"FillLinksTitlesWhileRouting\\\": true,\\n  \\\"MaterializeVirtualAttributesWhileRouting\\\": true,\\n  \\\"PreventMergeIfClientSystemHasDuplicates\\\": true,\\n  \\\"SerializeDecimalAsString\\\": false,\\n  \\\"BaseAddressForUI\\\": \\\"http://84.46.243.143:32252\\\",\\n  \\\"Jwt\\\": { \\n    \\\"Authority\\\": \\\"http://di-k8s.ncdev.ru:30525/realms/mdm\\\", \\n    \\\"AuthorizationUrl\\\": \\\"http://di-k8s.ncdev.ru:30525/realms/mdm/protocol/openid-connect/auth\\\", \\n    \\\"TokenUrl\\\": \\\"http://di-k8s.ncdev.ru:30525/realms/mdm/protocol/openid-connect/token\\\", \\n    \\\"Audience\\\": \\\"account\\\", \\n    \\\"Realm\\\": \\\"mdm\\\", \\n    \\\"ClientId\\\": \\\"mdm-webapi\\\", \\n    \\\"ClientSecret\\\": \\\"I4Mlm7LNjBr2eOQjiffvWcSfHWNyjxw8\\\"\\n  },\\n  \\\"Ldap\\\": {\\n    \\\"Domain\\\": \\\"\\\",\\n    \\\"Server\\\": \\\"\\\",\\n    \\\"MachineAccountName\\\": \\\"\\\",\\n    \\\"MachineAccountPassword\\\": \\\"\\\",\\n    \\\"EnableLdapClaimResolution\\\": true,\\n    \\\"IgnoreNestedGroups\\\": false,\\n    \\\"ProtocolVersion\\\": 3,\\n    \\\"AutoReconnect\\\": false\\n  },\\n \\\"Keycloak\\\": {\\n    \\\"Version\\\": \\\"20.0.5\\\",\\n    \\\"BaseAddress\\\": \\\"http://di-k8s.ncdev.ru:30525\\\",\\n    \\\"Realm\\\": \\\"mdm\\\",\\n    \\\"AccessType\\\": \\\"Public\\\" /* Public, Confidential, BearerOnly */,\\n    \\\"AuthorizationEndpoint\\\": \\\"http://di-k8s.ncdev.ru:30525/realms/mdm/protocol/openid-connect/auth\\\",\\n    \\\"TokenEndpoint\\\": \\\"http://di-k8s.ncdev.ru:30525/realms/mdm/protocol/openid-connect/token\\\",\\n    \\\"CallbackPath\\\": \\\"/\\\",\\n    \\\"ClientId\\\": \\\"mdm-webapi\\\",\\n    \\\"ClientSecret\\\": \\\"I4Mlm7LNjBr2eOQjiffvWcSfHWNyjxw8\\\"\\n  },\\n  \\\"CorsPolicyOrigins\\\": [\\\"*\\\"],\\n  \\\"Logging\\\": {\\n    \\\"LogLevel\\\": {\\n      \\\"Default\\\": \\\"Debug\\\"\\n    },\\n    \\\"NLog\\\": {\\n      \\\"IncludeScopes\\\": true,\\n      \\\"RemoveLoggerFactoryFilter\\\": true\\n    }\\n  },\\n  \\\"NLog\\\": {\\n    \\\"autoReload\\\": true,\\n    \\\"throwConfigExceptions\\\": true,\\n    \\\"internalLogLevel\\\": \\\"Info\\\",\\n    \\\"internalLogFile\\\": \\\"${basedir}/internal-nlog.txt\\\",\\n    \\\"extensions\\\": [{ \\\"assembly\\\": \\\"NLog.Web.AspNetCore\\\" }],\\n    \\\"variables\\\": {\\n      \\\"var_logdir\\\": \\\"/tmp/logs\\\",\\n      \\\"var_serviceName\\\": \\\"mdm-api\\\"\\n    },\\n    \\\"default-wrapper\\\": {\\n      \\\"type\\\": \\\"AsyncWrapper\\\",\\n      \\\"overflowAction\\\": \\\"Block\\\"\\n    },\\n    \\\"targets\\\": {\\n      \\\"file\\\": {\\n        \\\"type\\\": \\\"File\\\",\\n        \\\"fileName\\\": \\\"${var_logdir}/${var_serviceName}.log\\\",\\n        \\\"layout\\\": \\\"${longdate}|${event-properties:item=EventId.Id}|${uppercase:${level}}|${logger}|${message} ${exception:format=tostring}|url: ${aspnet-request-url}|action: ${aspnet-mvc-action}\\\",\\n        \\\"archiveFileName\\\": \\\"${var_logdir}/${var_serviceName}/${var_serviceName}.{#}.log.gz\\\",\\n        \\\"archiveEvery\\\": \\\"Day\\\",\\n        \\\"archiveNumbering\\\": \\\"Rolling\\\",\\n        \\\"archiveDateFormat\\\": \\\"yyyyMMdd\\\",\\n        \\\"enableArchiveFileCompression\\\": \\\"true\\\",\\n        \\\"maxArchiveFiles\\\": \\\"7\\\",\\n        \\\"concurrentWrites\\\": \\\"true\\\",\\n        \\\"keepFileOpen\\\": \\\"false\\\"\\n      },\\n      \\\"console\\\": {\\n        \\\"type\\\": \\\"ColoredConsole\\\",\\n        \\\"layout\\\": \\\"${MicrosoftConsoleLayout}\\\",\\n        \\\"rowHighlightingRules\\\": [\\n          {\\n            \\\"condition\\\": \\\"level == LogLevel.Error\\\",\\n            \\\"foregroundColor\\\": \\\"Red\\\"\\n          },\\n          {\\n            \\\"condition\\\": \\\"level == LogLevel.Fatal\\\",\\n            \\\"foregroundColor\\\": \\\"Red\\\",\\n            \\\"backgroundColor\\\": \\\"White\\\"\\n          }\\n        ],\\n        \\\"wordHighlightingRules\\\": [\\n          {\\n            \\\"regex\\\": \\\"on|off\\\",\\n            \\\"foregroundColor\\\": \\\"DarkGreen\\\"\\n          },\\n          {\\n            \\\"condition\\\": \\\"level == LogLevel.Debug\\\",\\n            \\\"text\\\": \\\"[TEST]\\\",\\n            \\\"foregroundColor\\\": \\\"Blue\\\"\\n          }\\n        ]\\n      }\\n    },\\n    \\\"rules\\\": [\\n      {\\n        \\\"logger\\\": \\\"Program\\\",\\n        \\\"minLevel\\\": \\\"Info\\\",\\n        \\\"maxLevel\\\": \\\"Warning\\\",\\n        \\\"writeTo\\\": \\\"file\\\"\\n      },\\n      {\\n        \\\"logger\\\": \\\"Navicon.*\\\",\\n        \\\"minLevel\\\": \\\"Debug\\\",\\n        \\\"maxLevel\\\": \\\"Warning\\\",\\n        \\\"writeTo\\\": \\\"file\\\"\\n      },\\n      {\\n        \\\"logger\\\": \\\"Navicon.*\\\",\\n        \\\"minLevel\\\": \\\"Info\\\",\\n        \\\"maxLevel\\\": \\\"Warning\\\",\\n        \\\"writeTo\\\": \\\"console\\\"\\n      },\\n      {\\n        \\\"logger\\\": \\\"*\\\",\\n        \\\"minLevel\\\": \\\"Error\\\",\\n        \\\"writeTo\\\": \\\"file, console\\\"\\n      },\\n      {\\n        \\\"logger\\\": \\\"Microsoft.Hosting.Lifetime\\\",\\n        \\\"minLevel\\\": \\\"Info\\\",\\n        \\\"writeTo\\\": \\\"console\\\",\\n        \\\"final\\\": true\\n      }\\n    ]\\n  }\\n}\\n\"}",
          "isRelation": false,
          "isMirror": false,
          "identifier": "Body",
          "property": {
            "id": "0468048b-a872-460c-8972-59b26cf30afe",
            "title": "Body",
            "icon": null,
            "identifier": "Body",
            "description": null,
            "required": true,
            "many": false,
            "type": "object_property",
            "isRelation": false,
            "isMirror": false,
            "schema": {
              "type": "json",
              "protected": false
            },
            "createdAt": "2024-06-18T19:33:33.463Z",
            "updatedAt": "2024-06-18T19:36:42.501Z"
          },
          "relation": null
        },
        {
          "id": "82e4af6a-0bbb-40eb-bc72-8d12b40a3529",
          "entityId": "cb7c5306-a06d-41da-b228-571b34d246ee",
          "value": "8bafb6cc-9a21-4323-a127-143ca986abb1",
          "isRelation": true,
          "isMirror": false,
          "identifier": "Stand_cm",
          "property": {
            "id": "2f6401d8-2fa3-4aea-b92f-193f9feaa9b3",
            "title": "Стенд",
            "icon": "instance",
            "description": "null",
            "required": true,
            "many": true,
            "type": "entity_property",
            "isRelation": true,
            "isMirror": false,
            "schema": [
              {
                "id": "8bafb6cc-9a21-4323-a127-143ca986abb1",
                "title": "mdm"
              }
            ],
            "createdAt": "2024-06-18T19:31:08.566Z",
            "updatedAt": "2024-06-19T23:15:30.285Z",
            "blueprint": null,
            "action": null,
            "identifier": "Stand_cm"
          },
          "relation": {
            "id": "2f6401d8-2fa3-4aea-b92f-193f9feaa9b3",
            "title": "Стенд",
            "identifier": "Stand_cm",
            "description": "null",
            "required": true,
            "many": true,
            "createdAt": "2024-06-18T19:31:08.566Z",
            "updatedAt": "2024-06-19T16:07:46.016Z",
            "source": {
              "id": "6f03323a-00f0-47db-b5bb-55ebdadaaf46",
              "title": "ConfigMaps",
              "icon": "k8s",
              "identifier": "ConfigMaps",
              "type": "custom",
              "description": null,
              "x": 3801.7699136083766,
              "y": 210.67121275927138,
              "createdAt": "2024-06-18T16:48:14.591Z",
              "updatedAt": "2024-06-19T16:07:35.799Z"
            },
            "target": {
              "id": "7821289d-c1b5-4b78-8351-6472d0d9a00e",
              "title": "Стенды",
              "icon": "instance",
              "identifier": "Stendy",
              "type": "custom",
              "description": null,
              "x": 554.7533292676524,
              "y": -636.3377847912177,
              "createdAt": "2024-06-11T10:15:46.158Z",
              "updatedAt": "2024-06-18T17:46:53.280Z"
            }
          }
        }
      ]
    }
  ]


  const handleOnDragEndEntities = (result) => {
    if (!result.destination) return;

    const items = Array.from(entities);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
  };

  return (
    <>
      <Head>
        <title>{blueprint?.title}</title>
      </Head>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              {blueprint?.title}
            </Typography>
          </Grid>
        </Grid>
      </PageTitleWrapper>
      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Card>
            <Box p={1} className={classes.searchContainer}>
              <TextField
                className={classes.searchInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={handleQueryChange}
                placeholder={t("placeholderSearch")}
                value={query}
                size="small"
                margin="normal"
                variant="outlined"
              />
              <Box display="flex" alignItems="center">
                <ColumnSettings columns={columns} onChange={handleColumnsChange} storageKey={storageKeyColumns} />
                <GroupBySettings
                  properties={properties}
                  groupBy={groupBy}
                  onChange={setGroupBy}
                  storageKey={storageKeyGroupBy}
                  sx={{ ml: 2 }} // Отступ слева для GroupBySettings
                />
                <Button
                  sx={{ ml: 2 }} // Отступ слева для кнопки Add
                  onClick={() => {
                    setDialogEntity(true);
                  }}
                  variant="contained"
                  startIcon={<AddTwoToneIcon fontSize="small" />}
                >
                  {blueprint?.title}
                </Button>
              </Box>
            </Box>
            <Divider />
            {entities?.length === 0 ? (
              <>
                <Typography
                  sx={{
                    py: 10,
                  }}
                  variant="h3"
                  fontWeight="normal"
                  color="text.secondary"
                  align="center"
                >
                  {t("placeholderSearchNotFound")}
                </Typography>
              </>
            ) : (
              <>
                <TableContainer className={classes.tableContainer}>
                  <Table className={classes.table}>
                    <DragDropContext onDragEnd={handleOnDragEndColumns}>
                      <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        columns={columns}
                      />
                    </DragDropContext>
                    <DragDropContext onDragEnd={handleOnDragEndEntities}>
                      <Droppable droppableId="entities">
                        {(provided) => (
                          <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                            {groupBy ? (
                              <GroupedTableBody
                                entities={entities}
                                properties={properties}
                                groupBy={groupBy}
                                columns={columns}
                                setDialogEntity={setDialogEntity}
                              />
                            ) : (
                              entities?.map((entity) => (
                                <EntityTableCell
                                  key={entity.id}
                                  entity={entity}
                                  properties={properties}
                                  columns={columns}
                                  setDialogEntity={setDialogEntity}
                                />
                              ))
                            )}
                            {provided.placeholder}
                          </TableBody>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Table>
                </TableContainer>
                <Box p={2} display="flex" justifyContent="flex-start">
                  <Typography variant="body1">
                    {t('result')}: {entities?.length}
                  </Typography>
                </Box>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default observer(EntitiesView);