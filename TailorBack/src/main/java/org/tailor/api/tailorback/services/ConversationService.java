package org.tailor.api.tailorback.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tailor.api.tailorback.dtos.conversation.ConversationDTO;
import org.tailor.api.tailorback.dtos.conversation.LastConversationMessageDTO;
import org.tailor.api.tailorback.exceptions.InternalServerErrorException;
import org.tailor.api.tailorback.models.Conversation;
import org.tailor.api.tailorback.models.Message;
import org.tailor.api.tailorback.models.SubscriptionConversation;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.repositories.ConversationRepository;
import org.tailor.api.tailorback.repositories.MessageRepository;

import lombok.extern.slf4j.Slf4j;
import org.tailor.api.tailorback.repositories.SubscriptionConversationRepository;
import org.tailor.api.tailorback.requests.MessageRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ConversationService {
    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private DTOMappingService dtoMappingService;

    @Autowired
    private SubscriptionConversationRepository subscriptionConversationRepository;

    /**
     * Get all conversations
     * @return {@link List}<{@link Conversation}>
     */
    public List<Conversation> getAllConversations() {
        log.debug("Getting all conversations");
        List<Conversation> listConversations = conversationRepository.findAll();
        if (listConversations.isEmpty()) {
            log.info("No conversations found");
        }
        return listConversations;
    }

    /**
     * Get a conversation by its id
     * @param id
     * @return {@link Optional}<{@link Conversation}>
     */
    public Optional<Conversation> getConversationById(Long id) {
        log.debug("Getting conversation with id " + id);
        Optional<Conversation> conversation = conversationRepository.findById(id);
        if (conversation.isEmpty()) {
            log.info("Conversation with id " + id + " not found");
        }
        return conversation;
    }

    /**
     * Create a conversation
     * @param conversation
     * @return {@link Conversation}
     */
    public Conversation createConversation(Conversation conversation) {
        log.debug("Creating conversation");
        Conversation createdConversation = conversationRepository.save(conversation);
        log.debug("Conversation " + createdConversation.getId() + " created");
        return createdConversation;
    }

    /**
     * Update a conversation
     * @param conversation
     * @return {@link Conversation}
     */
    public Conversation updateConversation(Conversation conversation) {
        log.debug("Updating conversation with id " + conversation.getId());
        Conversation updatedConversation = conversationRepository.save(conversation);
        log.debug("Conversation " + updatedConversation.getId() + " updated");
        return updatedConversation;
    }

    /**
     * Delete a conversation
     * @param conversation
     */
    public void deleteConversation(Conversation conversation) {
        Long id = conversation.getId();
        log.debug("Deleting conversation with id " + id);
        conversationRepository.deleteById(id);
        log.debug("Conversation with id " + id + " deleted");
    }

    /**
     * Get the last messages of conversations of a user
     * @param user
     * @return {@link List}<{@link LastConversationMessageDTO}>
     * @throws InternalServerErrorException
     */
    public List<LastConversationMessageDTO> getLastConversationsMessagesOfUser(User user)
            throws InternalServerErrorException {
        log.debug("Getting last messages of conversations of user " + user.getId());
        List<LastConversationMessageDTO> lastConversationsMessages = new ArrayList<>();
        for (SubscriptionConversation subscriptionConversation : user.getSubscriptionsConversations()) {
            Conversation conversation = subscriptionConversation.getSubscribedConversation();
            Optional<Message> lastMessage = messageRepository.findFirstByConversationOrderByCreatedOnDesc(conversation);
            if (lastMessage.isPresent()) {
                LastConversationMessageDTO conversationMessageDTO = dtoMappingService.toLastConversationDTO(subscriptionConversation, lastMessage.get(), user);
                lastConversationsMessages.add(conversationMessageDTO);
            } else {
                throw new InternalServerErrorException("No message found for conversation " + conversation.getId());
            }
        }
        return lastConversationsMessages;
    }

    /**
     * Create a conversation with a list of users and a first message
     * @param users
     * @param firstMessage
     * @return {@link Conversation}
     */
    public Conversation createConversation(List<User> users, Message firstMessage) {
        log.debug("Creating conversation with " + users.size() + " users");
        // Create and save conversation
        String title = users.stream()
                .map(User::getUsername)
                .collect(Collectors.joining(", "));
        String photoUrl = users.stream()
                .map(User::getPhotoUrl)
                .findFirst()
                .orElse(null);
        Conversation conversation = new Conversation();
        List<Message> messages = new ArrayList<>();
        messages.add(firstMessage);
        conversation.setMessages(messages);
        conversation.setPhotoUrl(photoUrl);
        conversation.setTitle(title);
        conversation = conversationRepository.save(conversation);

        firstMessage.setConversation(conversation);
        firstMessage = messageRepository.save(firstMessage);

        // Create and save subscriptions
        List<SubscriptionConversation> subscriptions = new ArrayList<>();
        for (User user : users) {
            SubscriptionConversation subscription = new SubscriptionConversation();
            subscription.setSubscribedConversation(conversation);
            subscription.setUser(user);
            if (user.getId().equals(firstMessage.getWrittenBy().getId())) {
                log.debug("User " + user.getId() + " is the sender of the first message");
                subscription.setTimeLastOpened(firstMessage.getCreatedOn());
            }
            subscription = subscriptionConversationRepository.save(subscription);
            //List<SubscriptionConversation> userSubscriptions = user.getSubscriptionsConversations();
            //userSubscriptions.add(subscription);
            //user.setSubscriptionsConversations(userSubscriptions);
            subscriptions.add(subscription);
        }
        log.debug("Subscriptions created");

        conversation.setSubscriptions(subscriptions);
        log.debug("Conversation subs " + conversation.getId() + " created");

        //conversation = conversationRepository.save(conversation);
        log.debug("Conversation final " + conversation.getId() + " created");
        return conversation;
    }

    /**
     * Check if a conversation already exists with the given users
     * @param users
     * @return {@link Optional}<{@link Conversation}>
     */
    private Optional<Conversation> conversationExists(List<User> users) {
        return Optional.empty();
    }

    /**
     * Add a message to a conversation
     * @param conversation
     * @param message
     * @return {@link Message}
     */
    public Message addMessageToConversation(Conversation conversation, MessageRequest message, User writtenBy) {
        log.debug("Adding message to conversation " + conversation.getId());
        Message newMessage = Message.builder()
                .content(message.getContent())
                .writtenBy(writtenBy)
                .conversation(conversation)
                .build();
        newMessage = messageRepository.save(newMessage);
        // TODO : notify with websockets
        return newMessage;
    }

    /**
     * List conversations to list conversation DTO
     * @param conversations
     * @return {@link List}<{@link ConversationDTO}>
     */
    public List<ConversationDTO> listConversationToListConversationDTO(List<Conversation> conversations) {
        return conversations.stream().map(conversation -> dtoMappingService.toConversationDTO(conversation)).collect(Collectors.toList());
    }

    /**
     * Get a conversation by its users
     * @param users
     * @return {@link Optional}<{@link Conversation}>
     */
    public Optional<Conversation> getConversationByUsers(List<User> users) {
        log.debug("Getting conversation by users");
        Conversation foundConversation = null;
        for (Conversation conversation : conversationRepository.findAll()) {
            if (conversation.getSubscriptions().size() == users.size()) {
                List<User> conversationUsers = conversation.getSubscriptions().stream().map(SubscriptionConversation::getUser).collect(Collectors.toList());
                if (conversationUsers.containsAll(users)) {
                    foundConversation = conversation;
                    break;
                }
            }
        }
        return Optional.ofNullable(foundConversation);
    }

    /**
     * Check if a user can send a message to a conversation
     * @param user
     * @param conversation
     * @return {@link Boolean}
     */
    public boolean canUserSendMessageToConversation(User user, Conversation conversation) {
        log.debug("Checking if user " + user.getId() + " can send message to conversation " + conversation.getId());
        return user.getSubscriptionsConversations().stream().anyMatch(subscription -> subscription.getSubscribedConversation().getId().equals(conversation.getId()));
    }
}
