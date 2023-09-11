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
   }

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
      clearInterval(timeModalOpen);
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




});