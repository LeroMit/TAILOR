package org.tailor.api.tailorback.requests;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.tailor.api.tailorback.requests.UserRequest;

public class PasswordConfirmationValidator implements ConstraintValidator<PasswordConfirmation, UserRequest> {
    @Override
    public boolean isValid(UserRequest userRequest, ConstraintValidatorContext context) {
        String password = userRequest.getPassword();
        String passwordConf = userRequest.getPasswordConf();
        return password != null && password.equals(passwordConf);
    }
}