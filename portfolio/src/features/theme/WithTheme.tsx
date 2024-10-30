// src/features/theme/withTheme.tsx

import React from 'react';
import { useTheme } from '@/hooks/theme/useTheme';
import { ThemeMode } from '@/types/theme.d';

interface WithThemeProps {
  theme: ThemeMode;
  toggleTheme: () => void;
}

export const withTheme = <P extends WithThemeProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithThemeComponent(props: Omit<P, keyof WithThemeProps>) {
    const { theme, toggleTheme } = useTheme();

    return (
      <WrappedComponent
        {...(props as P)}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  };
};

// Usage example:
// const MyComponent = withTheme(({ theme, toggleTheme, ...props }) => {
//   return (
//     <div className={theme === 'dark' ? 'bg-dark' : 'bg-light'}>
//       <button onClick={toggleTheme}>Toggle Theme</button>
//     </div>
//   );
// });