CREATE TYPE online AS ENUM (
    'online',
    'offline',
    'dont_disturb',
    'afk'
);

create table "user" (
    id serial primary key,
    name varchar (40),
    pseudonym varchar(40),
    title_status varchar(40),
    online_status online DEFAULT 'offline',
    avatar varchar,
    password varchar,
    email varchar,
)
    INSERT INTO "user" (name, pseudonym, title_status, online_status) VALUES
('Alice', 'ShadowFox', 'Novice', 'online'),
('Bob', 'IronFist', 'Warrior', 'offline'),
('Charlie', 'SkyRider', 'Archer', 'dont_disturb'),
('Diana', 'NightWolf', 'Mage', 'afk'),
('Evan', 'StormChaser', 'Rogue', 'online'),
('Fiona', 'FireBlade', 'Knight', 'offline'),
('George', 'WindWalker', 'Cleric', 'online'),
('Hannah', 'SilentStep', 'Assassin', 'afk'),
('Ivan', 'StoneShield', 'Tank', 'dont_disturb'),
('Julia', 'MoonWhisper', 'Druid', 'online'),
('Kevin', 'ThunderStrike', 'Warrior', 'offline'),
('Laura', 'CrystalArrow', 'Archer', 'afk'),
('Mike', 'FlameTongue', 'Mage', 'dont_disturb'),
('Nina', 'DarkMist', 'Rogue', 'offline'),
('Oscar', 'FrostClaw', 'Knight', 'online'),
('Paula', 'StarFlame', 'Cleric', 'afk'),
('Quinn', 'IronFlame', 'Assassin', 'online'),
('Rita', 'WindSlicer', 'Tank', 'offline'),
('Sam', 'BladeWhisper', 'Druid', 'dont_disturb'),
('Tina', 'ShadowHeart', 'Warrior', 'online');
