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
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const headPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');

// let login = ''; // для авторизации создаем переменную
let login = localStorage.getItem('gloDelivery'); // получаем логин из Local Storage (вкладка Application/Storage)

const cart = [];

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

// async - асинхронная функция - т.е. внутри мы можем управлять задержкой
// асинхронный запрос не будет останавливать выполнение кода
// await - выполнение следующей строки не начнется, пока эта строка не выполнится
const getData = async function(url) {
  // делаем запрос на сервер с помощью API fetch
  const response = await fetch(url);
  // сначала нужно обработать запрос 
  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url},
      статус ошибка ${response.status}!`);
    // throw скидывает ошибку, сбрасывает выполнение этой функции и вызывает ошибку
    // new Error() - мы сами создаем эту функцию
    // интерполяция ${} - внутри строки в `` могу вставлять любой обычный js-код
  }

  // console.log("OK: ", response.json()); // получили Promise {<pending>} / промис - это обещание, пендинг - ожидание
  // чтобы расшифровать полученные в ответе данные, нужно применить метод json()
  // но выполнить метод json() мы можем только после получения данных - получаем массив данных Array
  // выведет эту ошибку, если она есть в getData('./db/partners.jsoН');

  return await response.json(); // сначала выполниться json(), потом выполнится return
};
// console.log(getData('./db/partners.json')); - проверяем получение массива

function toggleModal() {
  modal.classList.toggle("is-open");
}

// эту же фнкцию можно написать в другом формате - функцию помещаем в переменную: объявить переменную и туда присвоить функцию
// единственное отличие - вызывать такую функцию можно только после ее объявления
// const toggleModal = function() {
//   modal.classList.toggle("is-open");
// }

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

function returnMain() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

function authorized() {

  function logOut() {
    login = null; // пустота - в этом месте нет никаких данных
    // null !== undefined, undefined - браузер использует, а null - программисты
    localStorage.removeItem('gloDelivery'); // когда мы выходим, нажимаем logOut, значение в LS удаляется

    // сбрасываем измененные свойства (скрываем кнопки и имя), '' означает вернуться к норме, прописанной в css
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';

    buttonOut.removeEventListener('click', logOut); // после авторизации необходимо очищать событие
    checkAuth(); // проверка авторизации
    returnMain(); // возврат
  }

  console.log('Авторизован');
  // когда пользователь авторизован, скрываем кнопку
  // buttonAuth.style.backgroundColor = 'red'; // можем менять стили напрямую, стили - в camelCase
  
  userName.textContent = login; // добавим текст (логин в данном случае) внутри этого элемента

  buttonAuth.style.display = 'none'; // меняем свойство display на none
  userName.style.display = 'inline'; // т.к. это span, для него стандартно inline - появится мое имя (логин)
  buttonOut.style.display = 'flex'; // кнопка Выйти появилась вместо Войти
  cartButton.style.display = 'flex'; // появилась кнопка Корзина - flex вместо block чтобы видна была иконка

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

// function checkAuth() {
//   if (login) { // 'login' строка всегда вернет true, а пустая строка '' или null - вернет false
//     authorized();
//   } else {
//     notAuthorized();
//   }
// }
const checkAuth = () => login ? authorized() : notAuthorized();

function createCardRestaurant(restaurant) {  // `` кавычки на кнопке с Ё
  // console.log('restaurant: ', restaurant);
  // вытащим из restaurant данные с помощью делегирования
  // инструмент деструктуризация: деструктурируем массивы и объекты
  const { // {} т.к. у нас массив, внутри пишем все свойства, которые есть у restaurant - порядок не важен
    image,
    kitchen,
    name,
    price, 
    stars,
    products,
    time_of_delivery: timeOfDelivery // во время деструктуризации можно переименовывать
    // теперь time_of_delivery не существует, есть только timeOfDelivery
  } = restaurant; // откуда мы берем эти данные - из restaurant
  // получили переменные с такими простыми именами (вместо restaurant.name)
  // console.log(timeOfDelivery);
  
  // в <img src=" " вместо img/tanuki/preview.jpg пишем ${image}
  // Тануки -> ${name}, 60 - ${timeOfDelivery}, 4.5 - ${stars}, 1 200 - ${price}, Суши, роллы - ${kitchen}
  // в <a class="card card-restaurant"> добавим дата-атритут  data-products="${products}" чтобы в самой карточке хранились данные
  // создаем дата-атрибут data-info="${[name, price, stars, kitchen]}" порядок имеет значение
  const card = ` 
    <a class="card card-restaurant" data-products="${products}" data-info="${[name, price, stars, kitchen]}">
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
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

