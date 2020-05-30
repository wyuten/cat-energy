'use strict';

let navToggle = document.querySelector('.nav-toggle');
let siteNav = document.querySelector('.site-nav');

navToggle.onclick = () => {
    navToggle.classList.toggle('opened');
    siteNav.classList.toggle('opened');
};

navToggle.dispatchEvent(new Event('click'));