package com.br.puc.livrosservice.repository;

import com.br.puc.livrosservice.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author, Long> {
}
