// JavaScript code for rendering the procedural image
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const frequencySlider = document.getElementById("frequencySlider");
const speedSlider = document.getElementById("speedSlider");
const contrastSlider = document.getElementById("contrastSlider");
const angleSlider = document.getElementById("angleSlider");
const toggleButton = document.getElementById("toggleButton");

let phase = 0;
let animationRunning = true;

toggleButton.addEventListener("click", () => {
  animationRunning = !animationRunning;
  if (animationRunning) {
    toggleButton.textContent = "Pause Animation";
    requestAnimationFrame(updateImage);
  } else {
    toggleButton.textContent = "Resume Animation";
  }
});

// Add event listeners to the sliders to update the image when changed
frequencySlider.addEventListener("input", drawProceduralImage);
speedSlider.addEventListener("input", drawProceduralImage);
contrastSlider.addEventListener("input", drawProceduralImage);
angleSlider.addEventListener("input", drawProceduralImage);

// Add a click event listener to update the angle when the user left-clicks on the canvas
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Calculate the angle in radians based on the click position relative to the canvas center
  const deltaX = clickX - centerX;
  const deltaY = centerY - clickY; // Invert deltaY to account for canvas coordinate system
  const newAngle = Math.atan2(deltaY, deltaX) + Math.PI;

  // Convert the angle to degrees and update the angle and angleSlider
  const newAngleDegrees = (newAngle * 180) / Math.PI;
  angleSlider.value = newAngleDegrees;
  drawProceduralImage();
});

function drawProceduralImage() {
  const width = canvas.width;
  const height = canvas.height;
  const frequency = parseFloat(frequencySlider.value);
  const contrast = parseFloat(contrastSlider.value) / 100; // Convert contrast to a factor
  const angle = parseFloat(angleSlider.value) * (Math.PI / 180); // Convert angle to radians

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Calculate the pixel's position in rotated coordinates
      const xRotated =
        (x - width / 2) * Math.cos(angle) -
        (y - height / 2) * Math.sin(angle) +
        width / 2;
      const yRotated =
        (x - width / 2) * Math.sin(angle) +
        (y - height / 2) * Math.cos(angle) +
        height / 2;

      const sineValue = Math.sin(
        (xRotated / width) * 2 * Math.PI * frequency + (phase * Math.PI) / 180,
      );
      const pixelValue = 128 + 127 * sineValue * contrast; // Apply contrast

      const index = (x + y * width) * 4;
      data[index] = pixelValue; // Set the pixel value based on the sine wave value and contrast
      data[index + 1] = pixelValue; // Green channel
      data[index + 2] = pixelValue; // Blue channel
      data[index + 3] = 255; // Alpha channel (fully opaque)
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function updateImage() {
  if (animationRunning) {
    drawProceduralImage();

    // Update the phase based on the speed
    phase += parseFloat(speedSlider.value);
    if (phase >= 360) {
      phase -= 360;
    }

    // Request the next animation frame
    requestAnimationFrame(updateImage);
  }
}

// Start the animation loop initially
updateImage();
// </script>
