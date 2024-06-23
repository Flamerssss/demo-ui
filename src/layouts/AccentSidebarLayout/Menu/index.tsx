import { useRef, useState } from 'react';
import {
  Box,
  Button,
  useTheme,
  CardActionArea,
  Typography,
  Grid,
  Card,
  Popover,
  styled,
  Divider,
  ListItemText,
  MenuItem,
  alpha,
  MenuList
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import Text from 'src/components/Text';
import Link from "src/components/Link";
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';

const CardActionAreaWrapper = styled(CardActionArea)(
  ({ theme }) => `
      .MuiTouchRipple-root {
        opacity: .2;
      }

      .MuiCardActionArea-focusHighlight {
        background: ${theme.colors.primary.main};
      }

      &:hover {
        .MuiCardActionArea-focusHighlight {
          opacity: .05;
        }
      }
`
);

const MenuListWrapperSecondary = styled(MenuList)(
  ({ theme }) => `
  padding: ${theme.spacing(3)};

  & .MuiMenuItem-root {
      border-radius: 50px;
      padding: ${theme.spacing(1, 1, 1, 2.5)};
      min-width: 200px;
      margin-bottom: 2px;
      position: relative;
      color: ${theme.colors.alpha.black[70]};

      &.Mui-selected,
      &:hover,
      &.MuiButtonBase-root:active {
          background: ${theme.colors.alpha.black[10]};
          color: ${theme.colors.alpha.black[100]};
      }

      &:last-child {
          margin-bottom: 0;
      }
    }
`
);

function HeaderMenu() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const ref2 = useRef<any>(null);
  const [isOpen2, setOpen2] = useState<boolean>(false);

  const handleOpen2 = (): void => {
    setOpen2(true);
  };

  const handleClose2 = (): void => {
    setOpen2(false);
  };

  return (
    <>
      <Box
        sx={{
          display: { xs: 'none', md: 'inline-flex' }
        }}
      >
        <Button
          ref={ref}
          onClick={handleOpen}
          endIcon={<KeyboardArrowDownTwoToneIcon />}
          color="secondary"
          size="small"
          sx={{
            mr: 1,
            px: 2,
            backgroundColor: `${theme.colors.secondary.lighter}`,
            color: `${theme.colors.secondary.dark}`,

            '.MuiSvgIcon-root': {
              color: `${theme.colors.secondary.dark}`,
              transition: `${theme.transitions.create(['color'])}`
            },

            '&:hover': {
              backgroundColor: `${theme.colors.secondary.main}`,
              color: `${theme.palette.getContrastText(
                theme.colors.secondary.main
              )}`,

              '.MuiSvgIcon-root': {
                color: `${theme.palette.getContrastText(
                  theme.colors.secondary.main
                )}`
              }
            }
          }}
        >
          {t('builder')}
        </Button>
        <Button
          component={Link}
          href="/self-service"
          color="secondary"
          size="small"
          sx={{
            mr: 1,
            px: 2,
            backgroundColor: `${theme.colors.secondary.lighter}`,
            color: `${theme.colors.secondary.dark}`,

            '.MuiSvgIcon-root': {
              color: `${theme.colors.secondary.dark}`,
              transition: `${theme.transitions.create(['color'])}`
            },

            '&:hover': {
              backgroundColor: `${theme.colors.secondary.main}`,
              color: `${theme.palette.getContrastText(
                theme.colors.secondary.main
              )}`,

              '.MuiSvgIcon-root': {
                color: `${theme.palette.getContrastText(
                  theme.colors.secondary.main
                )}`
              }
            }
          }}
        >
          {t('self-service')}
        </Button>
        <Button
          component={Link}
          href="/marketplace"
          color="secondary"
          size="small"
          sx={{
            mr: 1,
            px: 2,
            backgroundColor: `${theme.colors.secondary.lighter}`,
            color: `${theme.colors.secondary.dark}`,

            '.MuiSvgIcon-root': {
              color: `${theme.colors.secondary.dark}`,
              transition: `${theme.transitions.create(['color'])}`
            },

            '&:hover': {
              backgroundColor: `${theme.colors.secondary.main}`,
              color: `${theme.palette.getContrastText(
                theme.colors.secondary.main
              )}`,

              '.MuiSvgIcon-root': {
                color: `${theme.palette.getContrastText(
                  theme.colors.secondary.main
                )}`
              }
            }
          }}
        >
          {t('marketplace')}
        </Button>
        <Button
          ref={ref2}
          onClick={handleOpen2}
          endIcon={<KeyboardArrowDownTwoToneIcon />}
          color="secondary"
          size="small"
          sx={{
            px: 2,
            backgroundColor: `${theme.colors.secondary.lighter}`,
            color: `${theme.colors.secondary.dark}`,

            '.MuiSvgIcon-root': {
              color: `${theme.colors.secondary.dark}`,
              transition: `${theme.transitions.create(['color'])}`
            },

            '&:hover': {
              backgroundColor: `${theme.colors.secondary.main}`,
              color: `${theme.palette.getContrastText(
                theme.colors.secondary.main
              )}`,

              '.MuiSvgIcon-root': {
                color: `${theme.palette.getContrastText(
                  theme.colors.secondary.main
                )}`
              }
            }
          }}
        >
          {t('applications')}
        </Button>
      </Box>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Box
          sx={{
            p: 1,
            background: alpha(theme.colors.alpha.black[100], 0.06)
          }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography noWrap variant="subtitle2">
              {t('test_title')}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <MenuListWrapperSecondary disablePadding>
          <Box sx={{ marginBottom: 1 }}>
            <Link href="/blueprints"
              onClick={handleClose}
              style={{ textDecoration: 'none' }}>
              <MenuItem selected>
                <ListItemText
                  primaryTypographyProps={{
                    variant: 'h5'
                  }}
                  primary={t('blueprints')}
                />
              </MenuItem>
            </Link>
          </Box>
          <Box sx={{ marginBottom: 1 }}>
            <Link href="/data-source"
              onClick={handleClose}
              style={{ textDecoration: 'none' }}
            >
              <MenuItem>
                <ListItemText
                  primaryTypographyProps={{
                    variant: 'h5'
                  }}
                  primary={t('data_source')}
                />
              </MenuItem>
            </Link>
          </Box>
        </MenuListWrapperSecondary>
      </Popover>
      <Popover
        disableScrollLock
        anchorEl={ref2.current}
        onClose={handleClose2}
        open={isOpen2}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        sx={{
          '.MuiPopover-paper': {
            background: theme.colors.gradients.blue3
          }
        }}
      >
        <Box
          sx={{
            maxWidth: 400
          }}
          p={3}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Card>
                <Link href="/kubernetes"
                  onClick={handleClose2}
                  style={{ textDecoration: 'none' }}>
                  <CardActionAreaWrapper
                    sx={{
                      p: 2
                    }}
                  >
                    <Text color="warning">
                      <AccountTreeTwoToneIcon
                        sx={{
                          mb: 1
                        }}
                      />
                    </Text>
                    <Typography variant="h4">{t('kubernetes')}</Typography>
                  </CardActionAreaWrapper>
                </Link>
              </Card>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <Card>
                <CardActionAreaWrapper
                  sx={{
                    p: 2
                  }}
                >
                  <Text color="success">
                    <ContactSupportTwoToneIcon
                      sx={{
                        mb: 1
                      }}
                    />
                  </Text>
                  <Typography variant="h4">{t('Helpdesk')}</Typography>
                </CardActionAreaWrapper>
              </Card>
            </Grid> */}
          </Grid>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderMenu;
