package com.tailor.profiling.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tailor.profiling.models.SubProfile;

@Repository
public interface SubProfileRepository extends MongoRepository<SubProfile, String> {
}