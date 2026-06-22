const canvas = document.getElementById('spinWheel');
const ctx = canvas.getContext('2d');

// Layout Configuration
const blockWidth = 120;
const blockHeight = 80;
const gap = Math.floor((canvas.width-(blockWidth*5)) / 6); // Space between blocks

// State tracking: just an array of objects representing our blocks
let blocks = [];

// Drawing the wheel
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blocks.forEach((block, index) => {        
        const x = gap + index * (blockWidth + gap);
        const y = 10;

        ctx.fillStyle = '#313131';
        ctx.fillRect(x, y, blockWidth, blockHeight);

        ctx.strokeStyle = 'rgba(20, 238, 31, 0.83)'
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, blockWidth, blockHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index + 1, x + blockWidth / 2, y + blockHeight / 2);
    });
}

function addTask() {    
    if (blocks.length >= 5) {
        alert("Enough tasks for the day!");
        return;
    }

    blocks.push({});
    drawWheel();
}

function removeTask() {
    if (blocks.length > 0) {
        blocks.pop();
        drawWheel();
    }
}

// Wheel spinning
function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    spinSpeed = Math.random() * 10 + 20;
    const spinDuration = Math.random() * 5000 + 2500;
    const deceleration = spinSpeed / (spinDuration / 20);
    const spinInterval = setInterval(() => {
        currentAngle += (spinSpeed * Math.PI) / 180;
        spinSpeed -= deceleration;
        if (spinSpeed <= 0) {
            clearInterval(spinInterval);
            isSpinning = false;
            showResult();
        }
        drawWheel();
    }, 20);
}

function showResult() {
    const finalAngle = currentAngle % (2 * Math.PI);
    const winningIndex = Math.floor((sections.length - (finalAngle / (2 * Math.PI) * sections.length)) % sections.length);
    const winningAmount = sections[winningIndex];

    Swal.fire({
        title: 'Congratulations!',
        text: `You won ${winningAmount}`,
        icon: 'success',
        confirmButtonText: 'OK'
    });
}

drawWheel();