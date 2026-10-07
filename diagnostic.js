function runDiagnostics() {
    const report = [];
    report.push("=== RENDERING METHOD ===");
    const canvases = document.querySelectorAll("canvas");
    if (canvases.length > 0) {
        report.push(`Found ${canvases.length} <canvas> elements:`);
        canvases.forEach(c => {
            report.push(`- id="${c.id}", class="${c.className}", size=${c.width}x${c.height}`);
        });
    } else {
        report.push("No <canvas> elements found. Likely using DOM/SVG (DIVs).");
    }

    report.push("\n=== DOM ELEMENT SELECTORS (guesses based on keywords) ===");
    const keywords = ['pacman', 'pac', 'ghost', 'pellet', 'dot', 'pill', 'score', 'live', 'board', 'maze', 'player'];
    const foundElements = {};

    keywords.forEach(kw => {
        const els = document.querySelectorAll(`[class*="${kw}" i], [id*="${kw}" i]`);
        if (els.length > 0) {
            foundElements[kw] = Array.from(els);
            report.push(`Found ${els.length} elements for '${kw}':`);
            // take first element as example
            const sample = els[0];
            report.push(`  Example: <${sample.tagName.toLowerCase()} id="${sample.id}" class="${sample.className}">`);

            // check positioning
            const style = window.getComputedStyle(sample);
            if (style.position !== 'static' || style.transform !== 'none') {
                report.push(`  Positioning: position=${style.position}, left=${style.left}, top=${style.top}, transform=${style.transform}`);
            }
            if (sample.width || sample.height) report.push(`  Geometry: style.width=${style.width}, style.height=${style.height}`);
        }
    });

    report.push("\n=== EVENT LISTENERS ===");
    report.push("Since event listeners can't always be read via standard DOM methods, we will test dispatching synthetic keyboard events.");

    report.push("\n=== KEYBOARD INPUT TEST ===");
    report.push("To test if simulated events work, run this in console:");
    report.push("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', keyCode: 37, bubbles: true }));");
    report.push("window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', keyCode: 37, bubbles: true }));");
    report.push("If Pac-Man moves left to those events, simulated events are supported.");

    console.log(report.join("\n"));
    return "Check console for output, and let the AI know the results.";
}

runDiagnostics();
