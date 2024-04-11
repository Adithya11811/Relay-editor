export const customStyles = {
  control: (styles) => ({
    ...styles,
    width: '100%',
    maxWidth: '14rem',
    minWidth: '12rem',
    borderRadius: '5px',
    color: '#22c55e',
    fontSize: '0.8rem',
    lineHeight: '1.75rem',
    backgroundColor: '#4b5563',
    cursor: 'pointer',
    border: '2px solid #000000',
    boxShadow: '5px 5px 0px 0px rgba(0,0,0);',
    ':hover': {
      border: '2px solid #000000',
      boxShadow: 'none',
    },
  }),
  option: (styles) => {
    return {
      ...styles,
      color: '#22c55e ',
      fontSize: '0.8rem',
      lineHeight: '1.75rem',
      width: '100%',
      background: '#4b5563',
      ':hover': {
        backgroundColor: 'rgb(243 244 246)',
        color: '#22c55e',
        cursor: 'pointer',
      },
    }
  },
  menu: (styles) => {
    return {
      ...styles,
      backgroundColor: 'rgb(31 41 55 / 0.4);',
      maxWidth: '14rem',
      border: '2px solid #000000',
      borderRadius: '5px',
      boxShadow: '5px 5px 0px 0px rgba(0,0,0);',
    }
  },

  placeholder: (defaultStyles) => {
    return {
      ...defaultStyles,
      color: '#22c55e ',
      fontSize: '0.8rem',
      lineHeight: '1.75rem',
    }
  },
}