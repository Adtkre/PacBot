const toggle = document.getElementById('botToggle') as HTMLInputElement;

toggle.addEventListener('change', () => {
    // We would send a message to the content script here
    console.log("Toggle changed: ", toggle.checked);
});
