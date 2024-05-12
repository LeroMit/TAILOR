package org.tailor.api.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.tailor.api.tailorback.models.Comment;
import org.tailor.api.tailorback.models.Flick;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.repositories.CommentsRepository;
import org.tailor.api.tailorback.repositories.FlicksRepository;
import org.tailor.api.tailorback.repositories.UserRepository;
import org.tailor.api.tailorback.requests.CommentRequest;
import org.tailor.api.tailorback.services.CommentService;
import org.tailor.api.tailorback.services.DTOMappingService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentsRepository commentsRepository;

    @Mock
    private FlicksRepository flicksRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private DTOMappingService dtoMappingService;

    @InjectMocks
    private CommentService commentService;

    private Comment comment;
    private Flick flick;
    private User user;
    private User mentionedUser;
    private CommentRequest commentRequest;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).build();
        mentionedUser = User.builder().id(2L).build();
        comment = Comment.builder().id(1L).message("Test Comment").postedBy(user).mentions(Arrays.asList(mentionedUser)).build();
        flick = Flick.builder().id(1L).comments(Arrays.asList(comment)).build();
        commentRequest = CommentRequest.builder().message("Test Comment").posterId(1L).mentions(Arrays.asList(2L)).build();
    }

    @Test
    void getCommentsByFlick_shouldReturnListOfCommentsWhenFlickFound() {
        when(flicksRepository.findById(1L)).thenReturn(Optional.of(flick));

        Optional<List<Comment>> retrievedComments = commentService.getCommentsByFlick(1L);

        assertTrue(retrievedComments.isPresent());
        assertEquals(1, retrievedComments.get().size());
        assertEquals(comment.getId(), retrievedComments.get().get(0).getId());
        verify(flicksRepository, times(1)).findById(1L);
    }

    @Test
    void getCommentsByFlick_shouldReturnEmptyOptionalWhenFlickNotFound() {
        when(flicksRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<List<Comment>> retrievedComments = commentService.getCommentsByFlick(1L);

        assertFalse(retrievedComments.isPresent());
        verify(flicksRepository, times(1)).findById(1L);
    }

    @Test
    void getComment_shouldReturnCommentWhenFound() {
        when(commentsRepository.findById(1L)).thenReturn(Optional.of(comment));

        Optional<Comment> retrievedComment = commentService.getComment(1L);

        assertTrue(retrievedComment.isPresent());
        assertEquals(comment.getId(), retrievedComment.get().getId());
        verify(commentsRepository, times(1)).findById(1L);
    }

    @Test
    void getComment_shouldReturnEmptyOptionalWhenCommentNotFound() {
        when(commentsRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Comment> retrievedComment = commentService.getComment(1L);

        assertFalse(retrievedComment.isPresent());
        verify(commentsRepository, times(1)).findById(1L);
    }

    @Test
    void createComment_shouldReturnCreatedCommentWhenUserFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.findById(2L)).thenReturn(Optional.of(mentionedUser));
        when(commentsRepository.save(any(Comment.class))).thenReturn(comment);

        Optional<Comment> createdComment = commentService.createComment(commentRequest);

        assertTrue(createdComment.isPresent());
        assertEquals(comment.getId(), createdComment.get().getId());
        assertEquals(comment.getMessage(), createdComment.get().getMessage());
        assertEquals(user, createdComment.get().getPostedBy());
        assertEquals(Arrays.asList(mentionedUser), createdComment.get().getMentions());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(2L);
        verify(commentsRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void createComment_shouldReturnEmptyOptionalWhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Comment> createdComment = commentService.createComment(commentRequest);

        assertFalse(createdComment.isPresent());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, never()).findById(2L);
        verify(commentsRepository, never()).save(any(Comment.class));
    }
}