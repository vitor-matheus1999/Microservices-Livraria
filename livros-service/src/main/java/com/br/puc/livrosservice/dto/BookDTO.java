package com.br.puc.livrosservice.dto;

import java.util.Set;

public record BookDTO(String title,
                      long author,
                      String isbn,
                      Set<Long> genres,
                      int pages) {
}
