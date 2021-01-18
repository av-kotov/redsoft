'use strict';
(() => {
  if (!Array.from) {
    Array.from = (function () {
      const toStr = Object.prototype.toString;
      const isCallable = function (fn) {
        return typeof fn === `function` || toStr.call(fn) === `[object Function]`;
      };
      const toInteger = function (value) {
        const number = Number(value);
        if (isNaN(number)) {
          return 0;
        }
        if (number === 0 || !isFinite(number)) {
          return number;
        }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      const maxSafeInteger = Math.pow(2, 53) - 1;
      const toLength = function (value) {
        const len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };
      return function from(arrayLike) {
        const C = this;
        const items = Object(arrayLike);
        if (arrayLike == null) {
          throw new TypeError(`Array.from requires an array-like object - not null or undefined`);
        }
        const mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        let T;
        if (typeof mapFn !== `undefined`) {
          if (!isCallable(mapFn)) {
            throw new TypeError(`Array.from: when provided, the second argument must be a function`);
          }
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }
        const len = toLength(items.length);
        const A = isCallable(C) ? Object(new C(len)) : new Array(len);
        let k = 0;
        let kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === `undefined` ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        A.length = len;
        return A;
      };
    }());
  }
  const _promisePolyfill = _interopRequireDefault(`promise-polyfill`);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
  if (!window.Promise) {
    window.Promise = _promisePolyfill.default;
  }
  const buyBtns = Array.from(document.querySelectorAll(`.buy-btn`));
  const Request = {
    URL: `https://jsonplaceholder.typicode.com/posts/1`
  };
  const btnElement = {
    btnText: `Купить`,
    btnDefault: `btn`,
    btnClass: `buy-btn`,
    inBasketClass: `buy-btn--in-basket`,
    inBasketText: `В корзине`
  };
  const preloader = document.querySelector(`#preloader`)
    .content
    .querySelector(`.cssload-container`);
  const setDefaultBtn = (targetBtn) => {
    targetBtn.textContent = btnElement.btnText;
    targetBtn.classList = ``;
    targetBtn.classList.add(btnElement.btnDefault, btnElement.btnClass);
    targetBtn.dataset.value = false;
    localStorage.setItem(`${targetBtn.dataset.id}`,
        targetBtn.dataset.value);
  };
  const setPreloader = (targetBtn) => {
    const preloaderElement = preloader.cloneNode(true);
    targetBtn.textContent = ``;
    targetBtn.append(preloaderElement);
  };
  const setInBacketBtn = (targetBtn) => {
    targetBtn.classList.add(btnElement.inBasketClass);
    targetBtn.textContent = btnElement.inBasketText;
  };
  const sendRequest = (targetBtn) => {
    fetch(Request.URL).then(
        (response) => {
          if (response.ok) {
            setInBacketBtn(targetBtn);
            targetBtn.dataset.value = true;
            localStorage.setItem(`${targetBtn.dataset.id}`,
                targetBtn.dataset.value);
          } else {
            setDefaultBtn(targetBtn);
            throw new Error(`Ошибка соединения`);
          }
        }
    );
  };

  const onButtonClick = (evt) => {
    const targetBtn = evt.target;
    if (targetBtn.classList.contains(btnElement.btnClass) &&
      !targetBtn.classList.contains(btnElement.inBasketClass)) {
      setPreloader(targetBtn);
      sendRequest(targetBtn);
    }
    if (targetBtn.classList.contains(btnElement.btnClass) &&
      targetBtn.classList.contains(btnElement.inBasketClass)) {
      setDefaultBtn(targetBtn);
    }
  };

  for (let i = 0; i < buyBtns.length; i++) {
    if (localStorage[i + 1] === `true`) {
      setInBacketBtn(buyBtns[i]);
    }
  }

  document.addEventListener(`mousedown`, onButtonClick);
})();
