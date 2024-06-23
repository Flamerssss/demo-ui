import { useContext } from 'react';

import { Box, alpha, IconButton, Tooltip, styled } from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { SidebarContext } from 'src/contexts/SidebarContext';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import Logo from 'src/components/LogoSign';
import Link from "src/components/Link";
import HeaderButtons from './Buttons';
import HeaderUserbox from './Userbox';
import RestoreIcon from '@mui/icons-material/Restore';
import HeaderMenu from '../Menu';
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: ${alpha(theme.header.background, 0.95)};
        backdrop-filter: blur(8px);
        box-shadow: ${theme.header.boxShadow};
        position: fixed;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`
);

function Header() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  return (
    <HeaderWrapper display="flex" alignItems="center">
      <Box display="flex" alignItems="center">
        <Box
          component="span"
          sx={{
            mr: 1,
            display: { lg: 'none', xs: 'inline-block' }
          }}
        >
          <Logo />
        </Box>
        <HeaderMenu />
      </Box>
      <Box display="flex" alignItems="center">
        <HeaderButtons />
        <IconButton
          component={Link}
          href="/audits"
        >
          <RestoreIcon />
        </IconButton>
        <IconButton
          component={Link}
          href="/users"
        >
          <PeopleOutlineTwoToneIcon />
        </IconButton>
        <HeaderUserbox />
        <Box
          component="span"
          sx={{
            display: { lg: 'none', xs: 'inline-block' }
          }}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={toggleSidebar}>
              {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
