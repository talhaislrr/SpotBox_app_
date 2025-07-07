// Animasyon konfigürasyonları - Merkezi animasyon yönetimi

// Temel animasyon süreleri
export const animationDurations = {
  fast: 200,
  normal: 300,
  slow: 500,
  extraSlow: 800,
};

// Spring animasyon konfigürasyonları
export const springConfigs = {
  gentle: {
    tension: 80,
    friction: 8,
  },
  medium: {
    tension: 100,
    friction: 7,
  },
  bouncy: {
    tension: 200,
    friction: 6,
  },
  stiff: {
    stiffness: 200,
    damping: 25,
    mass: 1,
  },
};

// Timing animasyon konfigürasyonları
export const timingConfigs = {
  easeInOut: {
    duration: animationDurations.normal,
    useNativeDriver: true,
  },
  fadeIn: {
    duration: animationDurations.slow,
    useNativeDriver: true,
  },
  slideIn: {
    duration: animationDurations.normal,
    useNativeDriver: true,
  },
};

// Tab geçiş animasyon değerleri
export const tabAnimationValues = {
  scale: {
    small: 0.95,
    normal: 1,
    large: 1.05,
  },
  translate: {
    up: -20,
    down: 20,
    left: -50,
    right: 50,
  },
};

// Custom transition animasyon factory'si
export const createCustomTransition = (type, config = {}) => {
  const baseConfig = {
    gestureDirection: 'horizontal',
    gestureResponseDistance: 100,
    ...config,
  };

  switch (type) {
    case 'slideVertical':
      return {
        ...baseConfig,
        gestureDirection: 'vertical',
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateY: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.height, 0],
                }),
              },
            ],
          },
        }),
      };

    case 'fade':
      return {
        ...baseConfig,
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        }),
      };

    case 'scale':
      return {
        ...baseConfig,
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            transform: [
              {
                scale: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        }),
      };

    default:
      return baseConfig;
  }
}; 