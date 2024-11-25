// Function to generate and update background squares
const updateSquares = () => {
    const isDark = document.body.classList.contains('dark');
    const squareCount = 10; // Number of background squares
    const squaresContainer = document.body;

    // Remove old squares
    document.querySelectorAll('.square').forEach(square => square.remove());

    // Add new squares with random size and position
    for (let i = 0; i < squareCount; i++) {
        const square = document.createElement('div');
        square.classList.add('square');

        // Randomize size and position
        const size = Math.random() * 200 + 50; // Between 50px and 250px
        const top = Math.random() * 100; // 0% to 100% of viewport height
        const left = Math.random() * 100; // 0% to 100% of viewport width
        const rotate = Math.random() * 360; // Random rotation

        square.style.width = `${size}px`;
        square.style.height = `${size}px`;
        square.style.top = `${top}vh`;
        square.style.left = `${left}vw`;
        square.style.transform = `rotate(${rotate}deg)`;

        squaresContainer.appendChild(square);
    }
};

// Add event listener for theme toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    updateSquares();
});

// Initialize the squares on page load
document.addEventListener('DOMContentLoaded', () => {
    updateSquares(); // Ensure squares are initialized on load
});
