package com.br.puc.livrosservice.repository;

import com.br.puc.livrosservice.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre, Long> {
}
