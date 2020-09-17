import $ from 'jquery';
global.$ = $;

import Handlebars from 'handlebars';
global.Handlebars = Handlebars;

import * as PIXI from 'pixi.js'
global.PIXI = PIXI;

console.log(PIXI);

import gsap from 'gsap';
global.gsap = gsap;

export let data;

export function setData(_data) {
    data = _data;
}

//
export const eventBus = window;
export const $eventBus = $(eventBus);

//
export const $window = $(window);
