package org.tailor.api.tailorback.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tailor.api.tailorback.dtos.ReplyDTO;
import org.tailor.api.tailorback.models.Reply;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.repositories.RepliesRepository;
import org.tailor.api.tailorback.requests.ReplyRequest;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReplyService {
    private final RepliesRepository repliesRepository;

    @Autowired
    private DTOMappingService dtoMappingService;

    public List<ReplyDTO> listReplyToListReplyDTO(List<Reply> replies) {
        return replies.stream().map(reply -> dtoMappingService.toReplyDTO(reply)).collect(Collectors.toList());
    }

    public Optional<Reply> getReply(Long id) {
        log.debug("Getting replies with id " + id);
        Optional<Reply> reply = repliesRepository.findById(id);
        if(reply.isEmpty()) {
            log.info("Reply not found in getReply");
            return Optional.empty();
        }
        return reply;
    }

    public Reply createReply(ReplyRequest commentRequest, User postedBy, List<User> mentions) {
        log.debug("Creating reply");
        Reply reply = Reply.builder()
                .message(commentRequest.getMessage())
                .mentions(mentions)
                .postedBy(postedBy)
                .build();
        Reply created_reply = repliesRepository.save(reply);
        log.debug("Reply created");
        return created_reply;
    }

    public List<Reply> getRepliesFromComment(Long commentId) {
        //TODO
        return null;
    }
}
