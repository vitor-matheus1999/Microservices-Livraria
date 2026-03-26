package com.br.puc.livrosservice.controller;

import com.br.puc.livrosservice.dto.AuthorDTO;
import com.br.puc.livrosservice.model.Author;
import com.br.puc.livrosservice.service.AuthorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/author")
public class AuthorController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthorController.class);

    private final AuthorService authorService;

    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @PostMapping
    public Author createAuthor(@RequestBody AuthorDTO authorDTO) {
        return authorService.saveAuthor(authorDTO);
    }

    @GetMapping
    public List<Author> getAllAuthors() {
        return authorService.getAllAuthors();
    }

    @GetMapping("/{id}")
    public Author findBookById(@PathVariable("id") long id) {

        LOGGER.info("Buscando o id do author com o id {}", id);

        return authorService.getAuthorById(id);
    }
}
