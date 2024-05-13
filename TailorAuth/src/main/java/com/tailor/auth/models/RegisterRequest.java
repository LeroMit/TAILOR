package com.tailor.auth.models;

import com.tailor.auth.user.Role;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

  private Long id;
  @Column(unique = true, nullable = false, length = 40)
  private String email;
  @Column(unique = true, nullable = false, length = 20)
  private String username;
  private String password;
  private Role role;
}
