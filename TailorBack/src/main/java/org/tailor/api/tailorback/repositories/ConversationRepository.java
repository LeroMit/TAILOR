package org.tailor.api.tailorback.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.tailor.api.tailorback.models.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
}
