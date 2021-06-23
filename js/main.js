let currentPage;

$('html').on('click', 'a, button[link]', function(e) {
	e.preventDefault();

	let l = $(this).prop('nodeName') === 'A'
		? $(this).attr('href')
		: $(this).attr('link');

	if (l.indexOf('http') > (-1)) {
		// If link is external -> Opens in new window
		window.open(l, '_blank');

	} else if(l !=='#' && l !== window.location.href.split('/').slice(3).join('/')) {
		changeBody(l);
	}
});

// Puts the correct page in the browser's URL bar when page loads
$(document).ready(function() {
	changeBody(window.location.href.split('/').slice(3).join('/'));
});

function bodyLoadAnim(t) {
	// displays body
	$('main>div').fadeIn(t);
	$('main').animate({
		'min-height': 0
	}, t, 'easeInOutCubic');
}

function changeBody(l = '', hist = true) {

	// separates hash target from url
	[qL, trg] = l.split('#');
	// console.log(qL);

	if (qL !== currentPage) {

		// Tests if the location is blank. If it is, that means the homepage.
		currentPage = qL;

		let main = $('main');

		// sets timing for animation
		let t = 540;

		// Scrolls to the top of the page
		$("html, body").animate({
			scrollTop: 0
		}, "slow", 'easeInOutCubic');

		// Keeps main's height while new content is being loaded
		main.css('min-height', main.height());

		// Hides the body during page replacement
		$('main>div').fadeOut(t/2);

		// if history is being changed (hist = true), adds history state
		hist ? window.history.pushState({}, "", ('/' + l)) : '';

		// Loads the new page
		setTimeout(function() {

			// Extracts the page from the location. If blank, assigns the homepage
			let page = qL.length?qL.split('/').slice(-1):'home';

			// Loads the page into #main
			main.load(page + '-page.html', function(response, status, xhr) {

				// console.log(response,status);
				// error handler if page is not found
				if ( status == "error" ) {
					main.html(`<h4>Sorry, that page could not be found.</h4><h5 style='color: red;'>Error:<br>${response}</h5>`)
					//report error to service when that becomes feasible
				}

				// Executes animation for the loaded content
				bodyLoadAnim(t/2);

				// Depending on the destination (if the homepage), add or remove the smaller class from the header
				(qL.length && qL !== 'home')?$('header').addClass('smaller'):$('header').removeClass('smaller');

			});
		}, t);
	}
}

// Loads page from browser history
window.onpopstate = function(e) {
	e.preventDefault();
	setTimeout(function() {
		changeBody(window.location.href.split('/').slice(3).join('/'), false);
	}, 50)
}
