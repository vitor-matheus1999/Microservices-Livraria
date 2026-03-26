INSERT INTO genre (name)
VALUES ('ACTION'),
       ('ADVENTURE'),
       ('COMEDY'),
       ('TERROR'),
       ('PROGRAMMING'),
       ('ROMANCE');

INSERT INTO author (first_name, last_name)
VALUES ('Rick', 'Riordan'),
       ('Agatha', 'Christie'),
       ('Clarisse', 'Linspector');

INSERT INTO book (title, page_count, author_id)
VALUES ('Percy Jackson: Ladrão de Raios', 300, 1),
       ('Percy Jackson: Mar de Monstros', 350, 1),
       ('A morte no Rio Nilo', 400, 2),
       ('A Hora da Estrela', 88, 3);
;

INSERT INTO book_genres(book_id, genre_id)
VALUES (1, 1),
       (1, 2),
       (2, 1),
       (2, 2),
       (3, 1),
       (4, 4);