package org.tailor.api.tailorback.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.tailor.api.tailorback.models.Reply;

public interface RepliesRepository extends JpaRepository<Reply, Long> {
}
