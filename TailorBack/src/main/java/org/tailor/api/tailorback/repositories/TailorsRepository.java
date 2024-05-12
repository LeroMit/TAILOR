package org.tailor.api.tailorback.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.tailor.api.tailorback.models.Tailor;
import org.tailor.api.tailorback.models.User;

import java.util.List;

public interface TailorsRepository extends JpaRepository<Tailor, Long> {
    List<Tailor> findByCreatedBy(User user);
}
