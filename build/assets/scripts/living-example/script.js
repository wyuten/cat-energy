'use strict';

class LivingExample {
    constructor(mobileView, mobileIndent, tabletView, tabletIndent, desktopView) {
        // View
        this.mobileView = mobileView;
        this.mobileIndent = mobileIndent;

        this.tabletView = tabletView;
        this.tabletIndent = tabletIndent;

        this.desktopView = desktopView;
        this.desktopIndent = document.documentElement.clientWidth / 2 - desktopView / 2;

        // Viewbox
        this.tabletMedia = window.matchMedia(`(min-width: ${tabletView}px)`);
        this.desktopMedia = window.matchMedia(`(min-width: ${desktopView}px)`);

        // Blocks
        this.catExampleBeforeBlock = document.querySelector('.cat-example__picture--before');
        this.catExampleAfterBlock = document.querySelector('.cat-example__picture--after');

        // Images
        this.catExampleBeforeImg = document.querySelector('.cat-example__picture--before img');
        this.catExampleAfterImg = document.querySelector('.cat-example__picture--after img');

        // Buttons
        this.beforeBtn = document.querySelector('.cat-example__btn--before');
        this.afterBtn = document.querySelector('.cat-example__btn--after');
    }

    rightSideAbsorption (rangeControlValue, container, indent, rightSideСoeff) {
        /* The function calculates the width of the right side of the box 
            from the position of the input[range] */

        const rangeOffset = rangeControlValue - 50;
        const leftSideСoeff = 100 - rightSideСoeff;

        const rightSideWidth = container * (rightSideСoeff / 100) + indent;
        const leftSideWidth = container * (leftSideСoeff / 100) + indent;

        if (rangeControlValue < 50) {
            return rightSideWidth + rangeOffset * rightSideWidth / 50;
        } else {
            return rightSideWidth + rangeOffset * leftSideWidth / 50;
        }
    }

    
    rightContentDeepening (rangeControlValue, container, indent, rightSideСoeff) {
        /* The function calculates the depening of the right side of the box content 
            from the position of the input[range] */

        const rangeOffset = rangeControlValue - 50;
        const leftSideСoeff = 100 - rightSideСoeff;
        
        const rightSideWidth = container * (rightSideСoeff / 100) + indent;
        const leftSideWidth = container * (leftSideСoeff / 100) + indent;

        if (rangeControlValue < 50) {
            return rangeOffset * rightSideWidth / 50;
        } else {
            return rangeOffset * leftSideWidth / 50;
        }
    }
    

    calc () {
        // View
        this.desktopIndent = document.documentElement.clientWidth / 2 - this.desktopView / 2;

        // Viewbox
        let screenWidth = document.documentElement.clientWidth;

        // Style reset
        this.catExampleBeforeBlock.removeAttribute('style');
        this.catExampleAfterBlock.removeAttribute('style');
        this.catExampleBeforeImg.removeAttribute('style');
        this.catExampleAfterImg.removeAttribute('style');

        if (this.tabletMedia.matches) {

            /* Tablet, desktop */

            const catRangeControl = document.querySelector('.cat-example__control-range');
            const changeCat = new Event('input');

            catRangeControl.value = 500;

            catRangeControl.oninput = () => {
                let rightCatBoxWidth = this.rightSideAbsorption(
                    catRangeControl.value / 10, 
                    this.desktopMedia.matches ? this.desktopView : screenWidth - this.tabletIndent * 2, 
                    this.desktopMedia.matches ? this.desktopIndent : this.tabletIndent, 
                    this.desktopMedia.matches ? 23.75 : 50
                );

                let leftCatBoxWidth = screenWidth - rightCatBoxWidth;

                let pushRatio = this.rightContentDeepening(
                    catRangeControl.value / 10, 
                    this.desktopMedia.matches ? this.desktopView : screenWidth - this.tabletIndent * 2, 
                    this.desktopMedia.matches ? this.desktopIndent : this.tabletIndent, 
                    this.desktopMedia.matches ? 23.75 : 50
                );

                this.catExampleAfterBlock.style.width = `${rightCatBoxWidth}px`;
                this.catExampleBeforeBlock.style.width = `${leftCatBoxWidth}px`;
                this.catExampleAfterImg.style.marginLeft = `calc(-250px + ${pushRatio}px)`;
                this.catExampleBeforeImg.style.marginRight = `calc(-340px - ${pushRatio}px)`;
            }

            this.beforeBtn.onclick = () => {
                catRangeControl.value = 0;
                catRangeControl.dispatchEvent(changeCat);
            }

            this.afterBtn.onclick = () => {
                catRangeControl.value = 1000;
                catRangeControl.dispatchEvent(changeCat);
            }

            catRangeControl.dispatchEvent(changeCat);

        } else {

            /* Mobile */

            let picBlock = document.querySelector('.cat-example');
            let controlDisplay = document.querySelector('.cat-example__control-display');

            this.beforeBtn.onclick = () => {
                picBlock.classList.remove('cat-example--after');
                picBlock.classList.add('cat-example--before');

                controlDisplay.classList.remove('cat-example__control-display--after');
                controlDisplay.classList.add('cat-example__control-display--before');
            }

            this.afterBtn.onclick = () => {
                picBlock.classList.remove('cat-example--before');
                picBlock.classList.add('cat-example--after');

                controlDisplay.classList.remove('cat-example__control-display--before');
                controlDisplay.classList.add('cat-example__control-display--after');
            }
        }
    }
}


const livingExample = new LivingExample(
    320,
    20,
    768,
    30,
    1220,
);

livingExample.calc();
window.onresize = livingExample.calc.bind(livingExample);