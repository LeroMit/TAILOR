package org.tailor.api.tailorback.controllers;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tailor.api.tailorback.dtos.conversation.ConversationDTO;
import org.tailor.api.tailorback.dtos.conversation.LastConversationMessageDTO;
import org.tailor.api.tailorback.dtos.message.MessageDTO;
import org.tailor.api.tailorback.exceptions.InternalServerErrorException;
import org.tailor.api.tailorback.models.Conversation;
import org.tailor.api.tailorback.models.Message;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.requests.CreateConversationRequest;
import org.tailor.api.tailorback.requests.MessageRequest;
import org.tailor.api.tailorback.services.ConversationService;
import org.tailor.api.tailorback.services.DTOMappingService;
import org.tailor.api.tailorback.services.UserService;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
@Slf4j
public class ConversationController {
    @Autowired
    ConversationService conversationService;

    @Autowired
    DTOMappingService dtoMappingService;
    @Autowired
    private UserService userService;

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getConversations() {
        log.info("Getting conversations");
        List<Conversation> conversations = conversationService.getAllConversations();
        if (conversations.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        List<ConversationDTO> conversationDTOS = conversationService.listConversationToListConversationDTO(conversations);
        return ResponseEntity.ok(conversationDTOS);
    }

    @GetMapping("/conversations/user/{userId}")
    public ResponseEntity<List<LastConversationMessageDTO>> getConversationsByUser(@PathVariable(value = "userId") Long userId) {
        User user = userService.getUser(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            return ResponseEntity.ok(conversationService.getLastConversationsMessagesOfUser(user));
        } catch (InternalServerErrorException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<ConversationDTO> getConversation(@PathVariable(value = "conversationId") Long conversationId) {
        log.info("Getting conversation id " + conversationId);
        Conversation conversation = conversationService.getConversationById(conversationId).orElse(null);
        if (conversation == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(dtoMappingService.toConversationDTO(conversation));
    }

    @PostMapping("/conversation/create")
    public ResponseEntity<ConversationDTO> createConversation(@Valid @RequestBody CreateConversationRequest conversationRequest) {
        User creator = userService.getUser(conversationRequest.getCreatorId()).orElse(null);
        List<User> users = conversationRequest.getUserIds().stream().map(userId -> userService.getUser(userId).orElse(null)).toList();

        // Vérifier si la conversation existe déjà
        Conversation existingConversation = conversationService.getConversationByUsers(users).orElse(null);
        if (existingConversation != null) {
            return ResponseEntity.ok(dtoMappingService.toConversationDTO(existingConversation));
        }
        if (creator == null || users.size() < 2 || users.contains(null) || !users.contains(creator)) {
            return ResponseEntity.badRequest().build();
        }
        Message message = Message.builder()
                .content(conversationRequest.getContent())
                .writtenBy(creator)
                .build();
        Conversation createdConversation = conversationService.createConversation(users, message);
        return ResponseEntity.ok(dtoMappingService.toConversationDTO(createdConversation));
    }

    @PostMapping("/conversation/{conversationId}/message/add")
    public ResponseEntity<MessageDTO> addMessageToConversation(@PathVariable(value = "conversationId") Long conversationId, @Valid @RequestBody MessageRequest message) {
        Conversation conversation = conversationService.getConversationById(conversationId).orElse(null);
        User user = userService.getUser(message.getWrittenById()).orElse(null);

        if (user == null || conversation == null || !conversationService.canUserSendMessageToConversation(user, conversation)){
            return ResponseEntity.badRequest().build();
        }
        Message newMessage = conversationService.addMessageToConversation(conversation, message, user);
        return ResponseEntity.ok(dtoMappingService.toMessageDTO(newMessage));
    }
}
