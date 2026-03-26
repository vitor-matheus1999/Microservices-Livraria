package com.br.puc.livrosservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class LivrosServiceApplication {

	static void main(String[] args) {
		SpringApplication.run(LivrosServiceApplication.class, args);
	}

}
