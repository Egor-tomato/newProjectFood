window.addEventListener('DOMContentLoaded', () => {
   const tabsContent = document.querySelectorAll('.tabcontent');
   const tabs = document.querySelectorAll('.tabheader__item');
   const tabsParent = document.querySelector('.tabheader__items');

   function hideTabContent() {
      tabsContent.forEach(item => {
         item.classList.add('hide');
         item.classList.remove('show', 'fade');
      });
      tabs.forEach(item => {
         item.classList.remove('tabheader__item_active');
      });
   }

   function showTabContent(i = 0) {
      tabsContent[i].classList.add('show', 'fade');
      tabsContent[i].classList.remove('hide');
      tabs[i].classList.add('tabheader__item_active');
   };

   tabsParent.addEventListener('click', event => {
      const target = event.target;
      if (target && target.classList.contains('tabheader__item')) {
         tabs.forEach((event, i) => {
            if (target === event) {
               hideTabContent();
               showTabContent(i);
            }
         });
      }
   });

   hideTabContent();
   showTabContent();

   const modal = document.querySelector('.modal');
   const modalTrigger = document.querySelectorAll('[data-modal]');

   const timeModalOpen = setTimeout(openModal, 50000);

   function openModal() {
      modal.classList.add('show');
      modal.classList.remove('hide');
      document.body.style.overflow = 'hidden';
      clearTimeout(timeModalOpen);
   }

   function closeModal() {
      modal.classList.add('hide');
      modal.classList.remove('show');
      document.body.style.overflow = '';
   }

   modalTrigger.forEach(item => {
      item.addEventListener('click', openModal);
   });

   modal.addEventListener('click', event => {
      if (event.target === modal || event.target.getAttribute('data-close') == '') {
         closeModal();
      }
   });

   window.addEventListener('keydown', event => {
      if (event.code === 'Escape') closeModal();
   });

   const deadline = '2023-09-18';

   function getAverageTime(endtime) {
      const t = Date.parse(endtime) - Date.parse(new Date());
      const days = Math.floor(t / (1000 * 60 * 60 * 24));
      const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((t / 1000 / 60) % 60);
      const seconds = Math.floor((t / 1000) % 24);

      return {
         'total': t,
         'days': days,
         'hours': hours,
         'minutes': minutes,
         'seconds': seconds
      }
   }

   function setClock(selector, endtime) {
      const timer = document.querySelector(selector);
      const days = timer.querySelector('#days');
      const hours = timer.querySelector('#hours');
      const minutes = timer.querySelector('#minutes');
      const seconds = timer.querySelector('#seconds');

      const timerId = setInterval(updateTimer, 1000);

      function updateTimer() {
         const t = getAverageTime(endtime);
         days.innerHTML = t.days;
         hours.innerHTML = t.hours;
         minutes.innerHTML = t.minutes;
         seconds.innerHTML = t.seconds;

         if (t.total <= 0) clearTimeout(timerId);
      }
   }

   setClock('.timer', deadline);

   class MenuForm {
      constructor(img, altimg, title, descr, price, parentSelector, ...classes) {
         this.img = img;
         this.altimg = altimg;
         this.title = title;
         this.descr = descr;
         this.price = price;
         this.USD = 27;
         this.parents = document.querySelector(parentSelector);
         this.classes = classes;
         this.convector();

      }
      convector() {
         this.price *= this.USD
      }
      render() {
         const element = document.createElement('div');
         this.classes.forEach(className => {
            element.classList.add(className);
         });
         element.innerHTML = `
                  <img src=${this.img} alt=${this.altimg}>
                  <h3 class="menu__item-subtitle">${this.title}</h3>
                  <div class="menu__item-descr">${this.descr}</div>
                  <div class="menu__item-divider"></div>
                  <div class="menu__item-price">
                     <div class="menu__item-cost">Цена:</div>
                     <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                  </div>
         `;
         this.parents.append(element);
      }
   }

   const getResource = async (url) => {
      const res = await fetch(url)
      if (!res) {
         throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }
      return await res.json();
   }


   axios.get('http://localhost:3000/menu')
      .then(data => data.data.forEach(({ img, altimg, title, descr, price }) => {
         new MenuForm(img, altimg, title, descr, price, '.menu .container', 'menu__item').render();
      }))

   const message = {
      loading: 'img/form/spinner.svg',
      success: 'Спасибо, мы с вами свяжемся',
      failure: 'Что-то пошло не так'
   }


   const postData = async (url, data) => {
      const res = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json'
         },
         body: data
      });
      return await res.json()
   }

   const forms = document.querySelectorAll('form');

   forms.forEach(event => {
      bindPostData(event);
   });

   function bindPostData(form) {
      form.addEventListener('submit', event => {
         event.preventDefault();

         const statusMessage = document.createElement('img');
         statusMessage.src = message.loading;
         statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
         `;
         form.insertAdjacentElement('afterend', statusMessage);

         const formData = new FormData(form);

         const json = JSON.stringify(Object.fromEntries(formData.entries()));

         postData('http://localhost:3000/requests', json)
            .then(data => {
               console.log(data);
               thankModal(message.success);
               statusMessage.remove();
            })
            .catch(() => {
               thankModal(message.failure);
            })
            .finally(() => {
               form.reset();
            })
      });
   }

   function thankModal(message) {
      const previousModalDialog = document.querySelector('.modal__dialog');
      previousModalDialog.classList.add('hide');
      openModal();
      const thankModalDialog = document.createElement('div');
      thankModalDialog.classList.add('modal__dialog');
      thankModalDialog.innerHTML = `
         <div class="modal__content">
            <div data-close class="modal__close">&times;</div>
            <div class="modal__title">${message}</div>
         </div>
       `;
      document.querySelector('.modal').append(thankModalDialog);

      setTimeout(() => {
         thankModalDialog.remove();
         previousModalDialog.classList.add('show');
         previousModalDialog.classList.remove('hide');
         closeModal();
      }, 4000);
   }


   // slider

   const wrapperSlide = document.querySelector('.offer__slider-wrapper'),
      fieldSlide = wrapperSlide.querySelector('.offer__slider-inner'),
      slides = fieldSlide.querySelectorAll('.offer__slide'),
      prevSlide = document.querySelector('.offer__slider-prev'),
      nextSlide = document.querySelector('.offer__slider-next'),
      width = window.getComputedStyle(wrapperSlide).width,
      total = document.querySelector('#total'),
      current = document.querySelector('#current'),
      slider = document.querySelector('.offer__slider');

   let slideIndex = 1;
   let offset = 0;

   if (slides.length < 10) {
      total.textContent = `0${slides.length}`;
      current.textContent = `0${slideIndex}`;
   } else {
      total.textContent = slides.length;
      current.textContent = slideIndex;
   }

   slides.forEach(slide => {
      slide.style.width = width;
   })

   const widthSlide = +width.slice(0, width.length - 2);

   fieldSlide.style.width = 100 * slides.length + '%';
   fieldSlide.style.display = 'flex';
   fieldSlide.style.transition = '0.5s all';
   wrapperSlide.style.overflow = 'hidden';

   slider.style.position = 'relative';
   const indicators = document.createElement('ol');
   indicators.classList.add('carousel-indicators');
   slider.append(indicators);
   const dots = [];

   for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('li');
      dot.setAttribute('data-slide-to', i + 1);
      dot.classList.add('dot');
      if (i == 0) dot.style.opacity = 1;
      indicators.append(dot);
      dots.push(dot)
   }

   function dotsOpacity() {
      dots.forEach(dot => dot.style.opacity = '0.5');
      dots[slideIndex - 1].style.opacity = 1;
   }

   prevSlide.addEventListener('click', () => {
      if (offset == 0) {
         offset = widthSlide * (slides.length - 1);
      } else {
         offset -= widthSlide;
      }
      fieldSlide.style.transform = `translate(-${offset}px)`;

      if (slideIndex == 1) {
         slideIndex = slides.length;
      } else {
         slideIndex--;
      }

      if (slideIndex < 10) {
         current.textContent = `0${slideIndex}`;
      } else {
         current.textContent = slideIndex;
      }
      dotsOpacity();
   });

   nextSlide.addEventListener('click', () => {
      if (offset == widthSlide * (slides.length - 1)) {
         offset = 0;
      } else {
         offset += widthSlide;
      }
      fieldSlide.style.transform = `translate(-${offset}px)`;

      if (slideIndex == slides.length) {
         slideIndex = 1;
      } else {
         slideIndex++;
      }

      if (slideIndex < 10) {
         current.textContent = `0${slideIndex}`;
      } else {
         current.textContent = slideIndex;
      }
      dotsOpacity();
   });

   dots.forEach(dot => {
      dot.addEventListener('click', event => {
         const slideTo = event.target.getAttribute('data-slide-to');
         slideIndex = slideTo;
         offset = widthSlide * (slideTo - 1)
         fieldSlide.style.transform = `translate(-${offset}px)`;
         if (slideIndex < 10) {
            current.textContent = `0${slideIndex}`;
         } else {
            current.textContent = slideIndex;
         }
         dotsOpacity();
      });
   });
});