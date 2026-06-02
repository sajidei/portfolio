:root {
    --bg: #0f172a;
    --surface: #111827;
    --surface-light: #1f2937;
    --text: #f9fafb;
    --muted: #cbd5e1;
    --border: #334155;
    --accent: #2563eb;
    --accent-hover: #1d4ed8;
    --disabled: #64748b;
}

body.light {
    --bg: #f8fafc;
    --surface: #ffffff;
    --surface-light: #eef2ff;
    --text: #111827;
    --muted: #475569;
    --border: #cbd5e1;
    --accent: #2563eb;
    --accent-hover: #1d4ed8;
    --disabled: #94a3b8;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
    transition: background 0.25s ease, color 0.25s ease;
}

.hero {
    position: relative;
    text-align: center;
    padding: 70px 20px 55px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
}

.hero h1 {
    margin: 0 0 10px;
    font-size: clamp(2rem, 5vw, 4rem);
}

.hero p {
    color: var(--muted);
    margin: 0;
}

.theme-toggle {
    position: absolute;
    top: 18px;
    right: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--muted);
    font-size: 0.9rem;
}

.theme-toggle button {
    border: 1px solid var(--border);
    background: var(--surface-light);
    color: var(--text);
    border-radius: 999px;
    padding: 7px 14px;
    cursor: pointer;
    font-weight: bold;
}

main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px 18px 50px;
}

section {
    margin: 34px 0;
}

h2 {
    margin-bottom: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 18px;
}

.card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 22px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.16);
}

.card h3 {
    margin: 0 0 10px;
}

.card p {
    color: var(--muted);
    line-height: 1.5;
}

.buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 16px;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    background: var(--accent);
    color: white;
    padding: 11px 16px;
    border-radius: 12px;
    font-weight: bold;
    border: none;
    min-height: 42px;
}

.btn:hover {
    background: var(--accent-hover);
}

.btn.secondary {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border);
}

.btn.disabled {
    background: var(--disabled);
    cursor: default;
    pointer-events: none;
}

.apk-wrapper {
    position: relative;
    display: inline-flex;
}

.help-btn {
    position: absolute;
    top: -9px;
    right: -9px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid var(--surface);
    background: #facc15;
    color: #111827;
    font-weight: bold;
    cursor: pointer;
    font-size: 0.8rem;
    line-height: 1;
}

.empty {
    text-align: center;
    font-size: 1.1rem;
}

footer {
    text-align: center;
    padding: 28px;
    color: var(--muted);
    border-top: 1px solid var(--border);
}

.modal {
    position: fixed;
    inset: 0;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(0,0,0,0.65);
    z-index: 100;
}

.modal.open {
    display: flex;
}

.modal-content {
    position: relative;
    width: min(520px, 100%);
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
}

.modal-content p {
    color: var(--muted);
    line-height: 1.55;
}

.close-modal {
    position: absolute;
    top: 12px;
    right: 14px;
    border: none;
    background: transparent;
    color: var(--text);
    font-size: 2rem;
    cursor: pointer;
}

@media (max-width: 600px) {
    .theme-toggle {
        position: static;
        justify-content: center;
        margin-bottom: 28px;
    }

    .hero {
        padding-top: 35px;
    }

    .btn {
        width: 100%;
    }

    .apk-wrapper {
        width: 100%;
    }
}
