'use strict';

document.querySelector('.no-js').classList.remove('no-js');
let navToggle = document.querySelector('.nav-toggle');
let siteNav = document.querySelector('.site-nav');

navToggle.onclick = () => {
    navToggle.classList.toggle('opened');
    siteNav.classList.toggle('opened');
};