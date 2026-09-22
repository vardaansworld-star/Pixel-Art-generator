const UI_CANVAS_SIZE=512;
let currentGridSize=16;
let activeTool='pencil';
let activeColor='#3a5a40';
let isGridVisible=true;
let isPointerDown=false;
let previousCol=-1;
let previousRow=-1;
let canvasData=[];

const canvas=document.getElementById('drawing-board');
const context=canvas.getContext('2d');
const elements={
    sizeSelector:document.getElementById('grid-size'),
    colorPicker:document.getElementById('color-picker'),
    hexLabel:document.getElementById('hex-value'),
    gridToggle:document.getElementById('grid-toggle'),
    toolButtons:document.querySelectorAll('.tool-btn'),
    swatches:document.querySelectorAll('.color-swatch'),
    btnClear:document.getElementById('btn-clear'),
    btnExport:document.getElementById('btn-export')
};
function setup(){
    canvas.width=UI_CANVAS_SIZE;
    canvas.height=UI_CANVAS_SIZE;
    initializeGridData();
    renderCanvas();
    bindEvents();
}
function initializeGridData(){
    canvasData=[];
    for(let row=0; row <currentGridSize;row++){
        canvasData.push(new Array(currentGridSize).fill(null));
    }
}
function bindEvents(){
    canvas.addEventListener('mousedown',startPaint);
    canvas.addEventListener('mousemove',dragPaint);
    window.addEventListener('mouseup',stopPaint);

    elements.sizeSelector.addEventListener('change',(e)=>{
        currentGridSize=parseInt(e.target.value, 10);
        initializeGridData();
        renderCanvas();
    });

    elements.colorPicker.addEventListener('input', (e) => {
        updateActiveColor(e.target.value);
    });
    elements.swatches.forEach(swatch=>{
        swatch.addEventListener('click',(e)=>{
            updateActiveColor(e.target.dataset.color);
            if (activeTool==='eraser') updateActiveTool('pencil');
        });
    });

    elements.toolButtons.forEach(btn => {
        btn.addEventListener('click',(e) =>updateActiveTool(e.target.dataset.tool));
    });
    elements.gridToggle.addEventListener('change',(e)=>{
        isGridVisible = e.target.checked;
        renderCanvas();
    });

    elements.btnClear.addEventListener('click',()=>{
        initializeGridData();
        renderCanvas();
    });

    elements.btnExport.addEventListener('click', exportArtwork);
}
function updateActiveColor(colorHex){
    activeColor=colorHex;
    elements.colorPicker.value=activeColor;
    elements.hexLabel.textContent=activeColor;
}
function updateActiveTool(toolName){
    activeTool=toolName;
    elements.toolButtons.forEach(btn =>{
        if(btn.dataset.tool===activeTool){
            btn.classList.add('active');
        }else{
            btn.classList.remove('active');
        }
    });
}
function renderCanvas(){
    context.clearRect(0,0,UI_CANVAS_SIZE,UI_CANVAS_SIZE);
    const cellSize=UI_CANVAS_SIZE/currentGridSize;

    for (let r=0; r< currentGridSize;r++){
        for(let c =0;c<currentGridSize;c++){
            if (canvasData[r][c]){
                context.fillStyle=canvasData[r][c];
                context.fillRect(c*cellSize,r*cellSize,cellSize,cellSize);
            }
        }
    }
    if(isGridVisible){
        context.strokeStyle='#e2e4e9';
        context.lineWidth=1;

        for(let i=0;i<=currentGridSize;i++){
            context.beginPath();
            context.moveTo(i*cellSize,0);
            context.lineTo(i*cellSize,UI_CANVAS_SIZE);
            context.stroke();
            context.beginPath();
            context.moveTo(0,i*cellSize);
            context.lineTo(UI_CANVAS_SIZE,i*cellSize);
            context.stroke();
        }
    }
}

function getCanvasCoordinates(e){
    const rect=canvas.getBoundingClientRect();
    const scale=UI_CANVAS_SIZE/rect.width;
    const mouseX=(e.clientX-rect.left)*scale;
    const mouseY=(e.clientY-rect.top)*scale;
    let col=Math.floor(mouseX/(UI_CANVAS_SIZE/ currentGridSize));
    let row=Math.floor(mouseY /(UI_CANVAS_SIZE/currentGridSize));
    col=Math.max(0,Math.min(currentGridSize- 1,col));
    row=Math.max(0,Math.min(currentGridSize- 1, row));
    return{col,row};
}
function startPaint(e){
    isPointerDown=true;
    const coords=getCanvasCoordinates(e);
    previousCol=coords.col;
    previousRow=coords.row;
    executeToolAction(coords.col,coords.row);
}
function dragPaint(e){
    if(!isPointerDown) return;
    const coords=getCanvasCoordinates(e);
    connectPaintStrokes(previousCol,previousRow,coords.col,coords.row);
    previousCol=coords.col;
    previousRow=coords.row;
}
function stopPaint(){
    isPointerDown=false;
    previousCol=-1;
    previousRow=-1;
}
function executeToolAction(col, row){
    if (activeTool==='pencil'){
        canvasData[row][col] = activeColor;
    }else if(activeTool==='eraser'){
        canvasData[row][col]=null;
    }else if(activeTool==='eyedropper'){
        const selectedColor=canvasData[row][col];
        if(selectedColor){
            updateActiveColor(selectedColor);
        }
        updateActiveTool('pencil');
    }
    renderCanvas();
}
function connectPaintStrokes(startX,startY,endX,endY){
    let deltaX=Math.abs(endX-startX);
    let deltaY=Math.abs(endY-startY);
    let stepX=startX<endX ? 1: -1;
    let stepY=startY< endY ? 1:-1;
    let error=deltaX-deltaY;

    while (true){
        executeToolAction(startX,startY);
        if (startX===endX && startY=== endY)break;
        let errorDouble=2*error;
        if(errorDouble>-deltaY){error-=deltaY;startX +=stepX;}
        if (errorDouble<deltaX){error+=deltaX;startY+=stepY;}
    }
}
function exportArtwork(){
    const exportCanvas=document.createElement('canvas');
    const exportCtx=exportCanvas.getContext('2d');
    exportCanvas.width=UI_CANVAS_SIZE;
    exportCanvas.height=UI_CANVAS_SIZE;
    exportCtx.imageSmoothingEnabled=false;
    const cellSize = UI_CANVAS_SIZE /currentGridSize;
    for (let r=0;r<currentGridSize;r++){
        for(let c=0;c<currentGridSize;c++){
            if (canvasData[r][c]){
                exportCtx.fillStyle=canvasData[r][c];
                exportCtx.fillRect(c*cellSize,r*cellSize,cellSize, cellSize);
            }
        }
    }
    const anchor=document.createElement('a');
    anchor.download=`pixel-art.png`;
    anchor.href=exportCanvas.toDataURL('image/png');
    anchor.click();
}
setup();