/*global $*/

(function() {
	webshim.setOptions('forms', {
		lazyCustomMessages: true,
		replaceValidationUI: true
	});
	webshim.polyfill('forms');
}());

$(function() {

	$("input[name=phone]").inputmask({
		"mask": "+9(999)999-9999",
		greedy: false,
		clearIncomplete: true
	});

	function formHandler() {
		var forms = document.querySelectorAll("form");

		for (var i = 0; i < forms.length; i++) {
			
			(function(i) {
				var form = forms[i];

				form.addEventListener("submit", function(e) {
					e.preventDefault();

					var modalForm = document.querySelector("#modalFormSmall");
					var sec1Form = document.querySelector(".sec1__form");
					var sec1Place = sec1Form.querySelector("[name=place]");
					var sec1Time = sec1Form.querySelector("[name=time]");
					var name = form.querySelector("[name=name]").value === "" ? "" : form.querySelector("[name=name]").value;
					var sharingName = localStorage;
					sharingName.setItem("clientName", name);

					if (sec1Place !== "") {
						modalForm.querySelector("[name=place]").value = sec1Place.value;
					}

					if (sec1Time !== "") {
						modalForm.querySelector("[name=time]").value = sec1Time.value;
					}

					var formData = $(form).serialize();

					$.ajax({
						type: "POST",
						url: "mail/send.php",
						data: formData,
						success: function() {
							window.location = "thanks.html"
						},
						error: function() {
							console.log("error");
						}
					});

					function sendMessageSuccess() {
						window.location = "thanks.html"
					}
				});
			})(i);
		}
	}
	formHandler();
	

	(function headerLinkhandler() {
		var links = document.querySelectorAll(".header__nav-link");

		for (var i = 0; i < links.length; i++) {

			(function(i){
				var link = links[i];
				var scrollEl = link.getAttribute("href");

				if (getPage() === "main") {

					link.addEventListener("click", function(e) {
						e.preventDefault();

						$("html, body").animate({
							scrollTop: $(scrollEl).offset().top
						}, 400);
					});
				} else {

					var clientName = document.getElementById("clientName");
					var shareName = localStorage.getItem("clientName");

					clientName.textContent = (shareName) ? shareName + ", наши" : "Наши";

					link.addEventListener("click", function(e) {
						window.location = "/" + scrollEl;
					});
				}
			})(i);
		}
	})();

	function createGallery(galleryClass) {
		var gallery = document.querySelector(galleryClass);

		$.ajax({
			url: "json/video.json",
			success: function(data) {
				createGalleryContent(data);
			},
			error: function() {
				console.log("error")
			}
		});

		function createGalleryContent(data) {
			var gallery = document.querySelector(".js-gallery");

			if (gallery) {
				var galleryContent = "";
				var galleryItem;

				for (var i = 0; i < data.length; i++) {
					galleryItem = "<div class='gallery__item'><div class='gallery__item-container container'>";
					
					var img = "<div class='gallery__img' style='background-image:url(img/" + data[i].imgSrc + ")'></div>";
					var videoBlock = "<div class='gallery__video-block'>";
					var videoHead = "<p class='gallery__video-head'>" + data[i].head + "</p>";
					var videoName = "<p class='gallery__video-name'>" + data[i].name + "</p>";
					var videoLink = "<a data-form='#modalVideo' data-number=" + i + " class='gallery__video-link'>";
					var videoSubtitle = "<span>Читать отзыв целиком</span>";
					var closeVideoLink = "</a>";
					var closeVideoBlock = "</div>";
					videoImg = "<span class='gallery__video-img' style='background-image:url(https://img.youtube.com/vi/" + data[i].videoLink + "/0.jpg)'></span>";

					if (data[i].videoLink) {
						videoImg = "<span class='gallery__video-img' style='background-image:url(https://img.youtube.com/vi/" + data[i].videoLink + "/0.jpg)'></span>";
					} else {
						videoImg = "<span class='gallery__video-img' style='background-image:url(img/" + data[i].photoImg + ")'></span>";
					}

					galleryItem += img + videoBlock + videoHead + videoName + videoLink + videoImg + videoSubtitle + closeVideoLink + closeVideoBlock;
					galleryItem += "</div></div>";
					galleryContent += galleryItem;
				}

				gallery.insertAdjacentHTML("afterbegin", galleryContent);

				var slickGalleryOptions = {
					centerMode: true,
					centerPadding: '16vw',
					slidesToShow: 1,
					infinite: false,
					variableWidth: false,
					nextArrow: ".gallery__arrow_right",
					prevArrow: ".gallery__arrow_left",
					dots: true,

					responsive: [
						{
							breakpoint: 1366,
							settings: {
								centerPadding: '10vw',
							}
						},
						{
							breakpoint: 1024,
							settings: {
								centerMode: false,
							}
						}
					]
				};
				var slickGallery = $(gallery).slick(slickGalleryOptions);
				modalWindowHandler();
			}
		}
	}

	function modalWindowHandler() {

		(function(){
			var modalLinks = document.querySelectorAll("a[data-form]");
			
			for (var i = 0; i < modalLinks.length; i++) {

				(function(i) {
					var link = modalLinks[i];
					var modalId = link.getAttribute("data-form");
					var modal = document.querySelector(modalId);

					if (modalId === "#modalVideo") {
						var number = link.getAttribute("data-number");

						link.addEventListener("click", function() {

							openModal(modal, function() {
								createModalVideo(number)
							});
						});
					} else {
						link.addEventListener("click", function() {
							openModal(modal);
						});
					}
				})(i);
			}
		})();

		(function(){
			var closeModalBtn = document.querySelectorAll(".js-close-modal");
			for (var i = 0; i < closeModalBtn.length; i++) {

				(function(i) {
					var btn = closeModalBtn[i];

					btn.addEventListener("click", function() {
						closeModal();
					});

				})(i);
			}
		})();

		(function(){
			var modals = document.querySelectorAll(".modal");
			for (var i = 0; i < modals.length; i++) {
				
				(function(i) {
					var modal = modals[i];

					modal.addEventListener("click", function(e) {

						if (e.target.classList.contains("modal")) {
							closeModal();
						}
					});

				})(i);
			}
		})();

		function createModalVideo(number) {

			$.ajax({
				url: "json/video.json",
				success: function(data) {
					createVideoContent(data);
				},
				error: function() {
					console.log("error");
				}
			});

			function createVideoContent(data) {
				var videoReview = document.querySelector(".modal__video-review");
				var heading = videoReview.querySelector(".modal__video-head");
				var name = videoReview.querySelector(".modal__video-name");
				var text = videoReview.querySelector(".modal__video-text");
				var videoFrame = videoReview.querySelector(".modal__video-frame");
				var docLink = videoReview.querySelector(".modal__video-doc");
				var docTitle = videoReview.querySelector(".modal__video-doc-title");
				var docSize = videoReview.querySelector(".modal__video-doc-size span");
				var photoImg = videoReview.querySelector(".modal__video-img");;

				if (data[number].videoLink) {
					videoFrame.setAttribute("src", "https://www.youtube.com/embed/" + data[number].videoLink + "?enablejsapi=1");
					videoFrame.style.display = "block";
					photoImg.style.display = "none";
				} else {
					videoFrame.style.display = "none";
					photoImg.style.display = "block";
					photoImg.src = "img/" + data[number].photoImg;

					// photoImg = document.createElement("img");
					
					// videoReview.appendChild(photoImg);
				}

				heading.innerText = data[number].head;
				name.innerText = data[number].name;
				//videoFrame.setAttribute("src", "https://www.youtube.com/embed/" + data[number].videoLink + "?enablejsapi=1");
				// docLink.setAttribute("href", "doc/" + data[number].doc.link);
				// docTitle.innerText = data[number].doc.title;
				// docSize.innerText = data[number].doc.size;

				var paragraphs = "";
				for (var i = 0; i < data[number].text.length; i++) {
					var paragraph = "<p>" + data[number].text[i] + "</p>";
					paragraphs += paragraph;
				}

				text.innerHTML = paragraphs;
			}
		}

		function openModal(modal, callback) {
			modal.classList.add("modal_open");
			document.body.classList.add("body-overflow");

			if (callback) {
				callback();
			}
			
		}

		function closeModal() {
			
			if (document.querySelector(".modal_open")) {
				document.querySelector(".modal_open").classList.remove("modal_open");
				document.body.classList.remove("body-overflow");

				var video = document.querySelector(".modal__video-frame").contentWindow;
				video.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
			}
		}
	}

	function initMap() {

		var places = [
			{
				link: "https://www.google.ru/maps/place/%D0%91%D0%B0%D1%88%D0%BD%D1%8F+%D0%BD%D0%B0+%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D0%BE%D0%B9/@55.747095,37.5368749,15z/data=!4m5!3m4!1s0x0:0xd1159fc9bbe7cfec!8m2!3d55.747095!4d37.5368749", 
				coords: {
					lat: 55.747808, 
					lng: 37.536875
				},
				center: {
					lat: 55.748729, 
					lng: 37.527479
				}
			},
			{
				link: "https://www.google.ru/maps/place/%D1%83%D0%BB.+%D0%9F%D0%B0%D1%80%D0%B8%D0%B6%D1%81%D0%BA%D0%BE%D0%B9+%D0%9A%D0%BE%D0%BC%D0%BC%D1%83%D0%BD%D1%8B,+8,+%D0%9A%D0%B0%D0%B7%D0%B0%D0%BD%D1%8C,+%D0%A0%D0%B5%D1%81%D0%BF.+%D0%A2%D0%B0%D1%82%D0%B0%D1%80%D1%81%D1%82%D0%B0%D0%BD,+420021/@55.7838822,49.1127876,17z/data=!3m1!4b1!4m5!3m4!1s0x415ead1b391c2c2f:0xa3147e060d4eaf2d!8m2!3d55.7838822!4d49.1149763",
				coords: {
					lat: 55.784051, 
					lng: 49.114966
				},
				center: {
					lat: 55.783206, 
					lng: 49.107112
				}
			}
		];

		if (document.getElementById('map')) {
			var map = new google.maps.Map(document.getElementById('map'), {
				zoom: 15,
				center: places[0].center,
				disableDefaultUI: true,
				//scrollwheel: false
			});

			for (var i = 0; i < places.length; i++) {
				var place = places[i];
				var marker = new google.maps.Marker({
					position: place.coords,
					map: map,
					icon: "img/map-mark.png"
				});
				
				(function(index) {
					marker.addListener('click', function(e) {
						window.open(places[index].link, "_blank")
					});
				})(i);
			}
			
			var links = document.querySelectorAll(".sec11__maplink");
	
			for (var j = 0; j < links.length; j++) {
				var link = links[j];
				
				(function(mapIndex) {
					link.addEventListener("click", function(e) {
						e.preventDefault();

						if (window.matchMedia('(max-width:768px)').matches) {
							map.panTo(places[mapIndex].coords);
						} else {
							map.panTo(places[mapIndex].center);
						}
					});
				})(j);
			}
		}
	}
	initMap();

	function getPage() {

		if (document.querySelector(".thanks")) {
			return "thanks"
		} else {
			return "main";
		}
	}

	createGallery(".js-gallery");
});

window.onload = function() {
	function getCity() {
		var cityWrap = document.querySelector(".header__city");
		var cityEl = cityWrap.querySelector("span");
		var city = ymaps.geolocation.city;

		if (city && city !== "") {
			cityEl.innerText = city;
		} else {
			city.style.display = "none";
		}
	}
	getCity();
}

