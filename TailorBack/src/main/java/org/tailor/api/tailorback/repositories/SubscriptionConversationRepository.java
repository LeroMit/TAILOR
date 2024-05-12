package org.tailor.api.tailorback.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.tailor.api.tailorback.models.Conversation;
import org.tailor.api.tailorback.models.SubscriptionConversation;

import java.util.List;

public interface SubscriptionConversationRepository extends JpaRepository<SubscriptionConversation, Long> {
    List<SubscriptionConversation> findAllBySubscribedConversation(Conversation conversation);
}
