package org.tailor.api.tailorback.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.tailor.api.tailorback.dtos.*;
import org.tailor.api.tailorback.dtos.flick.FlickShareDTO;
import org.tailor.api.tailorback.dtos.flick.FlickSummaryDTO;
import org.tailor.api.tailorback.dtos.TailorDTO;
import org.tailor.api.tailorback.dtos.conversation.LastConversationMessageDTO;
import org.tailor.api.tailorback.dtos.tag.TagDTO;
import org.tailor.api.tailorback.dtos.tag.TagsSummaryDTO;
import org.tailor.api.tailorback.dtos.user.UserDTO;
import org.tailor.api.tailorback.dtos.user.UserSummaryDTO;
import org.tailor.api.tailorback.dtos.conversation.ConversationDTO;
import org.tailor.api.tailorback.dtos.message.MessageDTO;
import org.tailor.api.tailorback.models.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DTOMappingService {
    public UserSummaryDTO toUserSummaryDTO(User user) {
        UserSummaryDTO dto = new UserSummaryDTO();
        dto.setId(user.getId());
        dto.setBio(user.getBio());
        dto.setPhotoUrl(user.getPhotoUrl());
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        return dto;
    }

    public UserDTO toUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setBio(user.getBio());
        dto.setPhotoUrl(user.getPhotoUrl());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setUsername(user.getUsername());
        // dto.setUserAuth(user.getUserAuth());
        if (user.getTailors() != null) {
            List<TailorDTO> tailors = user.getTailors().stream()
                    .map(this::toTailorDTO)
                    .collect(Collectors.toList());
            dto.setTailors(tailors);
        }
        if (user.getFlicks() != null) {
            List<FlickSummaryDTO> flicks = user.getFlicks().stream()
                    .map(this::toFlickSummaryDTO)
                    .collect(Collectors.toList());
            dto.setFlicks(flicks);
        }
        if (user.getDefaultTags() != null) {
            List<TagDTO> tags = user.getDefaultTags().stream()
                    .map(this::toTagDTO)
                    .collect(Collectors.toList());
            dto.setDefaultTags(tags);
        }
        dto.setSelectedTailorId(user.getSelectedTailorId());
        dto.setCreatedOn(user.getCreatedOn());
        dto.setUpdatedOn(user.getUpdatedOn());
        return dto;
    }

    public List<UserDTO> listUserToListUserDTO(List<User> users) {
        return users.stream().map(this::toUserDTO).collect(Collectors.toList());
    }

    public TailorDTO toTailorDTO(Tailor tailor) {
        TailorDTO dto = new TailorDTO();
        dto.setId(tailor.getId());
        dto.setTitle(tailor.getTitle());
        dto.setIsLocked(tailor.getIsLocked());
        dto.setIsPublic(tailor.getIsPublic());
        dto.setIsFavourite(tailor.getIsFavourite());
        if (tailor.getCreatedBy() != null) {
            dto.setCreatedBy(toUserSummaryDTO(tailor.getCreatedBy()));
        }
        dto.setCreatedOn(tailor.getCreatedOn());
        dto.setUpdatedOn(tailor.getUpdatedOn());
        return dto;
    }

    public LastConversationMessageDTO toLastConversationDTO(SubscriptionConversation subscription, Message lastMessage, User user)
    {
        Conversation conversation = subscription.getSubscribedConversation();
        boolean isSentByUser = lastMessage.getWrittenBy().getId().equals(user.getId());
        boolean isRead = isSentByUser || lastMessage.getCreatedOn().isBefore(subscription.getTimeLastOpened());
        User lastSender = lastMessage.getWrittenBy();

        LastConversationMessageDTO dto = new LastConversationMessageDTO();
        dto.setConversationId(conversation.getId());
        dto.setProfilePictureUrl(lastSender.getPhotoUrl());
        dto.setName(conversation.getTitle());
        dto.setContent(lastMessage.getContent());
        dto.setIsRead(isRead);
        dto.setIsSentByUser(isSentByUser);
        dto.setCreatedOn(lastMessage.getCreatedOn());
        dto.setUpdatedOn(lastMessage.getUpdatedOn());
        return dto;
    }

    public ConversationDTO toConversationDTO(Conversation conversation) {
        ConversationDTO dto = new ConversationDTO();
        List<Message> messages = conversation.getMessages();
        dto.setId(conversation.getId());
        dto.setTitle(conversation.getTitle());
        dto.setPhotoUrl(conversation.getPhotoUrl());
        dto.setMessages(messages.stream()
                .map(message -> {
                    MessageDTO messageDTO = toMessageDTO(message);

                    return messageDTO;
                })
                .collect(Collectors.toList()));
        dto.setCreatedOn(conversation.getCreatedOn());
        dto.setUpdatedOn(conversation.getUpdatedOn());
        return dto;
    }

    public MessageDTO toMessageDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setContent(message.getContent());
        dto.setUpdatedOn(message.getUpdatedOn());
        dto.setCreatedOn(message.getCreatedOn());
        dto.setWrittenBy(toUserSummaryDTO(message.getWrittenBy()));
        return dto;
    }

    public TagDTO toTagDTO(Tag tag) {
        TagDTO dto = new TagDTO();
        dto.setId(tag.getId());
        dto.setLabel(tag.getLabel());
        dto.setCreatedOn(tag.getCreatedOn());
        dto.setUpdatedOn(tag.getUpdatedOn());
        return dto;
    }

    public TagsSummaryDTO toTagSummaryDTO(List<Tag> tag) {
        TagsSummaryDTO dto = new TagsSummaryDTO();
        HashMap<Long, String> tags = new HashMap<>();
        for (Tag t : tag) {
            tags.put(t.getId(), t.getLabel());
        }
        dto.setTags(tags);
        return dto;
    }

    public FlickDTO toFlickDTO(Flick flick) {
        FlickDTO dto = new FlickDTO();
        dto.setId(flick.getId());
        dto.setTitle(flick.getTitle());
        dto.setDescription(flick.getDescription());
        dto.setUrl(flick.getUrl());
        if (flick.getTags() != null) {
            List<TagDTO> tags = flick.getTags().stream()
                    .map(this::toTagDTO)
                    .collect(Collectors.toList());
            dto.setTags(tags);
        }
        if (flick.getComments() != null) {
            List<CommentDTO> comments = flick.getComments().stream()
                    .map(this::toCommentDTO)
                    .collect(Collectors.toList());
            dto.setComments(comments);
        }
        dto.setPostedBy(toUserSummaryDTO(flick.getPostedBy()));
        dto.setCreatedOn(flick.getCreatedOn());
        dto.setUpdatedOn(flick.getUpdatedOn());
        return dto;
    }

    public FlickSummaryDTO toFlickSummaryDTO(Flick flick) {
        FlickSummaryDTO dto = new FlickSummaryDTO();
        dto.setId(flick.getId());
        dto.setTitle(flick.getTitle());
        dto.setDescription(flick.getDescription());
        dto.setUrl(flick.getUrl());
        dto.setPostedBy(toUserSummaryDTO(flick.getPostedBy()));
        dto.setCreatedOn(flick.getCreatedOn());
        dto.setUpdatedOn(flick.getUpdatedOn());
        return dto;
    }

    public CommentDTO toCommentDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setMessage(comment.getMessage());
        if (comment.getMentions() != null) {
            List<UserSummaryDTO> users = comment.getMentions().stream()
                    .map(this::toUserSummaryDTO)
                    .collect(Collectors.toList());
            dto.setMentions(users);
        }

        if (comment.getPostedBy() != null) {
            UserSummaryDTO user = toUserSummaryDTO(comment.getPostedBy());
            dto.setPostedBy(user);
        }
        dto.setCreatedOn(comment.getCreatedOn());
        dto.setUpdatedOn(comment.getUpdatedOn());
        return dto;
    }

    public ReplyDTO toReplyDTO(Reply reply) {
        ReplyDTO dto = new ReplyDTO();
        dto.setId(reply.getId());
        dto.setMessage(reply.getMessage());
        if (reply.getMentions() != null) {
            List<UserSummaryDTO> users = reply.getMentions().stream()
                    .map(this::toUserSummaryDTO)
                    .collect(Collectors.toList());
            dto.setMentions(users);
        }

        if (reply.getPostedBy() != null) {
            UserSummaryDTO user = toUserSummaryDTO(reply.getPostedBy());
            dto.setPostedBy(user);
        }
        dto.setCreatedOn(reply.getCreatedOn());
        dto.setUpdatedOn(reply.getUpdatedOn());
        return dto;
    }

    public FlickShareDTO toFlickShareDTO(FlickShare flickShare){
        FlickShareDTO dto = new FlickShareDTO();
        dto.setId(flickShare.getId());
        dto.setFlick(toFlickSummaryDTO(flickShare.getFlick()));
        dto.setUser(toUserSummaryDTO(flickShare.getUser()));
        dto.setTo(toUserSummaryDTO(flickShare.getTo()));
        dto.setCreatedOn(flickShare.getCreatedOn());
        dto.setUpdatedOn(flickShare.getUpdatedOn());
        return dto;
    }
}
