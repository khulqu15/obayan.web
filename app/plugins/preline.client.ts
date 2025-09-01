import { useRouter } from "vue-router";

import $ from "jquery";
import _ from "lodash";
import noUiSlider from "nouislider";
import "datatables.net";
import "dropzone/dist/dropzone-min.js";
import * as VanillaCalendarPro from "vanilla-calendar-pro";
import { defineNuxtPlugin } from "nuxt/app";

window._ = _;
window.$ = $;
window.jQuery = $;
window.DataTable = $.fn.dataTable;
window.noUiSlider = noUiSlider;
window.VanillaCalendarPro = VanillaCalendarPro;

import("preline/dist");

export default defineNuxtPlugin(async () => {
  const { HSStaticMethods } = await import('preline')
  queueMicrotask(() => {
    // @ts-ignore
    window.HSStaticMethods?.autoInit()
  })
})