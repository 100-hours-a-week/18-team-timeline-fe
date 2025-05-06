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
        lineColor: '#AAAAAA',

        // CC-001
        headerColor: '#F2F2F2',
        headerIconColor: '#000000',

        // CC-002
        menuColor: '#F2F2F2',
        menuItemColor: '#000000',
        menuItemHoverColor: '#AAAAAA',
        menuMetaTextColor: '#6F6F6F',

        // CC-003
        modalColor: '#000000',
        modalTitleColor: '#FFFFFF',
        modalContentColor: '#FFFFFF',
        modalButtonConfirmColor: '#4F4F4F',
        modalButtonCancleColor: '#9A9A9A',

        // CC-004
        toastColor: '#9A9A9A',
        toastTextColor: '#FFFFFF',

        // PU
        puBgColor: '#F0F0F0',

        inputFormColor: '#DFDFDF',
        inputPlaceholderColor: '#9F9F9F',
        helperTextColor: '#808080',
        metaTextColor: '#4F4F4F',

        buttonDisactiveColor: '#D9D9D9',
        buttonActiveColor: '#4F4F4F',
        buttonKakaoColor: '#9A9A9A',

        checkBoxBgColor: '#D9D9D9',
        checkBoxCheckActiveColor: '#000000',
        checkBoxCheckDisactiveColor: '#FFFFFF',

        // PN
        pnBgColor: '#FFFFFF',
        newsCardColor: '#DADADA',
        newsCardSelectColor: '#9A9A9A',
        newsCardTitleColor: '#000000',
        newsCardSummaryColor: '#000000',
        newsCardMetaTextColor: '#9A9A9A',

        categoryBgColor: '#000000',
        categoryTextDisactiveColor: '#AAAAAA',
        categoryTextActiveColor: '#000000',

        fabBgColor: '#000000',
        fabIconColor: '#FFFFFF',
      },
    },
  },
  plugins: [require('daisyui')],
}