// Custom transition animasyonları
export const customTransitions = {
  // Camera modal için özel animasyon
  cameraModalTransition: {
    gestureDirection: 'vertical',
    cardStyleInterpolator: ({ current, next, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateY: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.height, 0],
              }),
            },
            {
              scale: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
          opacity: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        },
      };
    },
  },
  
  // Tab screen geçişleri için özel animasyon
  tabScreenTransition: {
    gestureDirection: 'horizontal',
    cardStyleInterpolator: ({ current, next, layouts }) => {
      const translateX = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [layouts.screen.width, 0],
      });
      
      const opacity = current.progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.8, 1],
      });

      return {
        cardStyle: {
          transform: [{ translateX }],
          opacity,
        },
      };
    },
  },
  
  // Fade geçiş animasyonu
  fadeTransition: {
    cardStyleInterpolator: ({ current, next }) => {
      return {
        cardStyle: {
          opacity: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        },
      };
    },
  },
  
  // Scale geçiş animasyonu  
  scaleTransition: {
    cardStyleInterpolator: ({ current, next, layouts }) => {
      const scale = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
      });
      
      const opacity = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      });

      return {
        cardStyle: {
          transform: [{ scale }],
          opacity,
        },
      };
    },
  },
}; 