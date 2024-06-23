import { useRef, useState, useEffect } from 'react';

import {
  IconButton,
  Box,
  List,
  ListItem,
  Divider,
  Typography,
  ListItemText,
  alpha,
  Popover,
  Tooltip,
  styled,
  useTheme
} from '@mui/material';
import internationalization from 'src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import { US } from 'country-flag-icons/react/3x2';
import { RU } from 'country-flag-icons/react/3x2';

const SectionHeading = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
        padding: ${theme.spacing(2, 2, 0)};
`
);

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  border-radius: ${theme.general.borderRadiusLg};
`
);

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { t }: { t: any } = useTranslation();
  const getLanguage = window.localStorage.getItem('lng') || i18n.language;
  const theme = useTheme();

  useEffect(() => {
    internationalization.changeLanguage(window.localStorage.getItem('lng') || getLanguage)
  }, []);

  const switchLanguage = ({ lng }: { lng: any }) => {
    internationalization.changeLanguage(lng);
    window.localStorage.setItem('lng', lng)
  };
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip arrow title={t('Language Switcher')}>
        <IconButtonWrapper
          color="secondary"
          ref={ref}
          onClick={handleOpen}
          sx={{
            mx: 1,
            background: alpha(theme.colors.error.main, 0.1),
            transition: `${theme.transitions.create(['background'])}`,
            color: theme.colors.error.main,

            '&:hover': {
              background: alpha(theme.colors.error.main, 0.2)
            }
          }}
        >
          {getLanguage === 'en' && <US title="English" />}
          {getLanguage === 'en-US' && <US title="English" />}
          {getLanguage === 'en-GB' && <US title="English" />}
          {getLanguage === 'ru' && <RU title="Russian" />}
        </IconButtonWrapper>
      </Tooltip>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box
          sx={{
            maxWidth: 240
          }}
        >
          <SectionHeading variant="body2" color="text.primary">
            {t('language_switcher')}
          </SectionHeading>
          <List
            sx={{
              p: 2,
              svg: {
                width: 26,
                mr: 1
              }
            }}
            component="nav"
          >
            <ListItem
              className={getLanguage === 'ru' ? 'active' : ''}
              button
              onClick={() => {
                switchLanguage({ lng: 'ru' });
                handleClose();
              }}
            >
              <RU title="Russian" />
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary={t('russian')}
              />
            </ListItem>
            <ListItem
              className={
                getLanguage === 'en' || getLanguage === 'en-US' ? 'active' : ''
              }
              button
              onClick={() => {
                switchLanguage({ lng: 'en' });
                handleClose();
              }}
            >
              <US title="English" />
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary={t('english')}
              />
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Popover>
    </>
  );
}

export default LanguageSwitcher;
