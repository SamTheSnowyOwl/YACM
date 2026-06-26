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

let currentX = document.getElementById('blockPointer').style.right;
let spinSpeed = 0;
let isSpinning = false;

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
        ctx.fillText(block.name, x + blockWidth / 2, y + blockHeight / 2, blockWidth - 20);
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
        itx.fillText(block.name, x + blockWidth / 2, y + blockHeight / 2, blockWidth - 20);
    });
}

function handleCanvasClick(event, canvas, sourceArray, targetArray, delToggle) {
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

    if (delToggle && clickedIndex !== null) {
        sourceArray.splice(clickedIndex, 1);
        draw();
    }
    
    else if (clickedIndex !== null) {
        if (targetArray === iblocks && targetArray.length >= 40) {
            Swal.fire({
                title: 'Get to work!',
                text: `Finish previous tasks to add more.`,
                icon: 'warning',
                heightAuto: false,
                confirmButtonText: 'OK'
            });
            return;
        } else if (targetArray === blocks && targetArray.length >= 5) {
            Swal.fire({
                title: 'Overload',
                text: `Enough tasks for one day!`,
                icon: 'warning',
                heightAuto: false,
                confirmButtonText: 'OK'
            });            
            return;
        } else {
            const [movedBlock] = sourceArray.splice(clickedIndex, 1);
            targetArray.push(movedBlock);
            draw();
        }        
    }
}

let delToggle = 0;

canvas.addEventListener('click', (e) => handleCanvasClick(e, canvas, blocks, iblocks, delToggle));
ianvas.addEventListener('click', (e) => handleCanvasClick(e, ianvas, iblocks, blocks, delToggle));

function addTask() {    
    if (iblocks.length >= 40) {
        Swal.fire({
            title: 'Get to work!',
            text: `Finish previous tasks to add more.`,
            icon: 'warning',
            heightAuto: false,
            confirmButtonText: 'OK'
        });
        return;
    }

    Swal.fire({
        title: 'Enter Task Name',
        input: 'text',
        inputPlaceholder: 'e.g. Clean Room, Read...',
        showCancelButton: true,
        confirmButtonText: 'Add Task',
        heightAuto: false,
        inputValidator: (value) => {
            if (!value) {
                return 'Your task needs a name.';
            }
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            iblocks.push({name: result.value});
            draw();
        }
    });

}

function removeTask() {
    delToggle = (delToggle+1) % 2;    
}

// Wheel spinning
function spinWheel() {
    const pointer = document.getElementById('blockPointer');

    if (blocks.length === 0) {
        Swal.fire({
            title: 'Error',
            text: `Add tasks to spin.`,
            icon: 'error',
            heightAuto: false,
            confirmButtonText: 'OK'
        });
        return;
    }

    if (isSpinning) return;
    isSpinning = true; 
    spinSpeed = Math.random() * 100 + 100;
    const spinDuration = Math.random() * 5000 + 5000;
    const deceleration = spinSpeed / (spinDuration / 100);
    let spinCount = 1;

    const spinInterval = setInterval(() => {
        let rightVal = parseInt(pointer.style.right, 10);
        if (rightVal <= 5) {
            pointer.style.right = `${(6 - rightVal) + rightVal}px`;            
            spinCount++;        
        } else if (rightVal >= 735) {
            pointer.style.right = `${rightVal - (rightVal-734)}px`;                    
            spinCount++;
        } else if (spinCount%2 == 1) {
            pointer.style.right = `${rightVal - spinSpeed}px`;
        } else {
            pointer.style.right = `${rightVal + spinSpeed}px`;
        }        
        spinSpeed -= deceleration;
        if (spinSpeed <= 0) {
            clearInterval(spinInterval);
            isSpinning = false;
            setTimeout(() => {
                showResult();
            }, 500);                        
        }                
    }, 20);
}

function showResult() {
    const finalPos = parseInt(document.getElementById('blockPointer').style.right, 10);
    const winningIndex = Math.floor(((735 - finalPos) / (730 / blocks.length)));
    const winningBlock = blocks[winningIndex].name;
    
    Swal.fire({
        title: 'Task Selected',
        text: `Get to work on ${winningBlock}`,
        icon: 'success',
        heightAuto: false,
        confirmButtonText: 'OK'
    });
}

function draw() {
    drawWheel();
    drawInventory();
}

draw();