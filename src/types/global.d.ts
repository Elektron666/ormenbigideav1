// Global type definitions for ORMEN TEKSTİL

declare global {
  const __APP_VERSION__: string;
  const __BUILD_TIME__: string;
}

// Window extensions
declare interface Window {
  // Add any window extensions here if needed
}

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    VITE_APP_TITLE?: string;
    VITE_APP_VERSION?: string;
  }
}

// Module declarations for assets
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.bmp' {
  const content: string;
  export default content;
}

export {};