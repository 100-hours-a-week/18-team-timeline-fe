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
        headerBackground: '#F2A359',
        headerLogo: '#EEEEEE',
        headerIcon: '#EEEEEE',
        searchBarBg: '#FFFFFF',
        searchBarIcon: '#EEEEEE',
        keywordBoxBg: '#FFFFFF',
        keywordBoxLine: '#EEEEEE',
        keywordBg: '#F2A359',
        keywordText: '#FFFFFF',

        // CC-002
        menuBackground: '#EEEEEE',
        menuTitle: '#2A4759',
        menuItem: '#2A4759',
        menuItemHover: '#F2A359',
        menuMetaText: '#2A4759',

        // CC-003
        modalBg: '#F5F5F5',
        modalTitle: '#2A4759',
        modalContent: '#4F4F4F',
        modalBtnText: '#FFFFFF',
        modalBtnConfirm: '#F2A359',
        modalBtnConfirmHover: '#F4C89E',
        modalBtnInactive: '#F3D7C2',
        modalBtnCancel: '#2A4759',
        modalBtnCancelHover: '#577F98',

        // CC-004
        toastBg: '#2A4759',
        toastText: '#FFFFFF',

        // CC-005
        alarmBarBg: '#F9F9F9',
        alarmBarMetaText: '#AAAAAA',
        alarmBarHeader: '#FFFFFF',
        alarmTabSelect: '#000000',
        alarmTabNotSelect: '#AAAAAA',
        alarmCardBg: '#FFFFFF',
        alarmCardBorder: '#EEEEEE',
        alarmCardHoverBg: '#F1EFEC',
        alarmCardChecked: '#AAAAAA',
        alarmCardTitle: '#2A4759',
        alarmCardContent: '#4F4F4F',
        alarmCardDate: '#4F4F4F',

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