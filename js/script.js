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

   const deadline = '2023-09-14';

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

});