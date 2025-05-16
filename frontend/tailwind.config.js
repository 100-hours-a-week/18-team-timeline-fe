/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // common
        myWhite: '#FFFFFF',
        myBlack: '#000000',
        mainBgColor: '#E5E5E5',

        // CC
        ccLine: '#DDDDDD',

        // CC-001
        headerColor: '#F2F2F2',
        headerTextColor: '#000000',
        headerIconColor: '#000000',

        // CC-002
        menuColor: '#F2F2F2',
        menuItemColor: '#000000',
        menuItemHoverColor: '#AAAAAA',
        menuMetaTextColor: '#6F6F6F',

        // CC-003
        modalColor: '#FFFFFF',
        modalTitleColor: '#000000',
        modalContentColor: '#000000',
        modalButtonTextColor: '#FFFFFF',
        modalButtonConfirmColor: '#4F4F4F',
        modalButtonConfirmHoverColor: '#6F6F6F',
        modalButtonInactiveColor: '#D9D9D9',
        modalButtonCancelColor: '#9A9A9A',
        modalButtonCancelHoverColor: '#AAAAAA',

        // CC-004
        toastColor: '#9A9A9A',
        toastTextColor: '#FFFFFF',

        // PU
        puBg: '#FCFAF7',
        puWrapper: '#FFFFFF',
        puTitle: '#2A4759',

        inputBg: '#F1EFEC',
        inputBorder: '#D4C9BE',
        inputBorderFocus: '#000000',
        inputPlaceholder: '#D4C9BE',
        labelText: '#2A4759',
        labelRequired: '#F79B72',
        helperText: '#808080',
        metaText: '#4F4F4F',
        inputInactiveText: '#4F4F4F',

        btnText: '#FFFFFF',
        btnInactiveBg: '#F3D7C2',
        btnActiveBg: '#F2A359',
        btnKakaoBg: '#FEE500',

        checkBoxBg: '#F2A359',
        checkBoxLabel: '#2A4759',
        checkBoxMetaText: '#4F4F4F',

        navText: '#2A4759',
        navTextHover: '#F2A359',

        // PN
        pnBgColor: '#FFFFFF',
        newsCardColor: '#DADADA',
        newsCardSelectColor: '#9A9A9A',
        newsCardTitleColor: '#000000',
        newsCardSummaryColor: '#000000',
        newsCardMetaTextColor: '#9A9A9A',

        categoryBgColor: '#000000',
        categoryTextInactiveColor: '#AAAAAA',
        categoryTextActiveColor: '#000000',

        fabBgColor: '#000000',
        fabIconColor: '#FFFFFF',
      },
    },
  },
  plugins: [require('daisyui')],
}