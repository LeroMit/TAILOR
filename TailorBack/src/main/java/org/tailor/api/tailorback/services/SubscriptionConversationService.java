package org.tailor.api.tailorback.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tailor.api.tailorback.models.SubscriptionConversation;
import org.tailor.api.tailorback.repositories.SubscriptionConversationRepository;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class SubscriptionConversationService {
    @Autowired
    private SubscriptionConversationRepository subscriptionConversationRepository;

    /**
     * Get all subscription conversations
     * @return {@link List}<{@link SubscriptionConversation}>
     */
    public List<SubscriptionConversation> getAllSubscriptionConversations() {
        log.debug("Getting all subscription conversations");
        List<SubscriptionConversation> listSubscriptionsConversations = subscriptionConversationRepository.findAll();
        if (listSubscriptionsConversations.isEmpty()) {
            log.info("No subscription conversations found");
        }
        return listSubscriptionsConversations;
    }

    /**
     * Get a subscription conversation by its id
     * @param id
     * @return {@link Optional}<{@link SubscriptionConversation}>
     */
    public Optional<SubscriptionConversation> getSubscriptionConversationById(Long id) {
        log.debug("Getting subscription conversation with id " + id);
        Optional<SubscriptionConversation> subscriptionConversation = subscriptionConversationRepository.findById(id);
        if (subscriptionConversation.isEmpty()) {
            log.info("Subscription conversation with id " + id + " not found");
        }
        return subscriptionConversation;
    }

    /**
     * Create a subscription conversation
     * @param subscriptionConversation
     * @return {@link SubscriptionConversation}
     */
    public SubscriptionConversation createSubscriptionConversation(SubscriptionConversation subscriptionConversation) {
        log.debug("Creating subscription conversation");
        SubscriptionConversation createdSubscriptionConversation = subscriptionConversationRepository
                .save(subscriptionConversation);
        log.debug("Subscription conversation " + createdSubscriptionConversation.getId() + " created");
        return createdSubscriptionConversation;
    }

    /**
     * Update a subscription conversation
     * @param subscriptionConversation
     * @return {@link SubscriptionConversation}
     */
    public SubscriptionConversation updateSubscriptionConversation(SubscriptionConversation subscriptionConversation) {
        log.debug("Updating subscription conversation with id " + subscriptionConversation.getId());
        SubscriptionConversation updatedSubscriptionConversation = subscriptionConversationRepository
                .save(subscriptionConversation);
        log.debug("Subscription conversation " + updatedSubscriptionConversation.getId() + " updated");
        return updatedSubscriptionConversation;
    }

    /**
     * Delete a subscription conversation
     * @param subscriptionConversation
     */
    public void deleteSubscriptionConversation(SubscriptionConversation subscriptionConversation) {
        Long id = subscriptionConversation.getId();
        log.debug("Deleting subscription conversation with id " + id);
        subscriptionConversationRepository.deleteById(id);
        log.debug("Subscription conversation with id " + id + " deleted");
    }
}
