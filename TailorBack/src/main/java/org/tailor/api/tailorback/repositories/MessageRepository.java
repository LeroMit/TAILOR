package org.tailor.api.tailorback.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.tailor.api.tailorback.models.Conversation;
import org.tailor.api.tailorback.models.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    Optional<Message> findFirstByConversationOrderByCreatedOnDesc(Conversation conversation);
    List<Message> findAllByConversation(Conversation conversation);
}
