let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
var constraints = {
    audio: false,
    video: {
        facingMode: 'user'
    }
}
video.setAttribute('autoplay', '');
video.setAttribute('muted', '');
video.setAttribute('playsinline', '')

function takeshot() {
  
    let div =
        document.getElementById('photoframe'); 
     
  
    html2canvas(div,{ 
        dpi: 144,
        allowTaint: true
      }).then(
        
        function (canvas) {
            
            return Canvas2Image.saveAsPNG(canvas);
        })
   
}
camera_button.addEventListener('click', async function() {
   	let stream = await navigator.mediaDevices.getUserMedia(constraints);
	  video.srcObject = stream;
});
camera_button.click();
click_button.addEventListener('click', function() {
   	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
   	let image_data_url = canvas.toDataURL('image/jpeg', 1.0); 
    //takeshot();
   	// data url of the image
   //	console.log(image_data_url);
});

// Frame Slider with dynamic loading
let count = 0;
const frameContainer = document.querySelector('.slider');
const nextItem = document.querySelector('.next');
const previousItem = document.querySelector('.previous');
let frames = [];

// Function to load frames dynamically from the frames folder
function loadFrames() {
    // Use JavaScript only approach
    console.log('Loading frames using JavaScript...');
    
    if (typeof getFramesJs === 'function') {
        frames = getFramesJs();
        if (frames.length > 0) {
            processFrames();
        } else {
            showFrameError("No frames found. Please add frames to the images/frames directory.");
        }
    } else {
        console.warn('getFramesJs function not found, trying to load it...');
        
        // Try to load the script
        loadScript('get-frames.js', function() {
            if (typeof getFramesJs === 'function') {
                frames = getFramesJs();
                if (frames.length > 0) {
                    processFrames();
                } else {
                    showFrameError("No frames found. Please add frames to the images/frames directory.");
                }
            } else {
                showFrameError("Frame loading function not available. Check if get-frames.js exists.");
            }
        });
    }
}

// Helper function to dynamically load a script
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    script.onerror = function() {
        showFrameError("Failed to load fallback script");
    };
    document.head.appendChild(script);
}

// Process the loaded frames
function processFrames() {
    // Clear the slider
    frameContainer.innerHTML = '';
    
    // Add frames to the slider
    frames.forEach((frame, index) => {
        const img = document.createElement('img');
        img.src = frame;
        img.classList.add('frame');
        if (index === 0) {
            img.classList.add('active');
        }
        frameContainer.appendChild(img);
    });
    
    // Set the default frame
    setActiveFrame(0);
    
    // Add click event to frames
    document.querySelectorAll('.frame').forEach(frame => {
        frame.addEventListener('click', function() {
            const imagePath = this.getAttribute('src');
            setFrameBackground(imagePath);
        });
    });
}

// Show an error message in the frame container
function showFrameError(message) {
    console.error(message);
    frameContainer.innerHTML = `
        <div class="frame-error">
            <p>${message}</p>
            <p>Please add frame images to the images/frames directory.</p>
        </div>
    `;
}

function setFrameBackground(imagePath) {
    console.log("Selected frame: " + imagePath);
    $('.framebg').css({"background-image": "url(" + imagePath + ")", "background-size": "100% 100%"});   
    $('#photoframe').css({"background-image": "url(" + imagePath + ")", "background-size": "100% 100%"});
}

function setActiveFrame(index) {
    if (frames.length === 0) return;
    
    // Remove active class from all frames
    document.querySelectorAll('.frame').forEach(frame => {
        frame.classList.remove('active');
    });
    
    // Add active class to current frame
    const frameElements = document.querySelectorAll('.frame');
    if (frameElements[index]) {
        frameElements[index].classList.add('active');
        setFrameBackground(frames[index]);
    }
}

function showNextItem() {
    if (frames.length === 0) return;
    
    if(count < frames.length - 1) {
        count++;
    } else {
        count = 0;
    }
    
    setActiveFrame(count);
    console.log("Current frame index:", count);
}

function showPreviousItem() {
    if (frames.length === 0) return;
    
    if(count > 0) {
        count--;
    } else {
        count = frames.length - 1;
    }
    
    setActiveFrame(count);
    console.log("Current frame index:", count);
}

nextItem.addEventListener('click', showNextItem);
previousItem.addEventListener('click', showPreviousItem);

$(document).ready(function(){
    // Load frames when the page loads
    loadFrames();
});