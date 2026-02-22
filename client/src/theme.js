import { createTheme } from '@mantine/core';

// カラーパレット定義
export const colors = {
  dark: [
    '#C1C2C5', // テキスト
    '#A6A7AB', 
    '#909296', 
    '#5C5F66', 
    '#373A40', // ボーダー
    '#2C2E33', // インプット背景
    '#25262B', // カード背景
    '#1A1B1E', // 背景
    '#141517', 
    '#101113', 
  ],
  
  primary: [
    '#E0F7F4', 
    '#B3EDE5', 
    '#80E2D5', 
    '#4DD7C5', 
    '#26CCB8', 
    '#00C2A8', // プライマリカラー
    '#00AB94', 
    '#009480', 
    '#007D6C', 
    '#006658',
  ],
  
  secondary: [
    '#FFF9E6', 
    '#FFEEB3', 
    '#FFE380', 
    '#FFD84D', 
    '#FFCD26', 
    '#DEB16C', // セカンダリカラー
    '#C89D5C', 
    '#B2894C', 
    '#9C753C', 
    '#86612C', 
  ],

  green: [
    '#EBFBEE', 
    '#D3F9D8', 
    '#B2F2BB', 
    '#8CE99A', 
    '#69DB7C', 
    '#51CF66', 
    '#40C057', 
    '#37B24D', 
    '#2F9E44', 
    '#2B8A3E', 
  ],

  red: [
    '#FFE9E9',
    '#FFD1D1', 
    '#FFA8A8', 
    '#FF8787', 
    '#FF6B6B', 
    '#FA5252',
    '#F03E3E',
    '#E03131',
    '#C92A2A', 
    '#B02525', 
  ],
};

// カスタムテーマ定義
export const theme = createTheme({
  colors,
  primaryColor: 'primary',
  secondaryColor: 'secondary',

  components: {
    Paper: {
      styles: {
        root: {
          backgroundColor: colors.dark[6], 
          border: `1px solid ${colors.dark[4]}`, 
        },
      },
    },
    
    NumberInput: {
      styles: () => ({
        input: {
          backgroundColor: `${colors.dark[5]} !important`, 
          borderColor: `${colors.dark[4]} !important`,
          '&:focus': {
            borderColor: `${colors.primary[5]} !important`,
          },
        },
      }),
    },
  },
});