const grid = document.getElementById('grid');
const canvasData = {}; // Stores { "YYYY-MM-DD": level }

// Build the grid of 364 days
for (let i = 0; i < 364; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';

    // Calculate the date for this specific square
    const date = new Date();
    date.setDate(date.getDate() - (364 - i));
    const dateStr = date.toISOString().split('T')[0];

    cell.onclick = () => {
        // Cycle intensity: 0 -> 1 -> 2 -> 3 -> 0
        let level = canvasData[dateStr] || 0;
        level = (level + 1) % 4;
        canvasData[dateStr] = level;

        // Update appearance
        cell.className = 'cell';
        if (level > 0) cell.classList.add(`level-${level}`);
    };
    grid.appendChild(cell);
}

// Function to send data to Python
async function deployArt() {
    const filteredData = Object.fromEntries(
        Object.entries(canvasData).filter(([_, lvl]) => lvl > 0)
    );

    const response = await fetch('/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filteredData)
    });
    const res = await response.json();
    alert(res.message);
}

// Function to trigger the Git Push
async function pushToGitHub() {
    const response = await fetch('/deploy_to_github', { method: 'POST' });
    const res = await response.json();
    alert(res.message);
}

function clearCanvas() {
    document.querySelectorAll('.cell').forEach(c => c.className = 'cell');
    for (let key in canvasData) delete canvasData[key];
}