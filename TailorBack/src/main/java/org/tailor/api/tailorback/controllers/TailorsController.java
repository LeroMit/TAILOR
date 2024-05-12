package org.tailor.api.tailorback.controllers;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tailor.api.tailorback.dtos.TailorDTO;
import org.tailor.api.tailorback.models.Tailor;
import org.tailor.api.tailorback.requests.TailorRequest;
import org.tailor.api.tailorback.services.DTOMappingService;
import org.tailor.api.tailorback.services.TailorService;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
@Slf4j
public class TailorsController {
    @Autowired
    TailorService tailorService;

    @Autowired
    DTOMappingService dtoMappingService;

    @GetMapping("/tailors")
    public ResponseEntity<List<TailorDTO>> getTailors() {
        log.info("Getting tailors");
        List<Tailor> tailors = tailorService.findAll();
        if (tailors.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        List<TailorDTO> tailorDTOS = tailorService.listTailorToListTailorDTO(tailors);
        return ResponseEntity.ok(tailorDTOS);
    }

    @GetMapping("tailor/{tailorId}")
    public ResponseEntity<TailorDTO> getTailor(@PathVariable(value = "tailorId") Long tailorId) {
        Tailor tailor = tailorService.getTailor(tailorId).orElse(null);
        if (tailor == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(dtoMappingService.toTailorDTO(tailor));
    }

    @GetMapping("tailor/json/{tailorId}")
    public ResponseEntity<String> getTailorJson(@PathVariable(value = "tailorId") Long tailorId) {
        String json = tailorService.getTailorJson(tailorId);
        if (json == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(json);
    }

    @GetMapping("/user/{userId}/tailors")
    public ResponseEntity<List<TailorDTO>> getTailorsByUser(@PathVariable(value = "userId") Long userId) {
        List<Tailor> tailors = tailorService.getTailorsByUser(userId).orElse(null);
        if (tailors == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(tailorService.listTailorToListTailorDTO(tailors));
    }

    @PostMapping("/user/{userId}/tailor")
    public ResponseEntity<TailorDTO> createTailor(@PathVariable(value = "userId") Long userId , @Valid @RequestBody TailorRequest tailor) {
        Tailor createdTailor = tailorService.createTailor(tailor, userId).orElse(null);
        if (createdTailor == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(dtoMappingService.toTailorDTO(createdTailor));
    }
}
