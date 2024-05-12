package org.tailor.api.tailorback.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.tailor.api.tailorback.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
    void deleteById(Long id);
}
