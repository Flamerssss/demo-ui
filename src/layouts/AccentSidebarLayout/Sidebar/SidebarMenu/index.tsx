import { useEffect } from 'react';
import { ListSubheader, Box, List, styled } from '@mui/material';
import SidebarMenuItem from './item';
import { useRouter } from 'next/router';
import staticMenuItems from './static_items';
import { useTranslation } from 'react-i18next';
import iconsData from '@/components/IconPicker/iconsData';
import { observer } from "mobx-react-lite";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    margin-bottom: ${theme.spacing(1.5)};
    padding: 0;

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.sidebar.menuItemIconColor};
      padding: ${theme.spacing(1, 3.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(5.5)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.sidebar.menuItemColor};
          background-color: ${theme.sidebar.menuItemBg};
          width: 100%;
          border-radius: 0;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 4)};

          &:after {
            content: '';
            position: absolute;
            height: 100%;
            right: 0;
            top: 0;
            width: 0;
            opacity: 0;
            transition: ${theme.transitions.create(['opacity', 'width'])};
            background: ${theme.sidebar.menuItemColorActive};
            border-top-left-radius: ${theme.general.borderRadius};
            border-bottom-left-radius: ${theme.general.borderRadius};
          }
    
          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
            color: ${theme.sidebar.menuItemIconColor};
          }
          
          .MuiButton-endIcon {
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.Mui-active,
          &:hover {
            background-color: ${theme.sidebar.menuItemBgActive};
            color: ${theme.sidebar.menuItemColorActive};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
                color: ${theme.sidebar.menuItemIconColorActive};
            }
          }

          &.Mui-active {
            &:after {
              width: 5px;
              opacity: 1;
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(8)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.7, 4, 0.7, 4.25)};

              .MuiBadge-root {
                right: ${theme.spacing(5.5)};
              }

              &:before {
                content: ' ';
                background: ${theme.sidebar.menuItemIconColorActive};
                opacity: 0;
                transition: ${theme.transitions.create([
    'transform',
    'opacity'
  ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.Mui-active,
              &:hover {
                background-color: ${theme.sidebar.menuItemBg};

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }

                &:after {
                  opacity: 0;
                }
              }
            }
          }
        }
      }
    }
`
);

const isMenuItemActive = (menuItemLink, currentPath) => {
  // Если текущий путь точно совпадает с ссылкой меню
  if (menuItemLink === currentPath) {
    return true;
  }

  // Для динамических ссылок, проверяем, содержит ли текущий путь базу ссылки меню
  if (currentPath.startsWith(`${menuItemLink}/`)) {
    return true;
  }

  return false;
};


// Внешний компонент, где вы определяете состояние списка
const onDragEnd = (result) => {
  const { source, destination } = result;
  console.log('source', source.droppableId)
  console.log('destination', destination.index)

};



const renderSidebarMenuItems = ({
  items,
  path
}: {
  items: any[];
  path: string;
}): JSX.Element => (
  <DragDropContext onDragEnd={onDragEnd}>
    {items?.map((item, index) => (
      <Droppable key={item.id} droppableId={String(item.id)}>
        {(provided) => (
          <SubMenuWrapper
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <List component="div">
              <Draggable draggableId={String(item.id)} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <SidebarMenuItem
                      active={isMenuItemActive(item.link, path)}
                      name={item.name}
                      icon={item.icon}
                      link={item.link}
                      badge={item.badge}
                      badgeTooltip={item.badgeTooltip}
                    >
                      {item.items && renderSidebarMenuItems({ items: item.items, path })}
                    </SidebarMenuItem>
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </List>
          </SubMenuWrapper>
        )}
      </Droppable>
    ))}
  </DragDropContext>
);


function SidebarMenu() {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }
  };



  const createLink = (id) => {
    return `/entities/${id}`;
  };


  const getIconSvg = (iconId) => {
    const matchingIcon = iconsData.find(icon => icon.id === iconId);
    return matchingIcon ? matchingIcon.svg : null;
  };

  const transformDataToMenuItems = (data) => {

    const sortedData = data?.slice().sort((a, b) => a.index - b.index);

    return sortedData?.map(item => ({
      ...item,
      name: item.title,
      link: createLink(item.id),
      icon: item.icon ? () => (
        <Box
          sx={{
            mt: 0.5,
            '& svg': {
              width: 20,
              height: 20,
            }
          }}
          dangerouslySetInnerHTML={{ __html: getIconSvg(item.icon) }}
        />
      ) : null, // Если item.icon отсутствует, возвращается null
    }));
  };


  useEffect(handlePathChange, [router.isReady, router.asPath]);


  const blueprints = [
    {
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
    },
  ]

  const menuItems = transformDataToMenuItems(blueprints);

  return (
    <>
      {staticMenuItems.map((section) => (
        <MenuWrapper key={section.heading}>
          <List
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                {t(section.heading)}
              </ListSubheader>
            }
          >
            {renderSidebarMenuItems({
              items: section.items,
              path: router.asPath
            })}
          </List>
        </MenuWrapper>
      ))}
      <MenuWrapper key={'General'}>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              {t('Catalog')}
            </ListSubheader>
          }
        >
          {renderSidebarMenuItems({
            items: menuItems,
            path: router.asPath
          })}
        </List>
      </MenuWrapper>
    </>
  );
}

export default observer(SidebarMenu);