function createCardRestaurant2({ image, kitchen, name, price, stars, products,  // создаем карточку ресторана
  time_of_delivery: timeOfDelivery }) {  // без дата-атрибутов

  const card = document.createElement('a');
  // card.classList.add('card'); // classList.add - можно таким методом класс добавлять к элементу
  // card.classList.add('card-restaurant'); // метод хорош тем, что он добавляет и не перезаписывает
  card.className = 'card card-restaurant'; // метод все затрет, что было и пересоздаст этот
  // className удобен, когда с нуля создаем элемент и несколько классов надо добавить - одной строкой проще
  card.products = products;
  card.info = [ name, price, stars, kitchen ];

  card.insertAdjacentHTML('beforeend', ` 
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">${stars}</div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  `);
  //console.dir(card); // это карточки, которые мы вставляем на страницу 
  // теперь эти данные хранятся в дом-дереве

  cardsRestaurants.insertAdjacentElement('beforeend', card); // вставляем верстку
}

// при клике на эту карточку открывались карточки с товарами этого магазина - не переход на другую страницу, а рендер карточек тут


// можно деструктурировать прямо в параметрах и не вводить goods:
// function createCardGood(id, name, description, price, image) { и использовать точно так же }
function createCardGood(goods) {

  // console.log("goods - ", goods); // выведем товары чтобы узнать параметры-переменные
  const {
    id,
    name,
    description,
    price,
    image
  } = goods; // деструктурируем товары и распределяем их так же по верстке
  // img/pizza-plus/pizza-classic.jpg - ${image}, Пицца Классика - ${name}, 510 - ${price},
  // Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями, грибы. - ${description}

  const card = document.createElement('div'); // создаем элемент div
  card.className = 'card'; // присваиваем ему класс .card
  // card.id = 'id'; // присваиваем id карточке

  // внутрь этой карточки теперь надо вставить верстку / лучше через insertAdjacentHTML (вариант2)
  card.innerHTML = `
    <img src="${image}" alt="${name}" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id=${id}>
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
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
  
  if(login) { // если авторизован польз-ль НЕ авторизован, то открывается окно авторизации
    
    const restaurant = target.closest('.card-restaurant'); // поднимается выше по родителям пока не найдет элемент с этим селектором,
    // если не найдет - то вернет null, если найдет - этот элемент <a class="card card-restaurant">
    // console.log('restaurant: ', restaurant);

    // нужно получать элементы, которые после клика будем скрывать: блок промо и все карточки ресторанов
    if(restaurant) {
      // console.log(restaurant); // что такое restaurant когда мы в него заходим: <a class="card card-restaurant" data-products="tanuki.json">
      // console.log(restaurant.dataset.products); //нам из всей этой ссылки нужно получить data-products
      // тут restaurant.dataset.products слово products из дата-атрибута data-products

      // console.log(restaurant.dataset.info); // получаем строку вместо массива, т.к. тут ожидалась строка
      // метод split - чтобы получить обратно наш массив: туда передаешь сепаратор (разделитель)
      // console.log(restaurant.dataset.info).split(',')); // метод split по этому разделителю разделит нашу строку на элементы массива
      const info = restaurant.dataset.info.split(','); // если реализуем createCardRestaurant2 вариант 2, то эта строка не нужна

      // деструктурируем этот массив
      const [  name, price, stars, kitchen  ] = info; // последовательность важна! для createCardRestaurant
      // const [  name, price, stars, kitchen  ] = restaurant.info; // для createCardRestaurant2

      // очищаем cards-menu
      cardsMenu.textContent = ''; // блок сначала очищается, потом добавляются новые пиццы
      
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide'); 

      restaurantTitle.textContent = name;
      rating.textContent = stars;
      headPrice.textContent = `От ${price} ₽`; // шаблонная строка вместо headPrice.textContent = 'От ' + price + ' ₽';     
      category.textContent = kitchen;
      
      getData(`./db/${restaurant.dataset.products}`).then(function(data) {
        data.forEach(createCardGood);
      });
    }

  } else {
    toggleModalAuth(); // открываем модальное окно авторизации
  }

}

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  // console.log(buttonAddToCart); // получаем элемент кнопку или null если клик не по любому месту кнопки
  if(buttonAddToCart) {  // если мы попали на кнопку
    // получаем саму карточку - внурти других элементов (не во всем документе) найдем нужный элемент
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;
    // console.log(title, cost, id); // проверка
    const food = cart.find(function(item){
      return item.id === id;
    }) // find - ищет совпадение в массиве cart по условию
    // console.log(food);

    if (food) {
      food.count += 1;
    } else {
      cart.push({ // добавляем объекты в корзину
        id, // id: id, так было - по новому формату если ключ и значение совпадают, можно просто id,
        title,
        cost,
        count: 1,
      })
    }

  }

}

function renderCart() {
  modalBody.textContent = ''; // при входе в корзину очищаем ее сначала и т.о. никогда не будет суммироваться
  // cart.forEach(function(item) { // в cart у нас объекты, назовем их item
  cart.forEach(function({id, title, cost, count}) { // деструктурируем объект item сразу в параметры
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
      </div>
    `;

    modalBody.insertAdjacentHTML('afterbegin', itemCart); // добавляем в начало
  })

  // итоговую стоимость будем считать totalPrice
  // метод reduce будет аккумулировать наши данные, он принимает функцию 
  // первый параметр в функции - result -аккумулирующая переменная, та, которая будет возвращаться из предыдущего вызова этой функции
  // будет вызываться столько же раз, сколько элементов у нас в корзине
  // 0 - передаем для первого вызова, когда не с чем еще складывать, чтобы сумма была 0
  // для первой итерации result неоткуда брать и он возьмет сам элемент item (а это объект), а нам этого не нужно, там должен быть не объект, а сумма
  const totalPrice = cart.reduce(function(result, item) {
    return result + (parseFloat(item.cost) * item.count);
    // функция parseFloat берет строку, начиная с первого символа (исключает сама пробелы в начале), 
    // если первый символ цифра - она себе запишет его, дальше - цифра - запоминает и т.д. пока не встретит пробел - и возвращает нам данное число
    // если встретит точку - то тоже берет как плавающая запятая и дальше идет, пока не встретит пробел или любой другой символ, который не цифра или вторую точку
  }, 0);

  modalPrice.textContent = totalPrice + ' ₽';

}

