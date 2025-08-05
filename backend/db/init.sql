CREATE TABLE
IF NOT EXISTS product
(
    id SERIAL PRIMARY KEY,
    article VARCHAR
(255) UNIQUE NOT NULL,
    name VARCHAR
(255) NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    "createdAt" TIMESTAMP
WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE product
RESTART IDENTITY;

INSERT INTO product
    (article, name, price, quantity)
VALUES
    ('P001', 'Ноутбук Lenovo IdeaPad', 54990, 12),
    ('P002', 'Смартфон Samsung Galaxy S21', 79990, 25),
    ('P003', 'Наушники Sony WH-1000XM4', 24990, 18),
    ('P004', 'Клавиатура Logitech MX Keys', 8990, 30),
    ('P005', 'Мышь Razer DeathAdder', 4990, 42),
    ('P006', 'Монитор Dell 27" 4K', 45990, 8),
    ('P007', 'Фотоаппарат Canon EOS R6', 189990, 5),
    ('P008', 'Телевизор LG OLED 55"', 99990, 7),
    ('P009', 'Планшет Apple iPad Air', 59990, 15),
    ('P010', 'Умные часы Apple Watch Series 7', 39990, 22),
    ('P011', 'SSD Samsung 1TB', 8990, 35),
    ('P012', 'Внешний жесткий диск Seagate 2TB', 5990, 28),
    ('P013', 'Роутер ASUS RT-AX86U', 15990, 14),
    ('P014', 'Игровая консоль PlayStation 5', 69990, 3),
    ('P015', 'Видеокарта NVIDIA RTX 3080', 99990, 2),
    ('P016', 'Процессор Intel Core i9-12900K', 45990, 6),
    ('P017', 'Материнская плата ASUS ROG Strix', 25990, 9),
    ('P018', 'Оперативная память Corsair 32GB', 12990, 20),
    ('P019', 'Блок питания Cooler Master 850W', 11990, 12),
    ('P020', 'Корпус NZXT H510', 8990, 15),
    ('P021', 'Кулер для процессора Noctua NH-D15', 7990, 18),
    ('P022', 'Микрофон Blue Yeti', 12990, 10),
    ('P023', 'Веб-камера Logitech C920', 7990, 25),
    ('P024', 'Графический планшет Wacom Intuos', 14990, 8),
    ('P025', 'Принтер HP LaserJet', 19990, 7),
    ('P026', '3D-принтер Creality Ender 3', 29990, 4),
    ('P027', 'Дрон DJI Mavic Air 2', 89990, 5),
    ('P028', 'Электронная книга PocketBook', 9990, 30),
    ('P029', 'Портативная колонка JBL Charge 5', 12990, 20),
    ('P030', 'Наушники Apple AirPods Pro', 19990, 35),
    ('P031', 'Игровая мышь Logitech G Pro', 8990, 15),
    ('P032', 'Игровая клавиатура Razer BlackWidow', 12990, 12),
    ('P033', 'Игровой коврик SteelSeries QcK', 1990, 40),
    ('P034', 'Геймпад Xbox Wireless Controller', 4990, 25),
    ('P035', 'Рюкзак для ноутбука Targus', 3990, 30),
    ('P036', 'USB флешка SanDisk 128GB', 1990, 50),
    ('P037', 'Карта памяти Samsung 256GB', 2990, 45),
    ('P038', 'Кабель HDMI 2.1', 990, 60),
    ('P039', 'Док-станция для ноутбука', 7990, 18),
    ('P040', 'ИБП APC Back-UPS', 15990, 10),
    ('P041', 'Сетевой фильтр Defender', 1990, 35),
    ('P042', 'МФУ Epson EcoTank', 29990, 8),
    ('P043', 'Сканер Canon LiDE 400', 6990, 12),
    ('P044', 'Беспроводная зарядка Samsung', 2990, 40),
    ('P045', 'Адаптер USB-C to HDMI', 1490, 55),
    ('P046', 'Внешний SSD Samsung T7 1TB', 12990, 15);