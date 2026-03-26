package com.br.puc.livrosservice.repository;

import com.br.puc.livrosservice.model.Book;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    @Override
    @NonNull
    @EntityGraph(attributePaths = {"genres"})
    Optional<Book> findById(Long aLong);

    @Override
    @NonNull
    @EntityGraph(attributePaths = {"genres"})
    List<Book> findAll();
}