function changeCount(event) {
  const target = event.target;

  // метод contains определяет, есть ли такой класс у этого элемента
  if(target.classList.contains('counter-button')) { 
    // внутри нашей корзины cart мы будем искать find элемент, у которого такой id, как в дата-атрибуте
    const food = cart.find(function(item) {
      return item.id === target.dataset.id;
    });
    if(target.classList.contains('counter-minus')) {
      food.count--; // уменьшаем счетчик на 1
      if(food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if(target.classList.contains('counter-plus')) food.count++; // увеличиваем счетчик на 1
    renderCart();
  }

}


// функция init() будет инициализировать - запускать наш проект
function init() {
  getData('./db/partners.json').then(function(data) {
    // console.log(data); // получили нормальные данные в виде массива объектов - с ними легко работать
    data.forEach(createCardRestaurant); // внутри метода forEach будет callback-функция - наша функция, которая создает карточки
    // каждый объект будет передан 6 раз:
    // 6 раз будет передана эта функция (столько, сколько элементов) и 6 раз будет передан новый объект
  });
  // с помощью метода then (так обрабатывают промисы) обработаем ответ от функции getData()
  // внутри then укажем callback-функцию, которая выполнится после того, как выполнится getData(),
  // т.е. вернется нам ответ и выполнится функция внутри then
  // перебираем полученные данные методом array.forEach(element => { });
  
  
  // обработчики событий:
  
  cartButton.addEventListener("click", renderCart);
  cartButton.addEventListener("click", toggleModal);

  buttonClearCart.addEventListener('click', function() {
    cart.length = 0; // очищаем корзину - длина массива равна нулю
    renderCart();
  });

  modalBody.addEventListener('click', changeCount);

  cardsMenu.addEventListener('click', addToCart);
  
  close.addEventListener("click", toggleModal);
  
  cardsRestaurants.addEventListener('click', openGoods);
  
  // logo.addEventListener('click', function() { // возврат исходной страницы по клику на логотип
  //   containerPromo.classList.remove('hide');
  //   restaurants.classList.remove('hide');
  //   menu.classList.add('hide'); 
  // });
  logo.addEventListener('click', returnMain);
  
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
}

init();
