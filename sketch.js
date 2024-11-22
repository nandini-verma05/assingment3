let balloons = []; // Array to hold multiple balloons
let isInflating = false;
let backgroundImage, machineImage, handleImage, pumpImage; // Variables for images
let handleX, handleY; // Handle's position
let pumpX, pumpY; // Pump position
let machineX, machineY, machineWidth, machineHeight;
// Machine's position and dimensions

// Arrays to hold balloon images and alphabet images
let balloonImages = [];
let alphabetImages = []; // Holds images for each alphabet (A-Z)

let currentAlphabetIndex = 0; // Track the current alphabet index (0 for 'A', 1 for 'B', ...)

function preload() {
    backgroundImage = loadImage('assets/symbol 3 copy.png'); // Load background image
    machineImage = loadImage('assets/machine.png'); // Load machine image
    handleImage = loadImage('assets/handle.png'); // Load handle image
    pumpImage = loadImage('assets/pump.png'); // Load pump image

    // Load balloon images
    for (let i = 1; i <= 10; i++) {
        balloonImages.push(loadImage(`assets/baloon/${i}.png`));
    }

    // Load alphabet images (A-Z)
    for (let i = 65; i <= 90; i++) {
        let char = String.fromCharCode(i); // Convert ASCII value to character
        alphabetImages.push(loadImage(`assets/alphabet/${char}.png`));
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Initialize machine dimensions and position
    machineWidth = 200;
    machineHeight = 200;
    machineX = width - machineWidth - 20;
    machineY = height - machineHeight - 20;

    // Initialize handle position directly above the machine
    handleX = machineX + machineWidth / 2 - 25; // Centered on top of the machine
    handleY = machineY - 50; // Adjusted height above the machine

    // Pump position
    pumpX = machineX - 40;
    pumpY = machineY + machineHeight / 2 - 60; // Corrected case for machineHeight

    // Generate initial balloons
    generateNewBalloon();
}

function draw() {
    background(backgroundImage); // Set the background

    // Draw the machine image
    image(machineImage, machineX, machineY, machineWidth, machineHeight);

    // Draw the handle image
    let handleWidth = 50;
    let handleHeight = 100;
    image(handleImage, handleX, handleY, handleWidth, handleHeight);

    // Draw the pump image
    let pumpWidth = 100;
    let pumpHeight = 100;
    image(pumpImage, pumpX, pumpY, pumpWidth, pumpHeight);

    // Update and display all balloons
    for (let balloon of balloons) {
        balloon.update();
        balloon.display();
    }

    // Regenerate balloons if less than a certain number
    if (balloons.length < 5) {
        generateNewBalloon();
    }
}

function mousePressed() {
    // Check if the handle is clicked
    let handleWidth = 50; // Handle width
    let handleHeight = 100; // Handle height
    if (
        mouseX > handleX &&
        mouseX < handleX + handleWidth &&
        mouseY > handleY &&
        mouseY < handleY + handleHeight
    ) {
        isInflating = true; // Enable inflation
        for (let balloon of balloons) {
            if (!balloon.isFlying) {
                balloon.inflate(); // Inflate the first non-flying balloon
                animateHandle(); // Animate the handle
                break;
            }
        }
    }

    // Check if a balloon is clicked
    for (let balloon of balloons) {
        if (dist(mouseX, mouseY, balloon.x, balloon.y) < balloon.size / 2) {
            balloon.burst(); // Burst the clicked balloon
        }
    }
}

function animateHandle() {
    handleY += 10; // Move handle down
    setTimeout(() => {
        handleY -= 10; // Move handle back up
    }, 200); // Reset after 200ms
}

// Function to generate a new balloon
function generateNewBalloon() {
    if (currentAlphabetIndex >= alphabetImages.length) {
        currentAlphabetIndex = 0; // Reset to 'A' after reaching 'Z'
    }
    let newBalloon = new Balloon(currentAlphabetIndex);
    balloons.push(newBalloon);
    currentAlphabetIndex++; // Move to the next alphabet
}

class Balloon {
    constructor(alphabetIndex) {
        this.x = width - 260; // Start near the machine
        this.y = height - 145; // Start above the machine
        this.size = 50;
        this.isFlying = false;
        this.speed = 2;
        this.direction = createVector(random(-1, 1), random(-1, -2));

        // Randomly select a balloon image
        this.imageIndex = floor(random(balloonImages.length));
        this.image = balloonImages[this.imageIndex];

        // Assign the given alphabet index
        this.alphabetIndex = alphabetIndex;
        this.letter = String.fromCharCode(65 + this.alphabetIndex); // Alphabet (A-Z)
        this.alphabetImage = alphabetImages[this.alphabetIndex];
        this.order = this.alphabetIndex + 1; // Alphabetical order
    }

    inflate() {
        if (this.size < 100) { // Max size limit
            this.size += 5; // Inflate size
            this.image.resize(this.size, this.size); // Resize image according to size
        } else {
            this.isFlying = true; // Start flying when fully inflated
        }
    }

    update() {
        if (this.isFlying) {
            this.x += this.direction.x * this.speed;
            this.y += this.direction.y * this.speed;
            // Bounce off walls
            if (this.x < 0 || this.x > width) {
                this.direction.x *= -1;
            }
            if (this.y < 0 || this.y > height) {
                this.direction.y *= -1;
            }
        }
    }

    display() {
        // Display the balloon image
        image(this.image, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

        // If fully inflated, show the alphabet
        if (this.isFlying) {
            image(this.alphabetImage, this.x - 20, this.y - 50, 40, 40); // Display the letter image above the balloon
        }
    }

    burst() {
        this.isFlying = false;
        this.size = 0; // Reset balloon size
        setTimeout(() => {
            balloons.splice(balloons.indexOf(this), 1); // Remove the balloon from the array
        }, 500);
    }
}
