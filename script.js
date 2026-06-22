const canvas = document.getElementById('spinWheel');
const ctx = canvas.getContext('2d');

const ianvas = document.getElementById('inventory');
const itx = ianvas.getContext('2d');

// Layout Configuration
const blockWidth = 120;
const blockHeight = 80;
const gap = Math.floor((canvas.width-(blockWidth*5)) / 6); 
const igap = 26;

// State tracking: just an array of objects representing our blocks
let blocks = [];
let iblocks = [];

const imaxCols = Math.floor((ianvas.width - igap) / (blockWidth + igap));

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

function drawInventory() {
    itx.clearRect(0, 0, ianvas.width, ianvas.height);
    iblocks.forEach((block, index) => {
        const col = index % imaxCols;
        const row = Math.floor(index / imaxCols);

        const x = igap + col * (blockWidth + igap);
        const y = igap + row * (blockHeight + igap);

        itx.fillStyle = '#313131';
        itx.fillRect(x, y, blockWidth, blockHeight);

        itx.strokeStyle = 'rgba(20, 238, 31, 0.83)'
        itx.lineWidth = 1;
        itx.strokeRect(x, y, blockWidth, blockHeight);

        itx.fillStyle = '#ffffff';
        itx.font = 'bold 14px Arial';
        itx.textAlign = 'center';
        itx.textBaseline = 'middle';
        itx.fillText(index + 1, x + blockWidth / 2, y + blockHeight / 2);
    });
}

function handleCanvasClick(event, canvas, sourceArray, targetArray) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let clickedIndex = null;

    sourceArray.forEach((block, index) => {
        let x,y;
        if (canvas===ianvas) {
            const col = index % imaxCols;
            const row = Math.floor(index / imaxCols);

            x = igap + col * (blockWidth + igap);
            y = igap + row * (blockHeight + igap);
        } else {
            x = gap + index * (blockWidth + gap);
            y = 10;
        }

        if (mouseX >= x && mouseX <= x + blockWidth &&
            mouseY >= y && mouseY <= y + blockHeight) {
                clickedIndex = index;
        }
    });

    if (clickedIndex !== null) {
        const [movedBlock] = sourceArray.splice(clickedIndex, 1);
        targetArray.push(movedBlock);
        draw();
    }
}

canvas.addEventListener('click', (e) => handleCanvasClick(e, canvas, blocks, iblocks));
ianvas.addEventListener('click', (e) => handleCanvasClick(e, ianvas, iblocks, blocks));

function addTask() {    
    if (iblocks.length >= 40) {
        alert("Nah");
        return;
    }

    iblocks.push({});
    draw();
}

function removeTask() {
    if (blocks.length > 0) {
        blocks.pop();
        draw();
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

function draw() {
    drawWheel();
    drawInventory();
}

draw();