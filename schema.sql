CREATE TABLE employees (
  id serial primary key,
  name varchar(128) not null,
  img varchar(128),
  phone int not null,
  email varchar(128) not null
);

CREATE TABLE houses (
  id serial primary key,
  employees_id INT REFERENCES employees(id) ON DELETE CASCADE,
  name varchar(128) not null,
  price int not null,
  firevalue int not null,
  value int not null,
  resting int not null,
  type varchar(256) not null,
  size int not null,
  rooms int not null,
  livingrooms int not null,
  bedrooms int,
  bathrooms int,
  year int not null,
  img varchar(128),
  about text,
  sold boolean default false,
  lat float,
  long float,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone not null default current_timestamp
);

CREATE TABLE users (
  id serial primary key,
  name varchar(128) not null,
  email varchar(256) not null,
  username varchar(128) unique not null,
  password varchar(256) not null,
  security varchar(128),
  safety varchar(128),
  admin boolean default false,
  created timestamp with time zone not null default current_timestamp
);

CREATE TABLE requests (
  house_id INT REFERENCES houses(id) ON DELETE CASCADE,
  request text not null
);

CREATE TABLE checkin (
  house varchar (256) not null,
  username varchar(256) not null,
  day date,
  time time
);
