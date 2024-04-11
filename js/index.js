const combineCheckbox = document.getElementById('combine');
const widthInput = document.getElementById('widthInput').querySelector('input');
const heightInput = document.getElementById('heightInput').querySelector('input');
const widthHeightInput = document.getElementById('widthHeightInput').querySelector('input');

function toggleInputs() {
	if (combineCheckbox.checked) {
		widthHeightInput.parentElement.style.display = 'block';
		widthHeightInput.value = widthInput.value;
		widthInput.parentElement.style.display = 'none';
		heightInput.parentElement.style.display = 'none';
	} else {
		widthHeightInput.parentElement.style.display = 'none';
		widthInput.value = widthHeightInput.value;
		heightInput.value = widthHeightInput.value;

		widthInput.parentElement.style.display = 'block';
		heightInput.parentElement.style.display = 'block';
	}
}

const fileInput = document.getElementById('file-input');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const gridContainer = document.getElementById('grid-container');
const gridCanvas = document.getElementById('grid-canvas');
const ctx = gridCanvas.getContext('2d');

fileInput.addEventListener('change', () => {
	gridContainer.innerHTML = '';
	const files = Array.from(fileInput.files);
	console.log(files);
	files.forEach((file, index) => {
		const img = document.createElement('img');
		img.onload = () => URL.revokeObjectURL(img.src);
		img.src = URL.createObjectURL(file);
		img.classList.add('box');
		img.id = `img-${index}`;
		img.draggable = true;
		addDragAndDrop(img);
		//
		const cell = document.createElement('div');
		cell.classList.add('grid-cell');
		cell.appendChild(img);
		gridContainer.appendChild(cell);
	});

	gridContainer.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(files.length))}, 131px)`;
});

generateBtn.addEventListener('click', () => {
	gridCanvas.innerHTML = '';
	const images = Array.from(gridContainer.querySelectorAll('img'));
	const gridSize = Math.ceil(Math.sqrt(images.length));

	const cellWidth = combineCheckbox.checked ? widthHeightInput.value : widthInput.value;
	const cellHeight = combineCheckbox.checked ? widthHeightInput.value : heightInput.value;

	const width = gridSize * cellWidth;
	const height = gridSize * cellHeight;

	gridCanvas.width = width;
	gridCanvas.height = height;
	ctx.clearRect(0, 0, width, height);

	// Set canvas background color to transparent
	ctx.fillStyle = 'rgba(0, 0, 0, 0)';
	ctx.fillRect(0, 0, width, height);

	images.forEach((img, index) => {
		let drawWidth = cellWidth;
		let drawHeight = cellHeight;

		// Calculate scale factor to maintain aspect ratio
		const scaleFactor = Math.min(cellWidth / img.width, cellHeight / img.height);

		// Calculate scaled dimensions
		drawWidth = img.width * scaleFactor;
		drawHeight = img.height * scaleFactor;

		// Calculate position to center image
		const x = (index % gridSize) * cellWidth + (cellWidth - drawWidth) / 2;
		const y = Math.floor(index / gridSize) * cellHeight + (cellHeight - drawHeight) / 2;

		ctx.drawImage(img, x, y, drawWidth, drawHeight);
	});

	const newImage = new Image();
	newImage.src = gridCanvas.toDataURL();
	newImage.style.height = '512px';
	newImage.style.width = '512px';

	document.body.appendChild(newImage);
	downloadBtn.style.display = 'inline'; // Show download button
	downloadBtn.href = newImage.src; // Set download button href
	downloadBtn.download = 'grid_image.png'; // Set download file

	gridCanvas.appendChild(newImage);
});

////

// Logic for drag and drop image change

////

let dragged;

function drag(event) {
	dragged = event.target;
	console.log('HERE!');
}

function drop(event) {
	event.preventDefault();
	const target = event.target;

	if (dragged.tagName === 'IMG' && target.tagName === 'IMG' && dragged !== target) {
		const draggedParent = dragged.parentNode;
		const parent = target.parentNode;

		parent.appendChild(dragged);
		draggedParent.appendChild(target);
	}

	dragged = undefined;
}

function allowDrop(event) {
	event.preventDefault();
}

const addDragAndDrop = (element) => {
	element.addEventListener('dragstart', drag);
	element.addEventListener('dragover', allowDrop);
	element.addEventListener('drop', drop);
};
