package com.infosys.repository;

import com.infosys.model.ForumComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ForumCommentRepository extends JpaRepository<ForumComment, Long> {
    List<ForumComment> findByPostIdOrderByCreatedAtAsc(Long postId);
    List<ForumComment> findByUserIdOrderByCreatedAtDesc(Long userId);
}