INSERT INTO houses
(name, price, firevalue, value, resting, type, size, 
 rooms, livingrooms, bedrooms, bathrooms, year, img, about)
VALUES
('Dúfnahólar 10', 35000000, 33000000, 33000000, 0,'einbýli', 68,
  3, 1, 1, 1, 1960, 'placeholder.jpg', 'Komið er inn í flísalagða 
  forstofu með fataskáp, innaf forstofu er gestasnyrting. Frá forstofu er 
  gengið inn í parketlagt hol sem tengir saman stofu, eldhús og herbergjagang. 
  Eldhús er með innréttingu með góðu skápaplássi, tengi fyrir uppþvottavél. 
  Stofa er rúmgóð með nýlegu parketi á gólfi. Frá stofu er gengið út í mjög 
  skjólgóðan garð, pallur er í hluta garðsins.. Þrjú svefnherbergi eru í húsinu, 
  fataskápar eru í svefnherberginum. Baðherbergi er rúmgott, flísar á gólfi og 
  hluta veggja, baðkar með sturtuaðstöðu, innrétting er með góðu skápaplássi. 
  Þvotthús er við hlið eldhús með geymslu innaf. Bílskúr er með heitu og 
  köldu vatni, búið er að setja klósett, gluggi er enda skúrs.');  

INSERT INTO users
(username, password, name, email, admin)
VALUES
('admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', 
 'Admin', 'admin@example.org', true);

INSERT INTO users
(username, password, name, email, admin)
VALUES
('nn', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', 
 'Nafnlaus', 'nn@example.org', false);