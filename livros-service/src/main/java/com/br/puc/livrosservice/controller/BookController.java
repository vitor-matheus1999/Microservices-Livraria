package com.br.puc.livrosservice.controller;

import com.br.puc.livrosservice.dto.BookDTO;
import com.br.puc.livrosservice.model.Book;
import com.br.puc.livrosservice.service.BookService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/book")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping
    public Book createBook(@RequestBody BookDTO book) {
        return bookService.saveBook(book);
    }

    @GetMapping
    public List<Book> findBooks() {
        return bookService.findBooks();
    }

    @GetMapping("/{id}")
    public Book findBookById(@PathVariable("id") long id) {
        return bookService.findBookById(id);
    }
}
