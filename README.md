# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Карточка

```
export interface IProduct {
    _id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number
}
```

Данные пользователя
```
export interface IUserData {
   phone: string,
   mail: string,
   paymentMethod: string,
   deliveryAddress?: string 
}   
```

Интерфейс для модели данных карточек

```
export interface IProductData {
    products: IProduct[]
}
```

Данные карточки товара, используемые в форме при клике на карточку товара на главной странице
```
export type TProductInfo = Pick<IProduct, 'title' | 'description' | 'category' | 'price' | 'image'>
```

Данные карточки товара, используемые в форме при открытии корзины

```
export type TProductCart = Pick<IProduct, 'title' | 'category' | 'price'>
```

Данные покупателя, используемые в форме выбора способа доставки

```
export type TFormPayment = Pick<IForm, 'paymentMethod' | 'deliveryAddress'>
```

Данные покупателя, используемые в форме указания почты и телефона

```
export type TFormInfo = Pick<IForm, 'mail' | 'phone'>
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Конструктор:

```
export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }
}
```

- constructor(baseUrl: string, options: RequestInit = {}) - принимает базовый URL и глобальные опции для всех запросов(опционально)

Поля: 
- `baseUrl: string` - базовый адрес сервера
- `options: RequestInit` - объект с заголовками запросов

Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
- `handleResponse()` - обрабатывает ответ от сервера

#### Класс EventEmitter

```
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }
}
```

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  

Конструктор:
- `constructor() {this._events = new Map<EventName, Set<Subscriber>>();}` - инициализацирует объект.

Поля: 
- `events = new Map<EventName, Set<Subscriber>>()` - используется для хранения информации о событиях и их подписчиках

Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `off` - снятие обработчика с события
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие
- `onAll` - установка слушашателя на все события
- `offAll` - сброс всех обработчиков с события

#### Класс View
```
class View<T extends HTMLElement> {
    container: T;
    events: IEvents;

