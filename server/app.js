const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const ItemTypes = {
  REAL_ESTATE: 'Недвижимость',
  AUTO: 'Авто',
  SERVICES: 'Услуги',
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory хранилище для объявлений
let items = [
  {
    id: 1,
    name: 'Продам квартиру в центре города',
    description: 'Квартира с видом на парк и бассейн.',
    location: 'Москва, ул. Пушкина, д. 5',
    type: ItemTypes.REAL_ESTATE,
    propertyType: 'Квартира',
    area: 80,
    rooms: 2,
    price: 600000,
  },
  {
    id: 2,
    name: 'Продажа автомобиля BMW X5',
    brand: 'BMW',
    model: 'X5',
    year: 2019,
    mileage: 20000,
    price: 75000,
    type: ItemTypes.AUTO,
  },
  {
    id: 3,
    name: 'Почистить окна',
    serviceType: 'Очистка окон',
    experience: 'Более 5 лет опыта',
    cost: 150,
    type: ItemTypes.SERVICES,
  },
  {
    id: 4,
    name: 'Ремонт компьютера',
    serviceType: 'Ремонт компьютеров',
    experience: 'Более 10 лет опыта',
    cost: 200,
    type: ItemTypes.SERVICES,
  },
  {   id: 5,
    name: 'Сделать ремонт в квартире',
    description: 'Необходимо выполнить полный ремонт в квартире.',
    location: 'СПб, ул. Ленина, д. 10',
    propertyType: 'Квартира',
    area: 90,
    rooms: 3,
    price: 800000,
    type: ItemTypes.SERVICES
  },
  {
    id: 6,
    name: 'Продажа машины Toyota Camry',
    brand: 'Toyota',
    model: 'Camry',
    year: 2021,
    mileage: 15000,
    price: 85000,
    type: ItemTypes.AUTO
  },
  {
    id: 7,
    name: 'Заказать курьерскую доставку',
    serviceType: 'Доставка товаров',
    deliveryTime: 'В течение дня',
    cost: 50,
    type: ItemTypes.SERVICES
  },
  {   id: 8,
    name: 'Продажа жилого дома',
    description: 'Жилое помещение с хорошей отделкой и удобной мебелью.',
    location: 'Москва, ул. Мира, д. 15',
    type: ItemTypes.REAL_ESTATE,
    propertyType: 'Дом',
    area: 200,
    rooms: 4,
    price: 1500000,
  },
  {
    id: 9,
    name: 'Продажа автомобиля Audi A4',
    brand: 'Audi',
    model: 'A4',
    year: 2020,
    mileage: 30000,
    price: 95000,
    type: ItemTypes.AUTO
  },
  {
    id: 10,
    name: 'Приготовить еду',
    serviceType: 'Готовка пищи',
    cuisineStyle: 'Итальянская кухня',
    costPerPerson: 50,
    type: ItemTypes.SERVICES
  },
];

const makeCounter = () => {
  let count = 0;
  return () => count++;
};

const itemsIdCounter = makeCounter();

// Создание нового объявления
app.post('/items', (req, res) => {
  const { name, description, location, type, ...rest } = req.body;

  // Validate common required fields
  if (!name || !description || !location || !type) {
    return res.status(400).json({ error: 'Missing required common fields' });
  }

  switch (type) {
    case ItemTypes.REAL_ESTATE:
      if (!rest.propertyType || !rest.area || !rest.rooms || !rest.price) {
        return res
          .status(400)
          .json({ error: 'Missing required fields for Real estate' });
      }
      break;
    case ItemTypes.AUTO:
      if (!rest.brand || !rest.model || !rest.year || !rest.mileage) {
        return res
          .status(400)
          .json({ error: 'Missing required fields for Auto' });
      }
      break;
    case ItemTypes.SERVICES:
      if (!rest.serviceType || !rest.experience || !rest.cost) {
        return res
          .status(400)
          .json({ error: 'Missing required fields for Services' });
      }
      break;
    default:
      return res.status(400).json({ error: 'Invalid type' });
  }

  const item = {
    id: itemsIdCounter(),
    name,
    description,
    location,
    type,
    ...rest,
  };

  items.push(item);
  res.status(201).json(item);
});

// Получение всех объявлений
app.get('/items', (req, res) => {
  res.json(items);
});

// Получение объявления по его id
app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id, 10));
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

// Обновление объявления по его id
app.put('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id, 10));
  if (item) {
    Object.assign(item, req.body);
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

// Удаление объявления по его id
app.delete('/items/:id', (req, res) => {
  const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id, 10));
  if (itemIndex !== -1) {
    items.splice(itemIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Item not found');
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});