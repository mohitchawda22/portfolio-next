export type PreloaderTheme = {
  background: string
  line: string
  lineMuted: string
  text: string
  counter: string
  counterMuted: string
  accent: string
}

/** Loader is always black with light UI — independent of site theme. */
export const PRELOADER_THEME: PreloaderTheme = {
  background: '#000000',
  line: '#FFFFFF',
  lineMuted: 'rgba(255, 255, 255, 0.2)',
  text: '#FFFFFF',
  counter: '#FAFAFA',
  counterMuted: 'rgba(250, 250, 250, 0.55)',
  accent: '#E3FF47',
}

export const PRELOADER_INIT_SCRIPT = `(function(){try{var d=document.documentElement;d.setAttribute('data-preloader','active');d.setAttribute('data-preloader-lock','');d.style.setProperty('--preloader-surface','#000000');d.style.backgroundColor='#000000';document.body.style.backgroundColor='#000000';}catch(e){document.documentElement.setAttribute('data-preloader','active');document.documentElement.setAttribute('data-preloader-lock','');}})();`

// Legacy exports
export const PRELOADER_PIXEL = {
  light: '#FFFFFF',
  dark: '#FFFFFF',
} as const

export function getPreloaderPixelColor() {
  return PRELOADER_THEME.line
}
