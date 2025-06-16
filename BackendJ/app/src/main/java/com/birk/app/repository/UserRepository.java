package com.birk.app.repository;

import com.birk.app.model.Users;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface UserRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByEmail(String email);

    Optional<Users> findByUuid(UUID uuid);

    @Transactional
    @Modifying
    @Query("UPDATE Users u SET u.firstName = ?2, "
            + "u.lastName = ?3, u.username = ?4, u.email = ?5 "
            + "WHERE u.uuid = ?1")
    void updateUser(UUID uuid, String firstName, String lastName, String username, String email);

    @Transactional
    @Modifying
    @Query("UPDATE Users u " + "SET u.enabled = TRUE " + "WHERE u.email = ?1")
    void enableUser(String email);

    @Transactional
    @Modifying
    void deleteByUuid(UUID uuid);
}
