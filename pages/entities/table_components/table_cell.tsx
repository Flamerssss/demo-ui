import React, { useState } from "react";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import {
  Box,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { DeleteDialogIcon } from "@/utils/delete_dialog_icon";
import { format, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import iconsData from "@/components/IconPicker/iconsData";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import { makeStyles } from "@mui/styles";
import FileCopyIcon from "@mui/icons-material/FileCopy";

// Cells
import CustomTag from "./custom_tag";
import ObjectCell from "./cells/object_cell";

const useStyles = makeStyles({
  copyIcon: {
    flexShrink: 0,
    width: "150%",
    height: "150%",
    color: "#ccc",
    cursor: "pointer",
    visibility: "hidden", // По умолчанию скрыта
    paddingLeft: "5px", // Добавляем отступ слева
  },
  visible: {
    visibility: "visible",
  },
  tableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    whiteSpace: "nowrap", // запрещаем перенос строки
    minWidth: "100px", // устанавливаем минимальную ширину ячейки
    overflow: "hidden", // предотвращаем выход содержимого за пределы ячейки
    padding: "0 16px", // увеличиваем паддинг для лучшего контроля ширины ячеек
  },
  tableRow: {
    display: "flex",
    flexWrap: "nowrap", // предотвращаем перенос строк внутри строки таблицы
  },
  link: {
    textDecoration: "none", // удаляем подчеркивание для ссылок
    color: "blue", // устанавливаем цвет текста ссылок
    whiteSpace: "nowrap", // запрещаем перенос строк
    overflow: "hidden", // предотвращаем выход содержимого за пределы
  },
  icon: {
    width: 17,
    height: 17,
    marginRight: "8px", // добавляем отступ справа от иконки
    display: "flex",
    alignItems: "center",
  },
});

const EntityTableCell = ({
  entity,
  properties,
  setDialogEntity,
  columns,
}) => {
  const classes = useStyles();
  const locale = ru;
  const router = useRouter();
  const { t } = useTranslation();

  const [hoveredCell, setHoveredCell] = useState(null);



  const handleEditClick = () => {
    setDialogEntity(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours());
    return formatDistanceToNow(date, { addSuffix: true, locale });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours());
    return format(date, "PPPpp", { locale });
  };

  const propertiesObject = entity.properties.reduce((acc, prop) => {
    // Проверяем, что prop.property существует и имеет id
    if (prop.property && prop.property.id) {
      const propertyDetail = properties.find((p) => p.id === prop.property.id);
      if (propertyDetail) {
        // Проверяем, что значение prop.value существует
        acc[propertyDetail.title] = prop.value ?? null;
      }
    }
    return acc;
  }, {});


  const getIconSvg = (iconId) => {
    const matchingIcon = iconsData.find((icon) => icon.id === iconId);
    return matchingIcon ? matchingIcon.svg : null;
  };

  const { blueprintId } = router.query;

  return (
    <TableRow key={entity.id} className={classes.tableRow}>
      {columns.map(
        (column) =>
          !column.hidden && (
            <TableCell key={column.id} align={column.align} className={classes.tableCell}>
              {column.id === "title" ? (
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  {entity.icon && (
                    <Box
                      className={classes.icon}
                      dangerouslySetInnerHTML={{ __html: getIconSvg(entity.icon) }}
                    />
                  )}
                  <div
                    style={{ display: "flex", flexWrap: "nowrap", alignItems: "center" }}
                    onMouseEnter={() => setHoveredCell("title")}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <Link
                      href={`/entities/${blueprintId}/details/${entity?.id}`}
                      passHref
                    >
                      <Typography
                        variant="h4"
                        component="h4"
                        style={{ color: "blue", textDecoration: "none", cursor: "pointer" }}
                      >
                        {entity.title || "-"}
                      </Typography>
                    </Link>
                    <Tooltip title={t("Скопировать")} placement="top">
                      <FileCopyIcon
                        className={`${classes.copyIcon} ${hoveredCell === "title" ? classes.visible : ""
                          }`}
                        onClick={() => { }}
                      />
                    </Tooltip>
                  </div>
                </Grid>
              ) : column.id === "updatedAt" ? (
                <div
                  style={{ display: "flex", flexWrap: "nowrap" }}
                  onMouseEnter={() => setHoveredCell(entity.updatedAt)}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <Tooltip title={formatFullDate(entity.updatedAt)} placement="top">
                    <span>{formatDate(entity.updatedAt)}</span>
                  </Tooltip>
                  <Tooltip title={t("Скопировать")} placement="top">
                    <FileCopyIcon
                      className={`${classes.copyIcon} ${hoveredCell === entity.updatedAt ? classes.visible : ""
                        }`}
                      onClick={() => { }}
                    />
                  </Tooltip>
                </div>
              ) : column.id === "actions" ? (
                <Typography noWrap>
                  <Tooltip title={t("View")} arrow>
                    <IconButton onClick={handleEditClick} color="primary">
                      <LaunchTwoToneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("Delete")} arrow>
                    <DeleteDialogIcon
                      e="entities"
                      document={entity.id}
                      onSuccess={() => {
                      }}
                    />
                  </Tooltip>
                </Typography>
              ) : (
                properties.map((property) => {
                  if (property.title !== column.id) return null;
                  const propertyKey = `property-${property.id}-${entity.id}`;

                  return (
                    <div
                      key={propertyKey}
                      style={{ display: "flex", flexWrap: "nowrap", alignItems: "center" }}
                      onMouseEnter={() => setHoveredCell(propertyKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {property?.type === "enum_property" && property?.schema ? (
                        property.schema[propertiesObject[property.title]] ? (
                          <CustomTag
                            property={property}
                            propertiesObject={propertiesObject}
                          />
                        ) : (
                          "-"
                        )
                      ) : property?.type === "entity_property" && property?.schema ? (
                        property?.schema.find(
                          (item) => item.id === propertiesObject[property.title]
                        )?.title || "-"
                      ) : property?.type === "url_property" && property?.schema ? (
                        "-"
                      ) : property?.type === "object_property" && property?.schema ? (
                        <ObjectCell
                          value={propertiesObject[property.title]}
                          property={property}
                        />
                      ) : property?.type === "boolean_property" && property?.schema ? (
                        <span
                          style={{
                            backgroundColor: `#f5f5f5`,
                            border: `1px solid #ccc`,
                            borderRadius: "10px",
                            padding: "4px 12px",
                            display: "inline-block",
                            color: "#000",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                          }}
                        >
                          {propertiesObject[property.title]?.charAt(0).toUpperCase() +
                            propertiesObject[property.title]?.slice(1)}
                        </span>
                      ) : property.type === 'portal_user_property' || property.type === 'portal_team_property' ? (
                        {}
                      ) : (
                        propertiesObject[property.title] || "-"
                      )}
                      <Tooltip title={t("Скопировать")} placement="top">
                        <FileCopyIcon
                          className={`${classes.copyIcon} ${hoveredCell === propertyKey ? classes.visible : ""
                            }`}
                          onClick={() => { }}
                        />
                      </Tooltip>
                    </div>
                  );
                })
              )}
            </TableCell>
          )
      )}
    </TableRow>
  );
};

export default EntityTableCell;
