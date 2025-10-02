// 1. DEFINE YOUR SPECIAL DATES HERE
const birthdayDate = new Date("2025-10-02T00:00:00").getTime();
const anniversaryDate = new Date("2021-07-05T18:30:00").getTime();

// Define the name of the surprise file
const SURPRISE_PAGE = 'birthday_surprise.html';

// Variable to track if the birthday is over (used for click detection)
let isBirthdayOver = false;

// Function to run a confetti burst
function fireConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
        });
    }
}

// Function to calculate and display the countdown
function updateCountdown(targetTime, elementId) {
    const now = new Date().getTime();
    let distance = targetTime - now;
    
    // Get the Card element and its H2 for modifications
    const cardElement = document.getElementById(elementId).parentElement;
    const h2Element = cardElement.querySelector('h2');


    // --- Anniversary Handling (Time until next year) ---
    if (elementId === "anniversary-timer" && distance < 0) {
        let currentYear = new Date().getFullYear();
        let nextYearTarget = new Date(targetTime).setFullYear(currentYear + 1);
        distance = nextYearTarget - now;
    }
    // ----------------------------------------------------

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // --- NEW INTERACTIVE CELEBRATION LOGIC ---
    
    if (elementId === "birthday-timer" && distance < 1000) {
        // 1. Birthday hit zero!
        isBirthdayOver = true;
        
        // Show the celebratory message and make the card look clickable
        h2Element.textContent = "THE SURPRISE IS HERE! 🎉"; 
        document.getElementById(elementId).style.cursor = 'pointer'; 
        
        // Change the displayed text to the final call to action
        document.getElementById(elementId).innerHTML = "CLICK TO REVEAL SURPRISE!";
            
        document.getElementById(elementId).classList.add('celebrate');
        
        // Fire confetti on the exact hit moment (only on the first cycle)
        if (distance > 0) {
            fireConfetti();
        }
        
    } else if (elementId === "anniversary-timer" && distance < 1000 && distance > 0) {
        // 2. Anniversary hit zero (brief celebration)
        h2Element.textContent = "OUR ANNIVERSARY! 💖"; 
        document.getElementById(elementId).innerHTML = "IT'S TIME! 🎉";
        document.getElementById(elementId).classList.add('celebrate');
        fireConfetti();
        
        // Reset after 1 second to start counting to the next year
        setTimeout(() => {
            h2Element.textContent = "Our Dating Anniversary"; // Reset h2 text
            document.getElementById(elementId).classList.remove('celebrate');
        }, 1000);
        
    } else {
        // 3. Active Countdown State
        
        // Ensure birthday h2 is set correctly during countdown
        if (elementId === "birthday-timer") {
             h2Element.textContent = "Your Birthday!";
        }
        
        document.getElementById(elementId).innerHTML =
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
        document.getElementById(elementId).classList.remove('celebrate');
    }
    // --- END NEW INTERACTIVE CELEBRATION LOGIC ---
}

// Update the countdowns every 1 second
const x = setInterval(function() {
    updateCountdown(birthdayDate, "birthday-timer");
    updateCountdown(anniversaryDate, "anniversary-timer");
}, 1000);

// Run it once immediately
updateCountdown(birthdayDate, "birthday-timer");
updateCountdown(anniversaryDate, "anniversary-timer");


// -----------------------------------------------
// CONFETTI AND REDIRECTION ON CLICK LOGIC
// -----------------------------------------------

// Get the two countdown cards (we need the main card element)
const birthdayCard = document.querySelector(".countdown-container .card:last-child");
const anniversaryCard = document.querySelector(".countdown-container .card:first-child");

// Add a click listener to the Birthday Card for REDIRECTION
birthdayCard.addEventListener('click', function() {
    if (isBirthdayOver) {
        // ONLY redirect if the timer has hit zero (isBirthdayOver is true)
        clearInterval(x); // Stop the counting just before redirecting
        window.location.href = SURPRISE_PAGE;
    } else {
        // If the timer hasn't hit zero, still fire confetti for fun!
        fireConfetti();
    }
});

// Anniversary card just fires confetti for fun

anniversaryCard.addEventListener('click', fireConfetti);


