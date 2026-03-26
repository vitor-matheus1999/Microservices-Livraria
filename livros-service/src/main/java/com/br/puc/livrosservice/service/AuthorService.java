package com.br.puc.livrosservice.service;

import com.br.puc.livrosservice.dto.AuthorDTO;
import com.br.puc.livrosservice.model.Author;
import com.br.puc.livrosservice.repository.AuthorRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthorService {

    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public Author saveAuthor(AuthorDTO author) {
        Author newAuthor = new Author(author.firstName(), author.lastName());

        return authorRepository.save(newAuthor);
    }

    public Author getAuthorById(Long id) {
        return authorRepository.findById(id)
                .orElse(null);
    }

    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

}
