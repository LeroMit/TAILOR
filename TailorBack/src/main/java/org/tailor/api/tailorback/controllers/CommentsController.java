package org.tailor.api.tailorback.controllers;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tailor.api.tailorback.dtos.CommentDTO;
import org.tailor.api.tailorback.models.Comment;
import org.tailor.api.tailorback.requests.CommentRequest;
import org.tailor.api.tailorback.services.CommentService;
import org.tailor.api.tailorback.services.DTOMappingService;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
@Slf4j
public class CommentsController {
    @Autowired
    CommentService commentService;

    @Autowired
    DTOMappingService dtoMappingService;

    @GetMapping("/comments/{flickId}")
    public ResponseEntity<List<Comment>> getTailors(@PathVariable(value = "flickId") Long flickId){
        log.info("Getting comments" + flickId);
        List<Comment> comments = commentService.getCommentsByFlick(flickId).orElse(null);
        if (comments == null) {
            return ResponseEntity.badRequest().build();
        }
        if(comments.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/comments/{flickId}")
    public ResponseEntity<CommentDTO> createTailor(@PathVariable(value = "flickId") Long flickId , @Valid @RequestBody CommentRequest commentRequest) {
        log.info("Creating comment for flick with id " + flickId);
        Comment createdComment = commentService.createComment(commentRequest).orElse(null);
        if (createdComment == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(dtoMappingService.toCommentDTO(createdComment));
    }
}
