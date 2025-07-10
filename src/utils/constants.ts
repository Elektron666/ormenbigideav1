// Application constants for ORMEN TEKSTİL

export const APP_CONFIG = {
  name: 'ORMEN TEKSTİL',
  version: __APP_VERSION__ || '1.2.0',
  buildTime: __BUILD_TIME__ || new Date().toISOString(),
  description: 'Kartela Yönetim Sistemi V1.2',
  author: 'ORMEN TEKSTİL',
} as const;

export const AUTH_CONFIG = {
  username: 'ORMEN',
  password: 'ORMEN666-F1',
  sessionKey: 'ormen_session',
} as const;

export const STORAGE_KEYS = {
  customers: 'kartela_customers',
  products: 'kartela_products',
  movements: 'kartela_movements',
  currentUser: 'kartela_current_user',
  notes: 'ormen_notes',
  stockItems: 'ormen_stock_items',
  settings: 'ormen_settings',
} as const;

export const UI_CONFIG = {
  sidebarWidth: 256,
  headerHeight: 64,
  maxModalWidth: 1024,
  animationDuration: 300,
  debounceDelay: 300,
} as const;

export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  maxPages: 1000,
} as const;

export const VALIDATION_CONFIG = {
  minPasswordLength: 6,
  maxNameLength: 100,
  maxDescriptionLength: 500,
  maxNotesLength: 1000,
  phoneRegex: /^[\+]?[0-9\s\-\(\)]{10,}$/,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const MOVEMENT_TYPES = {
  given: 'Verildi',
  taken: 'Alındı',
  returned: 'İade Edildi',
} as const;

export const CATEGORIES = {
  pamuk: 'Pamuk',
  polyester: 'Polyester',
  viskon: 'Viskon',
  karisim: 'Karışım',
  diger: 'Diğer',
} as const;

export const NOTE_CATEGORIES = {
  motivation: 'Motivasyon',
  business: 'İş',
  personal: 'Kişisel',
  goals: 'Hedefler',
} as const;

export const STOCK_LOCATIONS = [
  'Depo A - Raf 1',
  'Depo A - Raf 2',
  'Depo B - Raf 1',
  'Depo B - Raf 2',
  'Depo B - Raf 3',
] as const;

export const DATE_FORMATS = {
  display: 'dd/MM/yyyy HH:mm',
  short: 'dd/MM/yyyy',
  long: 'dd MMMM yyyy HH:mm',
  iso: 'yyyy-MM-dd',
} as const;

export const CURRENCY_CONFIG = {
  locale: 'tr-TR',
  currency: 'TRY',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const;

export const EXPORT_CONFIG = {
  filePrefix: 'ormen-tekstil',
  dateFormat: 'yyyy-MM-dd',
  jsonIndent: 2,
  csvSeparator: ',',
} as const;

export const PERFORMANCE_CONFIG = {
  lazyLoadThreshold: 100,
  virtualScrollThreshold: 1000,
  debounceSearchDelay: 300,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
} as const;