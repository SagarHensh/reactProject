$(function () {

	$(".verificaiton-doc-tab ul li").on("click", function () {
		$(".verificaiton-doc-tab ul li").removeClass('active');
		$(this).addClass('active');
		$("div").removeClass("activeLnk");
		$("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
	});


	jQuery('.filter-btn a').click(function () {
		jQuery('#filter-dropdown').toggle();
		s
	});
	jQuery('html').click(function (event) {
		if (jQuery(event.target).closest('.filter-btn').length === 0) {
			jQuery('#filter-dropdown').hide();
		}
	});

	jQuery('.move_drop').click(function () {
		jQuery('#dd_menu_move').toggle();
	});
	jQuery('html').click(function (event) {
		if (jQuery(event.target).closest('.dd-item').length === 0) {
			jQuery('#dd_menu_move').hide();
		}
	});


	jQuery('#status-data').on('change', function () {
		const $switch = jQuery(this)
		const isChecked = $switch.prop('checked')

		if (isChecked) {
			jQuery('.act').addClass('active')
		} else {

			jQuery('.act').removeClass('active')
		}
	});
	jQuery('.doc-wrap h3').click(function () {
		jQuery(this).parent().find('.table-listing-app').slideToggle();
	});


	jQuery('.arrow_btn').click(function () {
		jQuery(this).toggleClass('op');
		jQuery(this).parent().find('.dropdown-app').slideToggle();
	});
	jQuery("#from_datepicker,#to_datepicker,#datepicker2").datepicker();

	jQuery('._menubtn').click(function () {
		jQuery('.side-navigaiton,.component-wrapper,.to_prt').toggleClass('hp');
	});
	jQuery('.my-form-rw h3').click(function () {

		jQuery(this).parent().find('.my-form-bx').slideToggle();
		jQuery(this).toggleClass('open');
	});

	jQuery('.responsive-menu').click(function () {
		jQuery('.side-navigaiton').toggleClass('hp');
	});
	jQuery(function () {
		jQuery('[data-toggle="tooltip"]').tooltip()
	});
	// search section
	jQuery(document).ready(function(){
		jQuery('#search').on("click",(function(e){
		jQuery(".form-group").addClass("sb-search-open");
		  e.stopPropagation()
		}));
		 jQuery(document).on("click", function(e) {
		  if (jQuery(e.target).is("#search") === false && jQuery(".form-control").val().length == 0) {
			jQuery(".form-group").removeClass("sb-search-open");
		  }
		});
		  jQuery(".form-control-submit").click(function(e){
			jQuery(".form-control").each(function(){
			  if(jQuery(".form-control").val().length == 0){
				e.preventDefault();
				jQuery(this).css('border', '1px solid gray');
			  }
		  })
		})
	  })
	
	//Resize window
	$(window).resize(function() {
		/*If browser resized, check width again */
		if ($(window).width() < 767) {
		 $('body').addClass('chat_change');
		}
		else {$('body').removeClass('chat_change');}
	 });
	 $( function() {
		$( "#datepicker" ).datepicker({
			dateFormat: "dd-mm-yy"
			,	duration: "fast"
		});
	} );
	
	  

	$('.close-nav').click(function () {
		$('.side-navigaiton,.to_prt').removeClass('hp');
	});
	$('#myDropdown_1').ddslick();
	$('#myDropdown_2').ddslick();
	$('#myDropdown_3').ddslick();
	$('#myDropdown_4').ddslick();
	$('#myDropdown_5').ddslick();
	$('#myDropdown_6').ddslick();
	$('#myDropdown_7').ddslick();
	$('#myDropdown_8').ddslick();
	$('#myDropdown_9').ddslick();
	$('#myDropdown_10').ddslick();
	$('#myDropdown_11').ddslick();
	$('#myDropdown_12').ddslick();
	$('#myDropdown_13').ddslick();
	$('#myDropdown_14').ddslick();
	$('#select-indstry').ddslick();
	$('#location').ddslick();
	$('#contactName').ddslick();
	$('#parent-department').ddslick();
	$('#hs-pital').ddslick();
	$('#select12').ddslick();
	$('#select13').ddslick();
	$('#select14').ddslick();
	$('#select15').ddslick();
	$('#select16').ddslick();
	$('#select17').ddslick();
	$('#select18').ddslick();
	$('#select19').ddslick();
	$('#select20').ddslick();
	$('#select21').ddslick();
	$('#select22').ddslick();
	$('#select23').ddslick();
	$('#select24').ddslick();
	$('#select25').ddslick();
	$('#select26').ddslick();
	$('#select27').ddslick();
	$('#select28').ddslick();
	$('#select29').ddslick();
	$('#select30').ddslick();
	$('#select31').ddslick();
	$('#select32').ddslick();
	$('#select33').ddslick();
	$('#select34').ddslick();
	$('#select35').ddslick();
	$('#select36').ddslick();
	$('#select37').ddslick();
	$('#select38').ddslick();
	$('#select39').ddslick();
	$('#select40').ddslick();
	$('#select41').ddslick();
	$('#select42').ddslick();
	$('#select43').ddslick();
	$('#select44').ddslick();
	$('#select45').ddslick();
	$('#select46').ddslick();
	$('#select47').ddslick();
	$('#select48').ddslick();
});



// setInterval(function(){
// 			let ct = new Date()
// 			let hours = ct.getHours()
// 			if (1 == hours.toString().length) hours = `0${hours}`

// 			let minutes = ct.getMinutes()
// 			if (1 == minutes.toString().length) minutes = `0${minutes}`

// 			let seconds = ct.getSeconds()
// 			if (1 == seconds.toString().length) seconds = `0${seconds}`

// 			let meridian = hours < 12 ? 'AM' : 'PM'

// 			document.getElementById('current-time').innerHTML = `<span class='t1'><small>${hours}</small></span>: <span class='t2'><small>${minutes} </small></span> <span class='t3'><small>${meridian}</small></span>`
// 		}, 1000)


// setInterval(function(){
// 			let ct = new Date()
// 			let hours = ct.getHours()
// 			if (1 == hours.toString().length) hours = `0${hours}`

// 			let minutes = ct.getMinutes()
// 			if (1 == minutes.toString().length) minutes = `0${minutes}`

// 			let seconds = ct.getSeconds()
// 			if (1 == seconds.toString().length) seconds = `0${seconds}`

// 			let meridian = hours < 12 ? 'AM' : 'PM'

// 			document.getElementById('start-time').innerHTML = `<span class='t1'><small>${hours}</small></span>: <span class='t2'><small>${minutes} </small></span> <span class='t3'><small>${meridian}</small></span>`
// 		}, 1000)


// setInterval(function(){
// 			let ct = new Date()
// 			let hours = ct.getHours()
// 			if (1 == hours.toString().length) hours = `0${hours}`

// 			let minutes = ct.getMinutes()
// 			if (1 == minutes.toString().length) minutes = `0${minutes}`

// 			let seconds = ct.getSeconds()
// 			if (1 == seconds.toString().length) seconds = `0${seconds}`

// 			let meridian = hours < 12 ? 'AM' : 'PM'

// 			document.getElementById('end-time').innerHTML = `<span class='t1'><small>${hours}</small></span>: <span class='t2'><small>${minutes} </small></span> <span class='t3'><small>${meridian}</small></span>`
// 		}, 1000)


