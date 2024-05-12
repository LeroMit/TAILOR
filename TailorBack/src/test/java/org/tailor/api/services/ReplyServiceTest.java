package org.tailor.api.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.tailor.api.tailorback.dtos.ReplyDTO;
import org.tailor.api.tailorback.models.Reply;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.repositories.RepliesRepository;
import org.tailor.api.tailorback.requests.ReplyRequest;
import org.tailor.api.tailorback.services.DTOMappingService;
import org.tailor.api.tailorback.services.ReplyService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReplyServiceTest {

    @Mock
    private RepliesRepository repliesRepository;

    @Mock
    private DTOMappingService dtoMappingService;

    @InjectMocks
    private ReplyService replyService;

    private Reply reply;
    private ReplyRequest replyRequest;
    private User user;
    private List<User> mentions;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).build();
        mentions = Arrays.asList(user);
        reply = Reply.builder().id(1L).message("Test Reply").postedBy(user).mentions(mentions).build();
        replyRequest = ReplyRequest.builder().message("Test Reply").build();

    }

    @Test
    void getReply_shouldReturnReplyWhenFound() {
        when(repliesRepository.findById(1L)).thenReturn(Optional.of(reply));

        Optional<Reply> retrievedReply = replyService.getReply(1L);

        assertTrue(retrievedReply.isPresent());
        assertEquals(reply.getId(), retrievedReply.get().getId());
        verify(repliesRepository, times(1)).findById(1L);
    }

    @Test
    void getReply_shouldReturnEmptyOptionalWhenReplyNotFound() {
        when(repliesRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Reply> retrievedReply = replyService.getReply(1L);

        assertFalse(retrievedReply.isPresent());
        verify(repliesRepository, times(1)).findById(1L);
    }

    @Test
    void createReply_shouldReturnCreatedReply() {
        when(repliesRepository.save(any(Reply.class))).thenReturn(reply);

        Reply createdReply = replyService.createReply(replyRequest, user, mentions);

        assertNotNull(createdReply);
        assertEquals(reply.getId(), createdReply.getId());
        assertEquals(reply.getMessage(), createdReply.getMessage());
        assertEquals(user, createdReply.getPostedBy());
        assertEquals(mentions, createdReply.getMentions());
        verify(repliesRepository, times(1)).save(any(Reply.class));
    }
}