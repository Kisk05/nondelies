drop table if exists users;
drop table if exists super;
drop table if exists favsuper;
drop table if exists store;
drop table if exists sales;
drop table if exists fes;
drop table if exists holiday;

create table users(
    user_id integer PRIMARY KEY AUTO_INCREMENT,
    user_name varchar(50) NOT NULL UNIQUE,
    user_email varchar(100) NOT NULL UNIQUE,
    hash_pass varchar(255) NOT NULL,
    create_time timestamp default current_timestamp
);

create table super(
    sup_id integer PRIMARY KEY AUTO_INCREMENT,
    sup_name varchar(50) NOT NULL UNIQUE
);

create table store(
    sto_id integer AUTO_INCREMENT,
    sup_id integer,
    sto_name varchar(50) NOT NULL UNIQUE,
    sto_postcode char(7) NOT NULL,
    sto_address varchar(255) NOT NULL,
    sto_latitude decimal(10,8),
    sto_longitude decimal(11,8),

    PRIMARY KEY (sto_id, sup_id),
    FOREIGN KEY (sup_id) REFERENCES super(sup_id) ON DELETE CASCADE    
);

create table favsuper(
    user_id integer,
    sup_id integer,

    PRIMARY KEY (user_id, sup_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (sup_id) REFERENCES super(sup_id) ON DELETE CASCADE
);

create table events(
    event_id integer PRIMARY KEY AUTO_INCREMENT,
    event_dayofweek integer,
    event_rtype varchar(20),
    event_monthday integer,
    event_yearday varchar(10),
    event_oneday date
);

create table sales(
    sal_id integer PRIMARY KEY AUTO_INCREMENT,
    sup_id integer NOT NULL,
    event_id integer NOT NULL,
    sal_kind varchar(50) NOT NULL,
    sal_discount integer,
    sal_info text,

    FOREIGN KEY (sup_id) REFERENCES super(sup_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

create table fes(
    fes_id integer PRIMARY KEY AUTO_INCREMENT,
    sup_id integer NOT NULL,
    event_id integer NOT NULL,
    fes_name varchar(50),
    fes_info text,

    FOREIGN KEY (sup_id) REFERENCES super(sup_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

create table holiday(
    hol_id integer PRIMARY KEY AUTO_INCREMENT,
    sup_id integer NOT NULL,
    event_id integer NOT NULL,
    hol_name varchar(50) NOT NULL,
    hol_info text,

    FOREIGN KEY (sup_id) REFERENCES super(sup_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);