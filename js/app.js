'use strict';

// Навчальні дані: не є реальним меню будь-якого закладу.
const DEMO_MENU = [
  { name: 'Борщ український', category: 'Перша страва', description: 'Перша страва · 250 мл', price: '38 грн', emoji: '🥣' },
  { name: 'Картопляне пюре', category: 'Гарнір', description: 'Гарнір · 180 г', price: '32 грн', emoji: '🥔' },
  { name: 'Овочевий салат', category: 'Салат', description: 'Свіжі овочі · 120 г', price: '29 грн', emoji: '🥗' },
  { name: 'Компот ягідний', category: 'Напій', description: 'Напій · 200 мл', price: '18 грн', emoji: '🫐' }
];

const loadButton = document.getElementById('loadMenuBtn');
const errorButton = document.getElementById('errorBtn');
const statusElement = document.getElementById('menuStatus');
const resultsElement = document.getElementById('menuResults');
const errorElement = document.getElementById('menuError');
const categoryFilter = document.getElementById('categoryFilter');
const categoryFilterContainer = document.getElementById('categoryFilterContainer');
let loadedMenu = [];
let isLoading = false;

// Promise імітує мережевий запит; жоден сервер чи API не використовується.
function fetchMenuDemo(shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Демонстраційна помилка отримання меню.'));
      } else {
        resolve(DEMO_MENU);
      }
    }, 1500);
  });
}

function renderMenu(items) {
  resultsElement.replaceChildren();
  for (const item of items) {
    const article = document.createElement('article');
    article.className = 'dish';
    const emoji = document.createElement('span');
    emoji.className = 'dish-emoji';
    emoji.setAttribute('aria-hidden', 'true');
    emoji.textContent = item.emoji;
    const heading = document.createElement('h3');
    heading.textContent = item.name;
    const description = document.createElement('p');
    description.textContent = item.description;
    const price = document.createElement('span');
    price.className = 'dish-price';
    price.textContent = item.price;
    article.append(emoji, heading, description, price);
    resultsElement.append(article);
  }
}

function renderFilteredMenu() {
  const selectedCategory = categoryFilter.value;
  const items = selectedCategory === 'all'
    ? loadedMenu
    : loadedMenu.filter(item => item.category === selectedCategory);
  renderMenu(items);
}

async function loadMenu(shouldFail = false) {
  if (isLoading) return;
  isLoading = true;
  loadButton.disabled = true;
  errorButton.disabled = true;
  categoryFilter.disabled = true;
  resultsElement.setAttribute('aria-busy', 'true');
  errorElement.hidden = true;
  statusElement.className = 'status loading';
  statusElement.textContent = 'Завантажуємо меню…';

  try {
    const menu = await fetchMenuDemo(shouldFail);
    loadedMenu = menu;
    categoryFilterContainer.hidden = false;
    categoryFilter.disabled = false;
    renderFilteredMenu();
    statusElement.className = 'status';
    statusElement.textContent = `Готово! Завантажено ${menu.length} страви.`;
  } catch (error) {
    loadedMenu = [];
    resultsElement.replaceChildren();
    errorElement.hidden = false;
    statusElement.className = 'status error';
    statusElement.textContent = error instanceof Error ? error.message : 'Невідома помилка.';
  } finally {
    isLoading = false;
    loadButton.disabled = false;
    errorButton.disabled = false;
    resultsElement.setAttribute('aria-busy', 'false');
  }
}

categoryFilter.addEventListener('change', renderFilteredMenu);
loadButton.addEventListener('click', () => loadMenu(false));
errorButton.addEventListener('click', () => loadMenu(true));
