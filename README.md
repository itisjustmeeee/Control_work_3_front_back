# Control_work_3_front_back

> [!NOTE]
> репозиторий для контрольной работы №3 по фронтэнд и бекэнд разработке

## Что представляет проект

Данный проект представляет собой простой сайт для создания заметок с безопасным соединением и быстрой загрузкой интерфейса, который может работать как офлайн-приложение, кэшировать ресурсы и перехватывать сетевые запросы.

## Реализованные вещи

В данном проекте реализованы:
1. Создание заметок
2. Удаление заметок
3. Отметка заметок, как выполненные
4. Настройка времени напоминания о созданной заметке
5. Стабильная работа приложения в off-line режиме
6. Активация подписки на получение уведомлений и отписка от получения уведомлений
7. Скачивание приложения на устройство и его стабильная работа
8. Откладывание напоминаний на 5 минут
9. Скрытие напоминания

## Использованные языки

> [!IMPORTANT]
> ![JS](https://img.shields.io/badge/JavaScript-yellow)
> ![CSS](https://img.shields.io/badge/CSS-purple)
> ![HTML](https://img.shields.io/badge/HTML-red)

## Установка и запуск проекта

1. **__Установите Node.js (если он отсутствует)__**
2. **Клонируйте репозиторий проекта и перейдите в папку practics_13-18**
```
git clone https://github.com/itisjustmeeee/Control_work_3_front_back.git
```
3. **Установите зависимости**

В разных терминалах перейдите в папки server и client и установите зависимости в каждой
```
cd server
npm install
```
```
cd client
npm install
```
4. **Настройте ключи**

В папке server создайте файл .env (перед `.` ничего писать не нужно).<br>
В нем создайте три переменные: VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY

В поле VAPID_EMAIL напишите email в формате: mailto:example@mail.com

Затем выполните в терминале:
```
npx web-push generate-vapid-keys
```
И полученные публичный и приватный ключи запишите в переменные VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY

5. **Запустите проект**

В папке server напишите:
```
node server.js
```

В папке client:
```
npm run dev
```

Затем откройте полученную на client ссылку в браузере

## Структура проекта

- [practics_13-18/server](practics_13-18/server): папка с бэкендом
- [practics_13-18/client](practics_13-18/client): папка с фронтендом
- [practics_13-18/server/server.js](practics_13-18/server/server.js): файл с основным кодом бэкенда для работы приложения
- [practics_13-18/client/icons](practics_13-18/client/icons): папка с иконками для приложения
- [practics_13-18/client/public/sw.js](practics_13-18/client/public/sw.js): ServiceWorker-файл, который действует как прокси-сервер, перехватывая сетевые запросы, управляя кешированием, обеспечивая офлайн-работу, push-уведомления и фоновую синхронизацию данных
- [practics_13-18/client/src](practics_13-18/client/src): основная папка с файлами фронтенда
- [practics_13-18/client/src/TodoForm.jsx](practics_13-18/client/src/TodoForm.jsx): файл с формой для создания новой заметки
- [practics_13-18/client/src/TodoItem.jsx](practics_13-18/client/src/TodoItem.jsx): файл, в котором реализована карточка каждого напоминания
- [practics_13-18/client/src/TodoList.jsx](practics_13-18/client/src/TodoList.jsx): файл, в котором реализовано отображение списка заметок
- [practics_13-18/client/src/App.jsx](practics_13-18/client/src/App.jsx): основной файл, необходимый для работы приложения
- [practics_13-18/client/src/push](practics_13-18/client/src/push): папка с файлом, который работает с подпиской
- [practics_13-18/client/src/push/PushService.js](practics_13-18/client/src/push/PushService.js): файл, с помощью которого инициализируется и отменяется подписка
- [practics_13-18/client/src/utils](practics_13-18/client/src/utils): папка с файлом, который переводит значение ключа VAPID-ключа в нужный браузеру формат
- [practics_13-18/client/src/utils/push.js](practics_13-18/client/src/utils/push.js): файл с функцией, которая переводит занчение VAPID-ключа из base64 в формат, понятный браузеру
- [practics_13-18/client/index.html](practics_13-18/client/index.html): основной файл для инициализации страницы
- [practics_13-18/client/manifest.json](practics_13-18/client/manifest.json): файл, который содержит метаданные, конфигурацию и инструкции для браузеров о том, как обрабатывать веб-расширения и программные модули

## Важные аспекты

> [!WARNING]
> Некоторые функции могут быть не оптимизированы<br>
> Не сразу может прогружаться сайт. Для загрузки нажмите Ctrl + R