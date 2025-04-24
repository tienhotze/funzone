document.addEventListener('DOMContentLoaded', () => {

    // --- Game Carousel Logic with Autoscroll ---
    const carouselWrapper = document.querySelector('.game-carousel-wrapper');
    const carousel = document.getElementById('gameCarousel'); // Use the ID
    const prevButton = carouselWrapper.querySelector('.carousel-button.prev');
    const nextButton = carouselWrapper.querySelector('.carousel-button.next');
    const carouselItems = carousel.querySelectorAll('.carousel-item');

    let autoScrollInterval;
    const scrollIntervalTime = 4000; // Time in ms (4 seconds)

    if (carousel && prevButton && nextButton && carouselItems.length > 0) {
        let itemWidth = carouselItems[0].offsetWidth + 20; // Width + margin-right
        let scrollAmount = carousel.scrollLeft;

        // Function to scroll to the next item/set
        const scrollToNext = () => {
            itemWidth = carouselItems[0].offsetWidth + 20; // Recalculate item width in case of resize
            const maxScrollLeft = carousel.scrollWidth - carousel.offsetWidth;

            if (scrollAmount >= maxScrollLeft - 1) { // Check if near the end (-1 tolerance)
                // Go back to the beginning
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
                scrollAmount = 0;
            } else {
                // Scroll right by one item width
                carousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
                scrollAmount += itemWidth; // Update scroll amount roughly
                // Adjust if scrollAmount exceeds maxScrollLeft after adding itemWidth
                if (scrollAmount > maxScrollLeft) {
                    scrollAmount = maxScrollLeft;
                }
            }
            updateButtonStates();
        };

        // Function to start autoscroll
        const startAutoScroll = () => {
            stopAutoScroll(); // Clear any existing interval first
            autoScrollInterval = setInterval(scrollToNext, scrollIntervalTime);
        };

        // Function to stop autoscroll
        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // Function to update button states
        const updateButtonStates = () => {
            itemWidth = carouselItems[0].offsetWidth + 20; // Ensure itemWidth is current
            scrollAmount = carousel.scrollLeft; // Get current scroll position
            prevButton.disabled = scrollAmount <= 0;
            nextButton.disabled = scrollAmount >= carousel.scrollWidth - carousel.offsetWidth - 1;
        };

        // --- Event Listeners ---

        // Manual Next Button
        nextButton.addEventListener('click', () => {
            stopAutoScroll(); // Stop auto scroll on manual click
            scrollToNext(); // Scroll manually
            startAutoScroll(); // Restart auto scroll after a delay might be better, or immediately
        });

        // Manual Previous Button
        prevButton.addEventListener('click', () => {
            stopAutoScroll();
            itemWidth = carouselItems[0].offsetWidth + 20; // Ensure itemWidth is current
            carousel.scrollBy({ left: -itemWidth, behavior: 'smooth' });
            scrollAmount -= itemWidth;
            if (scrollAmount < 0) scrollAmount = 0;
            updateButtonStates();
            startAutoScroll();
        });

        // Pause autoscroll on hover
        carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
        carouselWrapper.addEventListener('mouseleave', startAutoScroll);

        // Update buttons on manual scroll (touch/drag)
        let scrollEndTimer;
        carousel.addEventListener('scroll', () => {
            clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(() => {
                 updateButtonStates();
             }, 150); // Update buttons shortly after scrolling stops
        });


        // Initial setup
        updateButtonStates();
        startAutoScroll(); // Start the autoscroll initially

        // Recalculate and update on resize
        window.addEventListener('resize', () => {
            itemWidth = carouselItems[0].offsetWidth + 20;
            scrollAmount = carousel.scrollLeft; // Update current position
            updateButtonStates();
            // Optional: You might want to stop/restart autoscroll on resize too
            // stopAutoScroll();
            // startAutoScroll();
        });

    } else {
        console.warn("Carousel elements not found or missing required parts.");
    }


    // --- Smooth Scrolling for Nav Links ---
    // ... (Smooth scrolling logic remains the same) ...
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // --- Update Footer Year ---
    // ... (Footer year logic remains the same) ...
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded