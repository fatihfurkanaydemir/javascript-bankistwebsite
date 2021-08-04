'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Learn more smooth scrolling
btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();

  /* const s1coords = section1.getBoundingClientRect();

   window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });  */

  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation
/* document.querySelectorAll('.nav__link').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const section = document.querySelector(this.getAttribute('href'));
    section.scrollIntoView({ behavior: 'smooth' });
  });
}); */

// Page navigation with delegate
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target !== this) {
    const section = document.querySelector(e.target.getAttribute('href'));
    section.scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component
document
  .querySelector('.operations__tab-container')
  .addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');

    if (!clicked) return;

    const targetTab = clicked.dataset.tab;

    [...this.children].forEach((btn) => {
      if (btn !== clicked) {
        document
          .querySelector(`.operations__content--${btn.dataset.tab}`)
          .classList.remove('operations__content--active');

        btn.classList.remove('operations__tab--active');
      }
    });

    clicked.classList.add('operations__tab--active');
    document
      .querySelector(`.operations__content--${targetTab}`)
      .classList.add('operations__content--active');
  });

// Navigation fade
const hoverEffect = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach((el) => {
      if (e.target !== el) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', hoverEffect.bind(0.5));

nav.addEventListener('mouseout', hoverEffect.bind(1));

// Sticky navigation

// bad performance way
/* window.addEventListener('scroll', function (e) {
  const s1coords = section1.getBoundingClientRect();
  if (!nav.classList.contains('sticky') && s1coords.top <= 0)
    nav.classList.add('sticky');
  else if (nav.classList.contains('sticky') && s1coords.top >= 0)
    nav.classList.remove('sticky');
}); */

/* const obsCallBack = function (entries, observer) {
  console.log(entries);
};

const observerOptions = {
  root: null,
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallBack, observerOptions);
observer.observe(section1); */

const stickyNav = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const header = document.querySelector('.header');

const headerObs = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
});

headerObs.observe(header);

// Section revealing
const sections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObs = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sections.forEach((section) => {
  sectionObs.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images

const imgs = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function (e) {
    e.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObs = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.7,
  //rootMargin: '200px',
});

imgs.forEach((img) => {
  imgObs.observe(img);
});

// Slider component

(function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeEnd',
        `
    <button class="dots__dot" data-slide="${i}"></button>
    `
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach((dot) => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );

    activateDot(slide);
  };

  const init = function () {
    createDots();
    goToSlide(currentSlide);
  };

  init();

  const nextSlide = function (e) {
    if (currentSlide + 1 === maxSlide) currentSlide = 0;
    else currentSlide++;

    goToSlide(currentSlide);
  };

  const previousSlide = function (e) {
    if (currentSlide === 0) currentSlide = maxSlide - 1;
    else currentSlide--;

    goToSlide(currentSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previousSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;

    const { slide } = e.target.dataset;
    currentSlide = +slide;
    goToSlide(slide);
  });
})();

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
