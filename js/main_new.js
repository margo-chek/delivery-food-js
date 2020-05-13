'use strict';
// писать в двух строках сразу: встать на 1 строку, зажать alt и встать на другую - будет 2 курсора

// const HALF = 0.5; // константы - избавление от чисел в коде

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
// console.log(document.querySelector('section')); // не все получим, а первый только
// console.log(document.querySelector('.button-auth')); // получили кнопку Войти
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth'); // модальное окно
const closeAuth = document.querySelector('.close-auth'); // крестик закрытия модального окна
const logInForm = document.querySelector('#logInForm'); // форма мод.окна по id
// то же через id // const logInForm = document.getElementById('logInForm'); 
const loginInput = document.querySelector('#login'); // получаем лонин из поля ввода формы
const userName = document.querySelector('.user-name'); // .user-name
const buttonOut = document.querySelector('.button-out'); // .button-out кнопка Выйти
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

// let login = ''; // для авторизации создаем переменную
let login = localStorage.getItem('gloDelivery'); // получаем логин из Local Storage (вкладка Application/Storage)

// modalAuth.classList.add("hello"); // добавить класс
// modalAuth.classList.contains("hello"); // bool - содержит ли - проверка наличия класса
// modalAuth.classList.remove("modal-auth"); // удаляет класс
// modalAuth.classList.toggle("hello"); // добавляет и убирает классы: если есть - удалит, нет - добавит

// console.dir(modalAuth); // выводит переменную в виде объекта
// console.log(modalAuth); // выведем элемент
// console.log(modalAuth.classList.contains("hello")); // true или false

const valid = function(str) {  // регулярные выражения https://habr.com/ru/post/123845/
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/; // регулярное выражение Имя пользователя, внутри /^  $/
  return nameReg.test(str); // возвращает true или false, test - метод
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  // loginInput.style.borderColor = ''; // возвращает цвет рамки в изначальный из css
  modalAuth.classList.toggle("is-open");
}

// навешиваем событие на кнопку Войти,
// для этого обращаемся к кнопке buttonAuth и навешиваем на нее слушатель событий
// js будет слушать - проверять, когда же произойдет событие (клик на кнопку), тогда выполнит функцию
// buttonAuth.addEventListener('click', function() {
//   console.log('Hello');
// })
// buttonAuth.addEventListener('click', toggleModalAuth); // м.б. хоть сколько, будут выполняться одновременно
// buttonAuth.removeEventListener('click', toggleModalAuth); // удаляем событие

// чтобы авторизоваться, нужно получить саму форму

// function returnMain() {
//   containerPromo.classList.remove('hide');
//   restaurants.classList.remove('hide');
//   menu.classList.add('hide');
// }

function authorized() {

  function logOut() {
    login = null; // пустота - в этом месте нет никаких данных
    // null !== undefined, undefined - браузер использует, а null - программисты
    localStorage.removeItem('gloDelivery'); // когда мы выходим, нажимаем logOut, значение в LS удаляется

    // сбрасываем измененные свойства (скрываем кнопки и имя), '' означает вернуться к норме, прописанной в css
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';

    buttonOut.removeEventListener('click', logOut); // после авторизации необходимо очищать событие
    checkAuth(); // проверка авторизации
    // returnMain(); // возврат
  }

  console.log('Авторизован');
  // когда пользователь авторизован, скрываем кнопку
  // buttonAuth.style.backgroundColor = 'red'; // можем менять стили напрямую, стили - в camelCase
  
  userName.textContent = login; // добавим текст (логин в данном случае) внутри этого элемента

  buttonAuth.style.display = 'none'; // меняем свойство display на none
  userName.style.display = 'inline'; // т.к. это span, для него стандартно inline - появится мое имя (логин)
  buttonOut.style.display = 'block'; // кнопка Выйти появилась вместо Войти

  buttonOut.addEventListener('click', logOut); // по клику на кнопку Выйти выполняется функция logOut
}

function maskInput(string) {
  return !!string.trim()
}

