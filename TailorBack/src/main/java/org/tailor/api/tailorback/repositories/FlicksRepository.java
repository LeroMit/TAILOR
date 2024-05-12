package org.tailor.api.tailorback.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.tailor.api.tailorback.models.Flick;
import org.tailor.api.tailorback.models.Tag;

import java.util.List;

public interface FlicksRepository extends JpaRepository<Flick, Long> {
    List<Flick> findByTags_Id(Long tagId);

    @Query("SELECT f FROM Flick f " +
            "JOIN f.tags t " +
            "RIGHT JOIN UserFlick uf ON uf.flick = f AND uf.user.id = :userId " +
            "WHERE t.id = :tagId AND uf.user IS NULL")
    Page<Flick> findFlicksWithNoUserFlickForTagAndUser(@Param("userId") Long userId, @Param("tagId") Long tagId, Pageable pageable);

    @Query("SELECT f FROM Flick f WHERE f.id NOT IN :foundFlicksIds AND :tag MEMBER OF f.tags AND f.id NOT IN (SELECT uf.flick.id FROM UserFlick uf WHERE uf.id.userId = :userId)")
    Page<Flick> findFirstByTagIdAndNotInUserFlicks(@Param("tag") Tag tag, @Param("userId") Long userId, @Param("foundFlicksIds")List<Long> foundFlicksIds, Pageable pageable);

    @Query("SELECT f FROM Flick f WHERE f.id NOT IN :foundFlicksIds AND f.id NOT IN (SELECT uf.flick.id FROM UserFlick uf WHERE uf.id.userId = :userId)")
    Page<Flick> findFirstByUserIdAndNotInUserFlicks(@Param("userId") Long userId, @Param("foundFlicksIds")List<Long> foundFlicksIds, Pageable pageable);

}
