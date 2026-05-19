import { createTheme } from '@mui/material/styles';

export const ThemeSettings = (themeLists = {}) => {
  return createTheme({
    typography: {
      fontFamily: "'Barlow', sans-serif",
    },
    paletteSecondary: {
      basecolorCode: {
        main: themeLists.basecolorCode,
        secondary: themeLists.basecolorCode,
      },
      colorCode: {
        main: themeLists.colorCode,
        secondary: themeLists.colorCode,
      },
      lightblackcolorCode: {
        main: themeLists.lightblackcolorCode,
      },
      shadowcolorCode: {
        main: themeLists.shadowcolorCode,
      },
      whitecolorCode: {
        main: themeLists.whitecolorCode,
      },
      footertextcolorCode: {
        main: '#9ca3af'
      }
    },
    palette: {
      basecolorCode: {
        main: themeLists.basecolorCode || '#3BB77E',
        secondary: themeLists.basecolorCode || '#3bb77e1c',
      },
      colorCode: {
        main: themeLists.colorCode || '#253D4E',
        secondary: themeLists.colorCode || 'gray',
      },
      lightblackcolorCode: {
        main: themeLists.lightblackcolorCode || '#253D4E',
      },
      shadowcolorCode: {
        main: themeLists.shadowcolorCode || '#3bb77e1c',
      },
      whitecolorCode: {
        main: themeLists.whitecolorCode || '#FFF',
      },
      footertextcolorCode: {
        main: '#FFF'
      }
    },
  });
};

export default ThemeSettings;