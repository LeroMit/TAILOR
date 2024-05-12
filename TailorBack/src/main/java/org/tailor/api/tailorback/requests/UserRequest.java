package org.tailor.api.tailorback.requests;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@PasswordConfirmation
public class UserRequest {
    @NotEmpty(message = "The email is required.")
    @Email(message = "Invalid email format.")
    private String email;

    @NotEmpty(message = "The password is required.")
    @Pattern(regexp = "^(?=.*[A-Z]).{8,}$", message = "Password must have at least 8 characters and contain at least one uppercase letter.")
    private String password;

    @NotEmpty(message = "You need to confirm your password.")
    private String passwordConf;

    @NotEmpty(message = "The first name is required.")
    @Size(max = 30, message = "First name cannot exceed 30 characters.")
    private String firstName;

    @NotEmpty(message = "The last name is required.")
    @Size(max = 30, message = "Last name cannot exceed 30 characters.")
    private String lastName;

    @NotEmpty(message = "The username is required.")
    @Size(max = 20, message = "Username cannot exceed 20 characters.")
    private String username;

    @NotEmpty(message = "At least one tag is required.")
    @Size(min = 5, max = 5, message = "Exactly 5 tags are required.")
    private List<Long> defaultTagsIds;
}
