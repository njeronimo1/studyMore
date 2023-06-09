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
            "300": "#3d3d3d",
            "200": "#b9babf",
            "100": "#2F2E2E",
            "fundo": "#222222",
        },
        green:{
            "paleta":"#a9bf9a"
        },
        blue:{
            "100": "#2c7ff8",
            "principal": "#0c105a",
        },
        black:{
            "title": "#060d18",
            "300":"#f3f2ef",
            "200":"#222222",
            "100":"#2F2E2E",
            "50":"#1C1C1C"
        }
    },
    fonts:{
        heading: 'Inter',
        body: 'Inter'
    },
    styles: {
        global: {
            body: {
                bg: 'black.200',
                color: ''
            }
        }
    }
})