import config from 'src/context/config';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { Link } from 'react-router';
{
  /*
import { ReactComponent as LogoDark } from 'src/assets/images/logos/dark-logo.svg';
import { ReactComponent as LogoDarkRTL } from 'src/assets/images/logos/dark-rtl-logo.svg';
import { ReactComponent as LogoLight } from 'src/assets/images/logos/light-logo.svg';
import { ReactComponent as LogoLightRTL } from 'src/assets/images/logos/light-logo-rtl.svg';

*/
}
import { ReactComponent as LogoDark } from 'src/assets/images/logos/logo-sonrisas.svg';
import { ReactComponent as LogoDarkRTL } from 'src/assets/images/logos/logo-sonrisas.svg';
import { ReactComponent as LogoLight } from 'src/assets/images/logos/logo-sonrisas.svg';
import { ReactComponent as LogoLightRTL } from 'src/assets/images/logos/logo-sonrisas.svg';
import { styled } from '@mui/material';
import { useContext } from 'react';

const Logo = () => {
  const { isCollapse, isSidebarHover, activeDir, activeMode } = useContext(CustomizerContext);
  const TopbarHeight = config.topbarHeight;

  const LinkStyled = styled(Link)(() => ({
    height: TopbarHeight,
    width: isCollapse == 'mini-sidebar' && !isSidebarHover ? '40px' : '500px !important',
    minWidth: isCollapse == 'mini-sidebar' && !isSidebarHover ? '40px' : '500px !important',
    maxWidth: 'none !important',
    overflow: 'visible !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    whiteSpace: 'nowrap',
    position: 'relative',
    zIndex: 1000,
    paddingTop: '25px',
  }));

  const LogoStyled = styled('div')(() => ({
    height: '50px',
    width: '500px !important',
    minWidth: '500px !important',
    '& svg': {
      height: '100%',
      width: '500px !important',
      maxWidth: 'none !important',
      display: 'block',
    },
  }));

  if (activeDir === 'ltr') {
    return (
      <LinkStyled to="/">
        <LogoStyled>{activeMode === 'dark' ? <LogoLight /> : <LogoDark />}</LogoStyled>
      </LinkStyled>
    );
  }
  return (
    <LinkStyled to="/">
      <LogoStyled>{activeMode === 'dark' ? <LogoDarkRTL /> : <LogoLightRTL />}</LogoStyled>
    </LinkStyled>
  );
};

export default Logo;
