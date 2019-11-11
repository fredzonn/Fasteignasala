INSERT INTO employees
(name, img, phone, email)
VALUES
('Mörgæs Mörgæsarson', '../../penguin.jpg', '5555555', 'morgæs@eafasteignir.is');

INSERT INTO employees
(name, img, phone, email)
VALUES
('Gullfiskur Gullfiskason', '../../goldfish.jpg', '5555556', 'gullfiskur@eafasteignir.is');

INSERT INTO houses
(name, employees_id, price, firevalue, value, resting, type, size, 
 rooms, livingrooms, bedrooms, bathrooms, year, img, about)
VALUES
('Dúfnahólar 10', 1, 35000000, 33000000, 33000000, 0,'Einbýli', 68,
  3, 1, 1, 1, 1960, '../../dufnaholar10.jpg', 'Komið er inn í flísalagða 
  forstofu með fataskáp, innaf forstofu er gestasnyrting. Frá forstofu er 
  gengið inn í parketlagt hol sem tengir saman stofu, eldhús og herbergjagang. 
  Eldhús er með innréttingu með góðu skápaplássi, tengi fyrir uppþvottavél. 
  Stofa er rúmgóð með nýlegu parketi á gólfi. Frá stofu er gengið út í mjög 
  skjólgóðan garð, pallur er í hluta garðsins.. Þrjú svefnherbergi eru í húsinu, 
  fataskápar eru í svefnherberginum. Baðherbergi er rúmgott, flísar á gólfi og 
  hluta veggja, baðkar með sturtuaðstöðu, innrétting er með góðu skápaplássi. 
  Þvotthús er við hlið eldhús með geymslu innaf. Bílskúr er með heitu og 
  köldu vatni, búið er að setja klósett, gluggi er enda skúrs.');  

  INSERT INTO houses
(name, employees_id, price, firevalue, value, resting, type, size, 
 rooms, livingrooms, bedrooms, bathrooms, year, img, about)
VALUES
('Dofraborgir 12', 1, 40000000, 35000000, 35000000, 0,'Einbýli', 111,
  5, 1, 3, 1, 1999, '../../dofraborgir12.jpg', 'Lorem ipsum dolor sit amet, consectetur 
  adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna 
  aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
  in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit 
  anim id est laborum..');

  INSERT INTO houses
(name, employees_id, price, firevalue, value, resting, type, size, 
 rooms, livingrooms, bedrooms, bathrooms, year, img, about)
VALUES
('Arnarhólar 3', 1, 29000000, 28000000, 28000000, 0,'Fjölbýli', 91,
  4, 2, 1, 1, 1951, '../../arnarholar3.jpg', 'Lorem ipsum dolor sit amet, consectetur 
  adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna 
  aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
  in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit 
  anim id est laborum..');  

  INSERT INTO houses
(name, employees_id, price, firevalue, value, resting, type, size, 
 rooms, livingrooms, bedrooms, bathrooms, year, img, about)
VALUES
('Hvassaleiti 30', 1, 29000000, 29000000, 27000000, 5000000,'Fjölbýli', 98,
  4, 2, 1, 1, 1971, '../../hvassaleiti30.jpg', 'Lorem ipsum dolor sit amet, consectetur 
  adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna 
  aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
  in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit 
  anim id est laborum..');  

  INSERT INTO houses
(name, employees_id, price, firevalue, value, resting, type, size, 
 rooms, livingrooms, bedrooms, bathrooms, year, img, about)
VALUES
('Flétturimi 35', 2, 60000000, 58000000, 55000000, 0,'Fjölbýli', 113,
  4, 1, 1, 2, 1998, '../../fletturimi35.jpg', 'Lorem ipsum alex býr hersum dolor sit amet, 
  adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna 
  aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
  in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit 
  anim id est laborum..');  

  INSERT INTO houses
(name, employees_id, price, firevalue, value, resting, type, size, 
 rooms, livingrooms, bedrooms, bathrooms, year, img, about)
VALUES
('Dofraborgir 23', 2, 40000000, 35000000, 35000000, 0,'Einbýli', 111,
  3, 1, 1, 1, 1999, '../../dofraborgir23.jpg', 'Lorem ipsum dolor sit amet, consectetur 
  adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna 
  aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
  in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit 
  anim id est laborum..');  

INSERT INTO users
(username, password, name, email, admin)
VALUES
('admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', 
 'Admin', 'admin@example.org', true);
