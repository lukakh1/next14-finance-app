const { cookies } = require('next/headers');

const useServerDarkMode = (defaultTheme = 'dark') => {
  return cookies().get('theme')?.value ?? defaultTheme;
};

export default useServerDarkMode;
