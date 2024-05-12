package org.tailor.api.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.tailor.api.tailorback.controllers.CommentsController;
import org.tailor.api.tailorback.dtos.CommentDTO;
import org.tailor.api.tailorback.models.Comment;
import org.tailor.api.tailorback.repositories.CommentsRepository;
import org.tailor.api.tailorback.repositories.FlicksRepository;
import org.tailor.api.tailorback.requests.CommentRequest;
import org.tailor.api.tailorback.services.CommentService;
import org.tailor.api.tailorback.services.DTOMappingService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentsControllerTest {

    @Mock
    private CommentsRepository commentsRepository;

    @Mock
    private FlicksRepository flicksRepository;

    @Mock
    private CommentService commentService;

    @Mock
    private DTOMappingService dtoMappingService;

    @InjectMocks
    private CommentsController commentsController;

    private List<Comment> comments;
    private CommentDTO commentDTO;
    private Comment comment;
    private CommentRequest commentRequest;

    @BeforeEach
    void setUp() {
        comments = new ArrayList<>();
        comment = new Comment();
        comments.add(comment);
        commentDTO = new CommentDTO();
        commentRequest = new CommentRequest();
    }

    @Test
    void getTailors_ValidFlickId_ReturnsComments() {
        Long flickId = 1L;
        when(commentService.getCommentsByFlick(flickId)).thenReturn(Optional.of(comments));

        ResponseEntity<List<Comment>> response = commentsController.getTailors(flickId);

        assertEquals(ResponseEntity.ok(comments), response);
        verify(commentService, times(1)).getCommentsByFlick(flickId);
    }

    @Test
    void getTailors_InvalidFlickId_ReturnsNotFound() {
        Long flickId = 1L;
        when(commentService.getCommentsByFlick(flickId)).thenReturn(Optional.empty());

        ResponseEntity<List<Comment>> response = commentsController.getTailors(flickId);

        assertEquals(ResponseEntity.badRequest().build(), response);
        verify(commentService, times(1)).getCommentsByFlick(flickId);
    }

    @Test
    void createTailor_ValidRequest_ReturnsCreatedComment() {
        //Arrange
        Long flickId = 1L;
        when(commentService.createComment(commentRequest)).thenReturn(Optional.of(comment));
        when(dtoMappingService.toCommentDTO(comment)).thenReturn(commentDTO);

        //Act
        ResponseEntity<CommentDTO> response = commentsController.createTailor(flickId, commentRequest);

        //Assert
        assertEquals(ResponseEntity.ok(commentDTO), response);
        verify(commentService, times(1)).createComment(commentRequest);
        verify(dtoMappingService, times(1)).toCommentDTO(comment);
    }

    @Test
    void createTailor_InvalidRequest_ReturnsBadRequest() {
        Long flickId = 1L;
        when(commentService.createComment(commentRequest)).thenReturn(Optional.empty());

        ResponseEntity<CommentDTO> response = commentsController.createTailor(flickId, commentRequest);

        assertEquals(ResponseEntity.badRequest().build(), response);
        verify(commentService, times(1)).createComment(commentRequest);
        verify(dtoMappingService, never()).toCommentDTO(any(Comment.class));
    }
}