package com.infosys.repository;

import com.infosys.model.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    List<ForumPost> findAllByOrderByCreatedAtDesc();
    List<ForumPost> findByCategoryOrderByCreatedAtDesc(String category);
    List<ForumPost> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT p FROM ForumPost p ORDER BY p.likesCount DESC, p.createdAt DESC")
    List<ForumPost> findAllOrderByLikesDesc();
}