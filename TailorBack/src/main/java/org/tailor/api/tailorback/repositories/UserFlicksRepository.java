package org.tailor.api.tailorback.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.models.UserFlick;
import org.tailor.api.tailorback.models.UserFlickKey;

import java.util.List;
import java.util.Optional;

public interface UserFlicksRepository extends JpaRepository<UserFlick, UserFlickKey> {
    List<UserFlick> findUserFlicksByUserId(Long user);

    @Query(value = "SELECT uf FROM UserFlick uf WHERE uf.id.userId = :user ORDER BY uf.watchedAt")
    Page<UserFlick> findUserFlicksByUserIdLimit(@Param("user") Long user,
                        Pageable pageable);

    @Query("SELECT uf FROM UserFlick uf WHERE uf.id.userId = :user ORDER BY uf.watchedAt")
    Page<UserFlick> findByUserIdOrderedByWatchedAt(@Param("user") Long user, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM UserFlick uf WHERE uf.id.userId = :user")
    int countByUserId(@Param("user") Long user);

    Optional<UserFlick> findUserFlickByFlickIdAndUserId(Long flickId, Long userId);
}
