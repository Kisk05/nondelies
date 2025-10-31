drop table if exists users;
drop table if exists super;
drop table if exists favsuper;
drop table if exists store;
drop table if exists sales;
drop table if exists events;

--usersテーブル（ユーザー情報）
create table users(
    user_id integer PRIMARY KEY AUTO_INCREMENT,
    user_name varchar(50) NOT NULL UNIQUE,
    user_email varchar(100) NOT NULL UNIQUE,
    hash_pass varchar(255) NOT NULL,
    create_time timestamp default current_timestamp
);

--superテーブル（スーパー名情報）
create table super(
    sup_id integer PRIMARY KEY,
    sup_name varchar(50) NOT NULL
);

--storeテーブル（それぞれの店舗別情報）
create table store(
    sto_id integer,
    sup_id integer,
    sto_postcode char(7) NOT NULL,
    sto_address varchar(255) NOT NULL,
    sto_latitude decimal(10,8) NOT NULL,
    sto_longitude decimal(11,8) NOt NULL,

    --複合主キー
    PRIMARY KEY (sto_id, sup_id),
    --外部キー
    FOREIGN KEY (sup_id) REFERENCES super(sup_id) ON DELETE CASCADE    
);

--favsuperテーブル（お気に入りスーパーとユーザーを紐づけ）
create table favsuper(
    user_id integer,
    sup_id integer,

    --複合主キー
    PRIMARY KEY (user_id, sup_id),
    --外部キー
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (sup_id) REFERENCES super(sup_id) ON DELETE CASCADE
);

--salesテーブル（スーパーのお得日情報）
create table sales(
    sal_id integer PRIMARY KEY AUTO_INCREMENT,
    sup_id integer NOT NULL,
    sal_day varchar(3) NOT NULL,
    sal_kind varchar(50) NOT NULL,
    sal_discount integer,
    sal_info text,

    --外部キー
    FOREIGN KEY (sup_id) REFERENCES super(sup_id) ON DELETE CASCADE
);

--eventsテーブル（スーパーのイベント情報）
create table events(
    event_id integer PRIMARY KEY AUTO_INCREMENT,
    sup_id integer NOT NULL,
    event_name varchar(50) NOT NULL,
    event_start_date date NOT NULL,
    event_end_date date NOT NULL,
    event_info text,

    --外部キー
    FOREIGN KEY (sup_id) REFERENCES super(sup_id) ON DELETE CASCADE
);
