package org.tailor.api.tailorback.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.tailor.api.tailorback.models.Tag;
import java.util.Optional;

public interface TagsRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByLabel(String label);
}
