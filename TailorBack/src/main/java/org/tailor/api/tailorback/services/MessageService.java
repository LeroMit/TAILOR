package org.tailor.api.tailorback.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tailor.api.tailorback.models.Message;
import org.tailor.api.tailorback.repositories.MessageRepository;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    /**
     * Get all messages
     * @return {@link List}<{@link Message}>
     */
    public List<Message> getAllMessages() {
        log.debug("Getting all messages");
        List<Message> listMessages = messageRepository.findAll();
        if (listMessages.isEmpty()) {
            log.info("No messages found");
        }
        return listMessages;
    }

    /**
     * Get a message by its id
     * @param id
     * @return {@link Optional}<{@link Message}>
     */
    public Optional<Message> getMessageById(Long id) {
        log.debug("Getting message with id " + id);
        Optional<Message> message = messageRepository.findById(id);
        if (message.isEmpty()) {
            log.info("Message with id " + id + " not found");
        }
        return message;
    }

    /**
     * Create a message
     * @param message
     * @return {@link Message}
     */
    public Message createMessage(Message message) {
        log.debug("Creating message");
        Message createdMessage = messageRepository.save(message);
        log.debug("Message " + createdMessage.getId() + " created");
        return createdMessage;
    }

    /**
     * Update a message
     * @param message
     * @return {@link Message}
     */
    public Message updateMessage(Message message) {
        log.debug("Updating message with id " + message.getId());
        Message updatedMessage = messageRepository.save(message);
        log.debug("Message " + updatedMessage.getId() + " updated");
        return updatedMessage;
    }

    /**
     * Delete a message
     * @param message
     */
    public void deleteMessage(Message message) {
        Long id = message.getId();
        log.debug("Deleting message with id " + id);
        messageRepository.deleteById(id);
        log.debug("Message with id " + id + " deleted");
    }
}
