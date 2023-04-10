import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
    colors:{
        gray:{
            "900": "#181B23",
            "800": "#1f2029",
            "700": "#353646",
            "600": "#4B4D63",
            "500": "#616480",
            "400": "#797D9A",
            "300": "#9699B0",
            "200": "#b9babf",
            "100": "#d4d5d9",
            "fundo": "#f6f8fa",
        },
        green:{
            "paleta":"#a9bf9a"
        },
        blue:{
            "100": "#2c7ff8",
            "principal": "#0c105a",
        },
        black:{
            "title": "#060d18"
        }
    },
    fonts:{
        heading: 'Lato',
        body: 'Lato'
    },
    styles: {
        global: {
            body: {
                bg: 'gray.fundo',
                color: ''
            }
        }
    }
})