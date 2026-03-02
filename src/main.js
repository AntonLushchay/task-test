import Swiper from 'swiper';
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';

import './styles/main.scss';

const MOBILE_BREAKPOINT = 1024;
const RESIZE_DEBOUNCE_DELAY = 150;

const SWIPER_CONFIG = {
	modules: [Navigation, Mousewheel, Pagination, Keyboard],
	slidesPerView: 'auto',
	initialSlide: 0,
	loopedSlides: 4,
	watchSlidesProgress: true,
	speed: 600,
	// Performance optimization
	preloadImages: false,
	lazy: {
		loadPrevNext: true,
	},
	// Keyboard navigation (Arrow keys)
	keyboard: {
		enabled: true,
		onlyInViewport: true,
		pageUpDown: true,
	},
	// Touch events configuration
	touchEventsTarget: 'container',
	touchRatio: 1,
	touchAngle: 45,
	// Navigation buttons
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
		clickable: true,
	},
	// Pagination dots
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	// Accessibility
	a11y: {
		enabled: true,
		notificationClass: 'swiper-notification',
		containerMessage: 'Hero carousel with case studies',
		containerRoleDescriptionMessage: 'Carousel',
		itemRoleDescriptionMessage: 'Slide',
		slideRole: 'group',
	},
};

// ===== Instance Variables =====

let swiper = null;
let lastWidth = window.innerWidth;
let resizeTimeout = null;
let resizeObserver = null;

// ===== Utility Functions =====

function debounce(func, delay) {
	return function executedFunction(...args) {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => func.apply(this, args), delay);
	};
}

function isMobileViewport() {
	return window.innerWidth < MOBILE_BREAKPOINT;
}

// ===== Main Functions =====

function initSwiper() {
	try {
		// Destroy existing swiper instance
		if (swiper) {
			swiper.destroy(true, true);
			swiper = null;
		}

		// Build dynamic configuration based on viewport
		const isMobile = isMobileViewport();
		const config = {
			...SWIPER_CONFIG,
			direction: isMobile ? 'horizontal' : 'vertical',
			centeredSlides: true,
			loop: true,
			// Dynamic mousewheel configuration
			mousewheel: {
				enabled: true,
				forceToAxis: !isMobile,
				sensitivity: 1,
				releaseOnEdges: true,
			},
		};

		// Create new swiper instance
		swiper = new Swiper('.hero__swiper', config);

		return swiper;
	} catch (error) {
		console.error('[Swiper] Initialization failed:', error);
		return null;
	}
}

/**
 * Handle viewport resize events
 * Only reinitializes swiper when crossing desktop/mobile breakpoint
 */
function handleResize() {
	const currentWidth = window.innerWidth;

	// Check if we crossed the mobile breakpoint
	const crossedBreakpoint =
		(lastWidth >= MOBILE_BREAKPOINT && currentWidth < MOBILE_BREAKPOINT) ||
		(lastWidth < MOBILE_BREAKPOINT && currentWidth >= MOBILE_BREAKPOINT);

	if (crossedBreakpoint) {
		initSwiper();
	}

	lastWidth = currentWidth;
}

/**
 * Initialize event listeners
 * Uses ResizeObserver for better performance than window resize event
 */
function initEventListeners() {
	try {
		// Use ResizeObserver if available (modern browsers)
		if ('ResizeObserver' in window) {
			const debouncedResize = debounce(handleResize, RESIZE_DEBOUNCE_DELAY);

			resizeObserver = new ResizeObserver(() => {
				debouncedResize();
			});

			resizeObserver.observe(document.documentElement);
		} else {
			// Fallback to resize event for older browsers
			window.addEventListener('resize', debounce(handleResize, RESIZE_DEBOUNCE_DELAY));
		}
	} catch (error) {
		console.error(
			'[ResizeObserver] Initialization failed, falling back to resize event:',
			error,
		);

		// Fallback
		window.addEventListener('resize', debounce(handleResize, RESIZE_DEBOUNCE_DELAY));
	}
}

// ===== Initialization =====

/**
 * Initialize the application
 */
function initApp() {
	try {
		swiper = initSwiper();

		if (!swiper) {
			console.warn('[App] Swiper initialization returned null');
		}

		initEventListeners();
	} catch (error) {
		console.error('[App] Failed to initialize:', error);
	}
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initApp);
} else {
	initApp();
}
