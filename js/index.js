const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const minweightInput = document.querySelector('.minweight__input'); 
const maxweightInput = document.querySelector('.maxweight__input');
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = '';
  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild

    //Создадим элемент li и присвоим ему класс fruit__item
    let li = document.createElement('li');
    li.className = "fruit__item";
    //дополним класс цветом
    switch(fruits[i].color){ 
      case "фиолетовый":
        li.className += ' fruit_violet';
        break;
      case "зеленый":
        li.className += ' fruit_green';
        break;
      case "розово-красный":
        li.className += ' fruit_carmazin';
        break;
      case "желтый":
        li.className += ' fruit_yellow';
        break;
      case "светло-коричневый":
        li.className += ' fruit_lightbrown';
        break;
      default:
        li.className += ' fruit_black';
    };
    //добавим в li внутреннюю структуру с параметрами текущего фрукта
    li.innerHTML = `<div class = 'fruit__info'>
    <div>index: ${i}</div>
    <div>kind: ${fruits[i].kind}</div>
    <div>color: ${fruits[i].color}</div>
    <div>weight (кг): ${fruits[i].weight}</div>
    </div>`;

    //поместим новый li в код fruitsList

    fruitsList.appendChild(li);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  let defaultFruits = [...fruits]

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    let removedItem = fruits.splice(getRandomInt(0, fruits.length-1), 1);
    result.push(removedItem[0]);
   
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
  }

  fruits = result;

  if (JSON.stringify(defaultFruits) === JSON.stringify(fruits)) {
    alert ('Порядок не изменился');
  }
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

const filterFruits = () => {
  let result =[];
  let min = minweightInput.value;
  let max = maxweightInput.value;

  fruits.filter((item) => {
   if (min <= item['weight'] && max >= item['weight']) {
     result.push(item);
   }
  });
  fruits = result;
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки
let colorChoice = {'розово-красный':1, 'светло-коричневый':2,'желтый':3, 'зеленый':4, 'фиолетовый':5, 'черный':6};

const comparationColor = (a, b) => {
  // TODO: допишите функцию сравнения двух элементов по цвету
  return colorChoice[a.color] > colorChoice[b.color] ? true : false;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком
    const n = arr.length;
    for (let i=0; i < n-1; i++) {
      for (let j=0; j < n-1-i; j++) {
        if (comparation(arr[j], arr[j+1])) {
          let temp = arr[j+1];
          arr[j+1] = arr[j];
          arr[j] = temp;
        }
      }
    }
  },

  // функция обмена элементов
 swap(items, firstIndex, secondIndex) {
  const temp = items[firstIndex];
  items[firstIndex] = items[secondIndex];
  items[secondIndex] = temp;
},

// функция разделитель
 partition(items, left, right) {
  var pivot = items[Math.floor((right + left) / 2)],
      i = left,
      j = right;
  while (i <= j) {
      while (items[i] < pivot) {
          i++;
      }
      while (items[j] > pivot) {
          j--;
      }
      if (i <= j) {
          swap(items, i, j);
          i++;
          j--;
      }
  }
  return i;
},

  quickSort(items, left, right) {
    // TODO: допишите функцию быстрой сортировки
    var index;
    if (items.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? items.length - 1 : right;
        index = sortAPI.partition(items, left, right);
        if (left < index - 1) {
          sortAPI.quickSort(items, left, index - 1);
        }
        if (index < right) {
          sortAPI.quickSort(items, index, right);
        }
    } 
    return items;
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  if (sortKind == 'quickSort') {
		sortKind = 'bubbleSort';
  } else {
		sortKind = 'quickSort';
  }
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // TODO: вывести в sortTimeLabel значение sortTime
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  let newkind = kindInput.value;
  let newcolor = colorInput.value;
  let newweight = weightInput.value;

  if (!newkind || !newcolor || !newweight) {
    alert("Заполните пустые поля!");
  }  else {
    newItem = {'kind':newkind, 'color':newcolor, 'weight':newweight};
      fruits.push(newItem);
  }
  display();

  kindInput.value = colorInput.value = weightInput.value = '';
});