    constructor(container: T) {
        this.container = container;
        this.events = events;
    }
}
```

Представляет собой поля и методы для отрисовки элементов на странице.

Конструктор:
- constructor(container: HTMLElement, events: IEvents) - конструктор принимает принимает DOM-элемент и экземпляр класса EventEmmiter

- `container: HTMLElement` - DOM-элемент контейнера
- `events: IEvents` - брокер событий

Методы:
- `render` - отображение данных
- `setText` - установка текста 
- `setImage` - установка картинки
- `setDisable` - деактивация кнопки
- `setActive` - активация кнопки
- `setHidden` - скрытие элемента
- `setVisible` - отображение элемента 
- `toggleClass` - переключение класса

### Слой данных

#### Класс ProductData
Класс отвечает за хранение и логику работы с данными товаров.\

Конструктор:
- constructor(events: IEvents) - конструктор класса принимает инстант брокера событий

В полях класса хранятся следующие данные:
- _products: IProduct[] - массив объектов товаров
- _preview: string | null - id товара, выбранный для просмотра в модальной окне
- cart: TProductCart -  товары, добавленные пользователем в корзину
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Конструктор:
- constructor(events: IEvents) - конструктор класса принимает инстант брокера событий

Методы класса:
- getProduct(productId: string): IProduct - возвращает товар по id
- setProducts() - вывод списка продуктов
- addToCart() - добавление товара в корзину.
- removeFromCart() - удаление товара в корзину.
- clearCart() - очищаение корзины

#### Класс FormData
Класс отвечает за хранение данных о покупателе.\

Конструктор:
- constructor(events: IEvents) - конструктор класса принимает инстант брокера событий

В полях класса хранятся следующие данные:
- phone: string - номер телефона покупателя
- mail: string - электронная почта покупателя
- paymentMethod: string - выбранный способ оплаты
- deliveryAddress?: string - адресс куда осуществляется доставка
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

### Классы предстовления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру по клику на оверлей и кнопку-крестик для закрытия попапа.  

Конструктор: 
- constructor(container: HTMLElement, events: IEvents) -  наследуется от абстрактного класса Component

Поля класса
- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий
- btn: HTMLButtonElement - кнопка подтверждения
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекции всех полей ввода формы
- errors: Record<string, HTMLElement> - объект хранящий все элементы для вывода ошибок под полями формы с привязкой к атрибуту name инпутов

Методы: 
- setError(data: {field: string, value: string, validInformation: string}): void - принимает объект с данными для отображения или скрытия ошибок под полями ввода
- showInputError(fiel: string, errorMessage: string): void - отображает полученный текст ошибки под указанным полем ввода
- hideInputError(fiel: string): void - скрывает текст ошибки под указанным полем ввода
- clearModal() - очищает поля формы и сбрасывает состояния кнопок при сабмите.
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения

#### Класс ModalWithСart
Расширяет класс Modal. Предназначен для реализации модального окна с формой, содержащей информацию о выбранных товара в корзине. При сабмите инициирует событие подтверждения данных и переходу к оформлению заказа.

Конструктор: 
- constructor(container: HTMLElement, events: IEvents) -  наследуется от абстрактного класса Component

Поля класса наследются из класса Modal:
- submitButton: HTMLButtonElement - кнопка подтверждения
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы

Поля класс:
- list: HTMLElement[] - коллекция всех выбранных товаров
- total: number; - итоговая стоимость

Методы: 
- deleteProduct(productId: string): void  - удаление товара из корзины

#### Класс SuccessfulOrder
Расширяет класс Modal. Предназначен для реализации модального окна с формой, содержащей сообщение об успешном оформлении заказа, в которое передаётся полная стоимость корзины. 

Конструктор: 
- constructor(container: HTMLElement, events: IEvents) -  наследуется от абстрактного класса Component

Поля класс:
- total: number; - итоговая стоимость корзины

#### Класс ModalWithInfo
Расширяет класс Modal. Предназначен для реализации модального окна с формой, содержащей поля ввода телефона и почты. При сабмите инициирует событие подтверждения данных и переход на окно с уведомлением об успешном оформлении заказа.

Конструктор: 
- constructor(container: HTMLElement, events: IEvents) -  наследуется от абстрактного класса Component

Поля класса наследются из класса Modal:
- submitButton: HTMLButtonElement
- _form: HTMLFormElement 
- formName: string 
- inputs: NodeListOf<HTMLInputElement> 
- errors: Record<string, HTMLElement> 

Методы наследются из класса Modal: 
- setError(data: {field: string, value: string, validInformation: string}): void 
- showInputError(fiel: string, errorMessage: string): void 
- hideInputError(fiel: string): void 
- clearModal() 

#### Класс ModalWithAdress
Расширяет класс Modal. Предназначен для реализации модального окна с формой, содержащей поле ввода адреса и способов оплаты заказа. При сабмите инициирует событие подтверждения данных для отправки и оплаты заказа. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.

Конструктор: 
- constructor(container: HTMLElement, events: IEvents) -  наследуется от абстрактного класса Component

Поля класса наследются из класса Modal:
- submitButton: HTMLButtonElement
- _form: HTMLFormElement
- formName: string 
- inputs: NodeListOf<HTMLInputElement> 
- errors: Record<string, HTMLElement>

Поля класса:
- PaymentButton: HTMLButtonElement - кнопка выбора способа оплаты

Методы наследются из класса Modal: 
- setError(data: {field: string, value: string, validInformation: string}): void 
- showInputError(fiel: string, errorMessage: string): void 
- hideInputError(fiel: string): void 
- clearModal() 

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

#### Взаимодействие компнонетов
Взаимодействие осуществляется за счет событий, генерируемых с помощью броекера событий и их обработчиков. 

Список событий, которые могут генерироваться в системе

- `products:changed` - изменение массива карточек товаров.
- `product:selected` - при клике на товар всплывает модальное окно с подробной информацией о товаре и возможностью добавления товара в корзину.
- `payment:change` - выбор способа оплаты.
- `address:input` - ввод адреса доставки заказа.
- `mail:input` - ввод почтового ящика покупателя.
- `phone:input` - ввод телефона покупателя.
- `order:complete` - при открытии окна успешной оплаты.
- `info:submit` - подтверждение контактных данных.
- `order:submit` - подтверждение данных для оплаты и доставки.
- `cart:open`- открытие модального окна с содержимым корзины.
- `cart:toggleItem` - при клике в модальном окне товара на кнопку "добавить в корзину" происходит добавление товара.
- `cart:deleteItem` - при клике на кнопку удаления товара в корзине.
- `cart:order` - оформление заказа из корзины.
- `order:validation` - событие, сообщающее о необходимости валидации формы с вводом адреса и способа оплаты.
- `info:validation` - событие, сообщающее о необходимости валидации формы с контактными данными. 