function notAuthorized() {
  console.log('Не авторизован');

  function logIn(event) { // мой вариант))
    event.preventDefault(); // стандартные дефолтные поведения браузера - блокируем

    // console.log(loginInput.value); // получаем значение из поля ввода логин
    login = loginInput.value.trim(); // trim() - удаляем пробелы с обоих сторон

    // запоминаем авторизованного пользователя через Local Storage, добавим запись нашего логина в LS
    localStorage.setItem('gloDelivery', login); // setItem - метод, который добавляет свойства со значением, 
    // gloDelivery - свойства опишем в виде строки, login - значение, наш логин например

    if (login) {
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth); // после авторизации необходимо очищать событие
      closeAuth.removeEventListener('click', toggleModalAuth); // после авторизации необходимо очищать событие
      logInForm.removeEventListener('submit', logIn); // после авторизации необходимо очищать событие
      logInForm.reset(); // очищаем поле, этот метод сбрасывает все значения в поле по умолчанию
      checkAuth();
    } else {
      alert ('Введите логин')
    }
    
  }

  function logIn2(event) { // другой вариант, тогда стороку 39 раскомментировать 
    event.preventDefault();
    
    // if (maskInput(loginInput.value)) {  // через маску пропускаем введенный логин
    if (valid(loginInput.value)) {  // через валидацию пропускаем введенный логин
      login = loginInput.value.trim();
      localStorage.setItem('gloDelivery', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = 'tomato'; // покрасить рамку в красный цвет - потом сброс не забыть
      loginInput.value = ''; // очищаем поле, если ввод не проходит валидацию
    }
    
  }

  buttonAuth.addEventListener('click', toggleModalAuth); // по клику открываем модальное окно
  closeAuth.addEventListener('click', toggleModalAuth); // по клику закрываем модальное окно
  logInForm.addEventListener('submit', logIn); // при отправке формы выполнить функцию logIn
} 

function checkAuth() {
  if (login) { // 'login' строка всегда вернет true, а пустая строка '' или null - вернет false
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant() {  // `` кавычки на кнопке с Ё

  const card = ` 
    <a class="card card-restaurant">
      <img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">Тануки</h3>
          <span class="card-tag tag">60 мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            4.5
          </div>
          <div class="price">От 1 200 ₽</div>
          <div class="category">Суши, роллы</div>
        </div>
      </div>
    </a>
  `;

  // параметры - 1)где(куда вставляем) 2)что ставить (card) //  куда - 4 варианта: 
  // afterbegin - сразу после открывающегося тега cardsRestaurants, т.е. внутрь, но в начало
  // afterend - вставляет после данного элемента,
  // beforebegin - вставляет до этого элемента, т.е. перед ним,
  // beforeend - вставляет в конец этого блока cardsRestaurants
  cardsRestaurants.insertAdjacentHTML('beforeend', card); // вставляем верстку
}

// при клике на эту карточку открывались карточки с товарами этого магазина - не переход на другую страницу, а рендер карточек тут

function createCardGood() {
  const card = document.createElement('div'); // создаем элемент div
  card.className = 'card'; // присваиваем ему класс .card

  // внутрь этой карточки теперь надо вставить верстку / лучше через insertAdjacentHTML (вариант2)
  card.innerHTML = `
    <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Классика</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
          грибы.
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">510 ₽</strong>
      </div>
    </div>
  `;

  // console.log(card); // получаем <div class="card"></div>

  // теперь эту карточку нужно на страницу добавить на позицию beforeend
  cardsMenu.insertAdjacentElement('beforeend', card); 
}

function createCardGood2() { 
  const card = document.createElement('div');
  card.className = 'card';

  // другой вариант вставить верстку в карточку - лучше намного, чем через innerHTML
  card.insertAdjacentHTML('beforeend', `
    <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Классика</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
          грибы.
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">510 ₽</strong>
      </div>
    </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) { // открывается карточка ресторана
  
  // console.log('event.target: ', event.target); // по какому элементу кликнули получаем
  const target = event.target;
  // const restaurant = target; // нам нужно от него подниматься вверх до главного div-a
  const restaurant = target.closest('.card-restaurant'); // поднимается выше по родителям пока не найдет элемент с этим селектором,
  // если не найдет - то вернет null, если найдет - этот элемент <a class="card card-restaurant">
  console.log('restaurant: ', restaurant);

  // нужно получать элементы, которые после клика будем скрывать: блок промо и все карточки ресторанов
  if(restaurant) {

    if(login) { // если авторизован польз-ль НЕ авторизован, то открывается окно авторизации
      // очищаем cards-menu
      cardsMenu.textContent = ''; // блок сначала очищается, потом добавляются новые пиццы
      
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide'); 

      createCardGood();
      createCardGood();
      createCardGood();
    } else {
      toggleModalAuth(); // открываем модальное окно авторизации
    }
    
  }

}


// обработчики событий:

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener('click', openGoods);

logo.addEventListener('click', function() { // возврат исходной страницы по клику на логотип
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide'); 
});

// вызовы:

checkAuth(); // при загрузке страницы нужно единожды вызвать проверку авторизации

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

// вызов / инициализация слайдера Swiper
new Swiper('.swiper-container', {
  loop: true, // чтобы он был бесконечным (по кругу крутится)
  //autoplay: true, // автоматически листается
  autoplay: {
    delay: 3000, // задержка 3 секунды
  },
  // slidesPerView: 3, // сколько слайдов показывать
  // slidesPerColumn: 2, // сколько в колонку

});
