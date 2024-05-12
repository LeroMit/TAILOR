package org.tailor.api.tailorback.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tailor.api.tailorback.models.Comment;
import org.tailor.api.tailorback.models.Flick;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.repositories.CommentsRepository;
import org.tailor.api.tailorback.repositories.FlicksRepository;
import org.tailor.api.tailorback.repositories.UserRepository;
import org.tailor.api.tailorback.requests.CommentRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {
    private final CommentsRepository commentsRepository;

    private final FlicksRepository flicksRepository;

    private final UserRepository userRepository;

    public Optional<List<Comment>> getCommentsByFlick(long flickId) {
        log.debug("Getting comments for flick with id " + flickId);
        Flick flick = flicksRepository.findById(flickId).orElse(null);
        if(flick == null) {
            log.info("Flick not found in getCommentsByFlick");
            return Optional.empty();
        }
        List<Comment> comments = flick.getComments();
        return Optional.ofNullable(comments);
    }

    public Optional<Comment> getComment(Long id) {
        log.debug("Getting comment with id " + id);
        Optional<Comment> comment = commentsRepository.findById(id);
        if(comment.isEmpty()) {
            log.info("Comment not found in getComment");
            return Optional.empty();
        }
        return comment;
    }

    public Optional<Comment> createComment(CommentRequest commentRequest) {
        log.debug("Creating comment");
        User postedBy = userRepository.findById(commentRequest.getPosterId()).orElse(null);
        if (postedBy == null) {
            log.info("User not found in createComment");
            return Optional.empty();
        }
        List<User> mentions = new ArrayList<>();
        for (Long mentionId : commentRequest.getMentions()) {
            Optional<User> mention = userRepository.findById(mentionId);
            mention.ifPresent(mentions::add);
        }
        Comment comment = Comment.builder()
                .message(commentRequest.getMessage())
                .mentions(mentions)
                .postedBy(postedBy)
                .build();
        Comment created_comment = commentsRepository.save(comment);
        log.info("Comment created");
        return Optional.of(created_comment);
    }

    public Comment getCommentFromReply(Long replyId) {
        // TODO
        return null;
    }
}
