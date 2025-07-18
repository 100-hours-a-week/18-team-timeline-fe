/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // common
        point: '#F2A359',
        myWhite: '#FFFFFF',
        myBlack: '#1A1A1A',
        mainBg: '#EEEAE6',
        mainPoint: '#D4C9BE',
        pageBg: '#FCFAF7',

        // CC
        ccLine: '#DDDDDD',

        // CC-001
        headerBackground: '#F2A359',
        headerLogo: '#EEEEEE',
        headerIcon: '#EEEEEE',
        searchBarBg: '#FFFFFF',
        searchBarIcon: '#2A4759',
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
        alarmTabSelect: '#1A1A1A',
        alarmTabNotSelect: '#AAAAAA',
        alarmCardBg: '#FFFFFF',
        alarmCardBorder: '#EEEEEE',
        alarmCardHoverBg: '#F1EFEC',
        alarmCardChecked: '#AAAAAA',
        alarmCardTitle: '#2A4759',
        alarmCardContent: '#4F4F4F',
        alarmCardDate: '#4F4F4F',

        // PU
        puWrapper: '#FFFFFF',
        puTitle: '#2A4759',

        inputBg: '#F1EFEC',
        inputBorder: '#D4C9BE',
        inputBorderFocus: '#1A1A1A',
        inputPlaceholder: '#D4C9BE',
        labelText: '#2A4759',
        labelRequired: '#F79B72',
        helperText: '#808080',
        metaText: '#4F4F4F',
        inputInactiveText: '#4F4F4F',

        btnText: '#FFFFFF',
        btnInactiveBg: '#F3D7C2',
        btnActiveBg: '#F2A359',

        checkBoxBg: '#F2A359',
        checkBoxLabel: '#2A4759',
        checkBoxMetaText: '#4F4F4F',

        navText: '#2A4759',
        navTextHover: '#F2A359',

        // PV
        pollBoxBorder: '#DADADA',
        pollOptionBg: '#F1EFEC',
        pollOptionSelectBg: '#E3D8CE',
        pollOptionText: '#1A1A1A',
        pollOptionVotedText: '#808080',
        radioBtnBorder: '#DADADA',
        radioBtnBg: '#FFFFFF',
        radioBtnCircle: '#F2A359',

        // PN
        pnBtnActiveBg: '#2A4759',
        pnBtnHoverBg: '#577F98',
        pnBtnInactiveBg: '#A3ACB2',
        pnBtnInactiveText: '#ECEDED',

        newsCardBg: '#FFFFFF',
        newsCardBorder: '#EEEEEE',
        newsCardTitle: '#2A4759',
        newsCardSummary: '#717171',
        newsCardTime: '#F2A359',
        newsCardIcon: '#577F98',

        carouselBg: '#ECEDED',
        carouselInactive: '#2A4759',

        categoryText: '#2A4759',
        categoryBorder: '#EEEEEE',
        createNewsBtnBoxBorder: '#EEEEEE',

        bookmarkTitle: '#2A4759',

        timelineCardWhiteBg: '#FFFFFF',
        timelineCardBlackBg: '#2A4759',
        timelineCardWhiteTitle: '#1A1A1A',
        timelineCardBlackTitle: '#FFFFFF',
        timelineCardWhiteContent: '#717171',
        timelineCardBlackContent: '#EEEEEE',
        timelineMetaText: '#2A4759',

        commentBoxBg: '#FFFFFF',
        commentCardBg: '#FFFFFF',
        commentMetaText: '#AAAAAA',
        commentWithdrawAuthor: '#92A3AE',

        statsTitle: '#2A4759',
        statsNotice: '#AAAAAA',
        positive: '#FA7000',
        neutral: '#FF9800',
        negative: '#FFE0B2',
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('tailwind-scrollbar-hide'),
  ]
}
