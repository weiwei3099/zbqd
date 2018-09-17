//import IPage from './Page'
import IPage from './layout/page'
import Lines from './images/lines'
import Layout from './layout'
import Navbar from './layout/navbar'
import IHeader from './layout/header'

const comps = {
  Lines,
  IPage,
  Layout,
  IHeader,
  Navbar
}

const install = function (Vue, opts = {}) {
  Object.keys(comps).forEach((key) => {
    Vue.component(key, comps[key]);
  });
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default Object.assign(comps, {
  install
}); // eslint-disable-line no-undef
