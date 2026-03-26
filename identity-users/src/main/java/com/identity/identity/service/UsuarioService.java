package com.identity.identity.service;

import com.identity.identity.repository.UsuarioEntity;
import com.identity.identity.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Transactional
    public UsuarioEntity criarUsuario(UsuarioEntity usuario) {
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public List<UsuarioEntity> listarTodos() {
        return usuarioRepository.findAll();
    }
}
