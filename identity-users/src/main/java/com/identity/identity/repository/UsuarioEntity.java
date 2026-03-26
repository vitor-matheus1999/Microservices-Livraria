package com.identity.identity.repository;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "keycloak_id", unique = true)
    private String keycloakId;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(name = "telefone", length = 15)
    private String telefone;

      @Column(name = "ativo", nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @Embedded
    private Endereco endereco;

}
