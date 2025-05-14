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
        headerTextColor: '#000000',
        headerIconColor: '#000000',

        // CC-002
        menuColor: '#F2F2F2',
        menuTitleColor: '#000000',
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
        puBgColor: '#F9F9F9',
        puWrapperColor: '#FFFFFF',
        puTitleColor: '#000000',

        inputBgColor: '#EFEFEF',
        inputBorderColor: '#DFDFDF',
        inputBorderFocusColor: '#000000',
        inputPlaceholderColor: '#9F9F9F',
        labelTextColor: '#000000',
        labelSpanColor: '#4F4F4F',
        helperTextColor: '#808080',
        metaTextColor: '#4F4F4F',
        inputInactiveText: '#4F4F4F',

        buttonTextColor: '#FFFFFF',
        buttonInactiveColor: '#D9D9D9',
        buttonActiveColor: '#4F4F4F',
        buttonKakaoColor: '#9A9A9A',

        checkBoxBgColor: '#D9D9D9',
        checkBoxLabelColor: '#000000',
        checkBoxMetaTextColor: '#6F6F6F',

        navigationTextColor: '#000000',
        navigationTextHoverColor: '#A0A0A0',

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