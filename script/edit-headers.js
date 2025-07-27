// Editible headers
// If it's a new session (tab closed and reopened), reset all saved titles
if (!sessionStorage.getItem('sessionStarted')) {
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('tempTitle_')) {
            localStorage.removeItem(key);
        }
    });
    sessionStorage.setItem('sessionStarted', 'true');
}
