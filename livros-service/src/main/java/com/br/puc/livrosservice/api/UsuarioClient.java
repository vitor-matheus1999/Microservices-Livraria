package com.br.puc.livrosservice.api;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@FeignClient(name = "identity-users", url = "http://localhost:8088")
public interface UsuarioClient {

    @GetMapping("/usuarios")
    String getUsuarios();

}
