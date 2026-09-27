// Run before React and the stylesheet to avoid a flash of the wrong theme.
try {
  const theme = localStorage.getItem('ghar-theme') === 'dark' ? 'dark' : 'light'
  document.documentElement.classList.toggle('dark', theme === 'dark')
} catch {
  // Light mode remains usable when browser storage is unavailable.
}
