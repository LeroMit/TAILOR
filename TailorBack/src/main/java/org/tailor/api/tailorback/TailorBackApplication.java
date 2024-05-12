package org.tailor.api.tailorback;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.tailor.api.tailorback.controllers.UsersController;
import org.tailor.api.tailorback.dtos.conversation.ConversationDTO;
import org.tailor.api.tailorback.dtos.conversation.LastConversationMessageDTO;
import org.tailor.api.tailorback.models.*;
import org.tailor.api.tailorback.requests.*;
import org.tailor.api.tailorback.services.*;

@SpringBootApplication
@Slf4j
public class TailorBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(TailorBackApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(
			UserService userService, ConversationService conversationService, DTOMappingService dtoMappingService,
			MessageService messageService, TagService tagService, UserFlickService userFlickService,
			FlickService flickService, UsersController usersController, TailorService tailorService) {
		return args -> {
//			List<Tag> tags = new ArrayList<>();
//			Tag catTag = tagService.createTag(TagRequest.builder().label("cat").build());
//			Tag dogTag = tagService.createTag(TagRequest.builder().label("dog").build());
//			Tag carTag = tagService.createTag(TagRequest.builder().label("car").build());
//			Tag airplaneTag = tagService.createTag(TagRequest.builder().label("airplane").build());
//			tags.add(catTag);
//			tags.add(dogTag);
//			tags.add(carTag);
//			tags.add(airplaneTag);
//
//			List<Long> defaultTags = new ArrayList<>();
//			defaultTags.add(3L);
//			defaultTags.add(4L);
//
//			List<Tag> defaultTagss = new ArrayList<>();
//			defaultTagss.add(carTag);
//			defaultTagss.add(airplaneTag);
//
//			User user1 = userService.createUser(
//					UserRequest.builder().email("jean@mail.com").password("photo").username("test1")
//							.firstName("Mr.Test").defaultTagsIds(defaultTags)
//							.lastName("Jojo").build(),
//					defaultTagss);
//
//			List<Long> catIds = new ArrayList<>();
//			catIds.add(1L);
//			List<Long> dogIds = new ArrayList<>();
//			dogIds.add(2L);
//			List<Long> carIds = new ArrayList<>();
//			carIds.add(3L);
//			List<Long> airplaneIds = new ArrayList<>();
//			airplaneIds.add(4L);
//
//			Flick flick1 = flickService.createFlick(
//					FlickRequest.builder().title("cat1").description("cat").url("cat.com").tagsIds(catIds).creatorId(user1.getId()).build(),
//					user1
//			);
//			Flick flick11 = flickService.createFlick(
//					FlickRequest.builder().title("cat1").description("cat").url("cat.com").tagsIds(catIds).creatorId(user1.getId()).build(),
//					user1
//			);
//			Flick flick12 = flickService.createFlick(
//					FlickRequest.builder().title("cat1").description("cat").url("cat.com").tagsIds(catIds).creatorId(user1.getId()).build(),
//					user1
//			);
//			Flick flick2 = flickService.createFlick(
//					FlickRequest.builder().title("dog1").description("dog").url("dog.com").tagsIds(dogIds).creatorId(user1.getId()).build(),
//					user1
//			);
//			Flick flick22 = flickService.createFlick(
//					FlickRequest.builder().title("dog1").description("dog").url("dog.com").tagsIds(dogIds).creatorId(user1.getId()).build(),
//					user1
//			);
//			Flick flick3 = flickService.createFlick(
//					FlickRequest.builder().title("car1").description("car").url("car.com").tagsIds(carIds).creatorId(user1.getId()).build(),
//					user1
//			);
//			Flick flick4 = flickService.createFlick(
//					FlickRequest.builder().title("airplane1").description("airplane").url("airplane.com").tagsIds(airplaneIds).creatorId(user1.getId()).build(),
//					user1
//			);
//			Flick flick5 = flickService.createFlick(
//					FlickRequest.builder().title("airplane1").description("airplane").url("airplane.com").tagsIds(carIds).creatorId(user1.getId()).build(),
//					user1
//			);
//			Flick flick6 = flickService.createFlick(
//					FlickRequest.builder().title("airplane1").description("airplane").url("airplane.com").tagsIds(airplaneIds).creatorId(user1.getId()).build(),
//					user1
//			);
//			Flick flick7 = flickService.createFlick(
//					FlickRequest.builder().title("airplane1").description("airplane").url("airplane.com").tagsIds(carIds).creatorId(user1.getId()).build(),
//					user1
//			);
//			Flick flick8 = flickService.createFlick(
//					FlickRequest.builder().title("airplane1").description("airplane").url("airplane.com").tagsIds(airplaneIds).creatorId(user1.getId()).build(),
//					user1
//			);
//
//			Flick flick9 = flickService.createFlick(
//					FlickRequest.builder().title("airplane1").description("airplane").url("airplane.com").tagsIds(airplaneIds).creatorId(user1.getId()).build(),
//					user1
//			);
//
//			UserFlick userFlicks1 = userFlickService.createUserFlick(
//					flick1, user1, UserFlickRequest.builder().isLiked(true).isNay(false).watchedDuring(2L).isYay(false).watchedAt("2011-12-03T10:15:30+01:00").isShared(false).latitude("0").longitude("2").build()
//			);
//
//			UserFlick userFlicks2 = userFlickService.createUserFlick(
//					flick11, user1, UserFlickRequest.builder().isLiked(true).isNay(false).watchedDuring(2L).isYay(false).watchedAt("2011-12-03T10:15:30+01:00").isShared(false).latitude("0").longitude("2").build()
//			);
//
//			UserFlick userFlicks3 = userFlickService.createUserFlick(
//					flick12, user1, UserFlickRequest.builder().isLiked(true).isNay(false).watchedDuring(2L).isYay(false).watchedAt("2011-12-03T10:15:30+01:00").isShared(false).latitude("0").longitude("2").build()
//			);
//
//
//			HashMap<Long, Double> tagPonderationMap = new HashMap<>();
//			tagPonderationMap.put(1L, 0.99);
//			tagPonderationMap.put(2L, 0.01);
//			TagPonderationRequest tagPonderationRequest = TagPonderationRequest.builder().tagPonderationMap(tagPonderationMap).build();
//			log.debug("TEST RECO: ", flickService.sendNextFlicksDTO(tagPonderationRequest, user1 , 10L));


			List<Tag> tags = new ArrayList<>();
			tags.add(tagService.createTag(TagRequest.builder().label("bzez").build()));
			tags.add(tagService.createTag(TagRequest.builder().label("Ariana").build()));
			tags.add(tagService.createTag(TagRequest.builder().label("Handicape").build()));
			tags.add(tagService.createTag(TagRequest.builder().label("Roux").build()));
			tags.add(tagService.createTag(TagRequest.builder().label("Football").build()));
			tags.add(tagService.createTag(TagRequest.builder().label("Nature").build()));
			tags.add(tagService.createTag(TagRequest.builder().label("Musique").build()));
			tags.add(tagService.createTag(TagRequest.builder().label("Chat").build()));
			tags.add(tagService.createTag(TagRequest.builder().label("Chien").build()));
			tags.add(tagService.createTag(TagRequest.builder().label("Rap").build()));
			tags.add(tagService.createTag(TagRequest.builder().label("Anime").build()));
			tags.add(tagService.createTag(TagRequest.builder().label("jeux-videos").build()));

			List<Long> defaultTags = new ArrayList<>();
			defaultTags.add(1L);
			defaultTags.add(2L);
			defaultTags.add(3L);
			defaultTags.add(4L);
			defaultTags.add(5L);

			User user1 = userService.createUser(
					UserRequest.builder().email("jean@mail.com").password("photo").username("test1")
							.firstName("Mr.Test").defaultTagsIds(defaultTags)
							.lastName("Jojo").build(),
					tags);
			User user2 = userService.createUser(
					UserRequest.builder().email("jose@mail.com").password("photo2").username("test2")
							.firstName("Mme.Test").defaultTagsIds(defaultTags)
							.lastName("Jaja").build(),
					tags);

			// TailorRequest tailorRequest = TailorRequest.builder()
			// .title("Default tailor")
			// .isLocked(false)
			// .isPublic(false)
			// .isFavourite(false)
			// .build();
			// Optional<Tailor> tailor = tailorService.createTailor(tailorRequest,
			// user1.getId());
			// user1 = userService.updateUserSelectedTailor(user1.getId(),
			// tailor.get().getId());

			if (user1 == null || user2 == null) {
				log.error("Error while creating users");
				return;
			}

			// List<Long> catIds = new ArrayList<>();
			// catIds.add(1L);
			// List<Long> dogIds = new ArrayList<>();
			// dogIds.add(2L);
			// List<Long> carIds = new ArrayList<>();
			// carIds.add(3L);
			// List<Long> airplaneIds = new ArrayList<>();
			// airplaneIds.add(4L);

			// Flick flick1 = flickService.createFlick(
			// FlickRequest.builder().title("cat1").description("cat").url("cat.com").tagsIds(catIds)
			// .creatorId(user1.getId()).build(),
			// user1);
			// Flick flick11 = flickService.createFlick(
			// FlickRequest.builder().title("cat1").description("cat").url("cat.com").tagsIds(catIds)
			// .creatorId(user1.getId()).build(),
			// user1);
			// Flick flick12 = flickService.createFlick(
			// FlickRequest.builder().title("cat1").description("cat").url("cat.com").tagsIds(catIds)
			// .creatorId(user1.getId()).build(),
			// user1);
			// Flick flick2 = flickService.createFlick(
			// FlickRequest.builder().title("dog1").description("dog").url("dog.com").tagsIds(dogIds)
			// .creatorId(user1.getId()).build(),
			// user1);
			// Flick flick22 = flickService.createFlick(
			// FlickRequest.builder().title("dog1").description("dog").url("dog.com").tagsIds(dogIds)
			// .creatorId(user1.getId()).build(),
			// user1);
			// Flick flick3 = flickService.createFlick(
			// FlickRequest.builder().title("car1").description("car").url("car.com").tagsIds(carIds)
			// .creatorId(user1.getId()).build(),
			// user1);
			// Flick flick4 = flickService.createFlick(
			// FlickRequest.builder().title("airplane1").description("airplane").url("airplane.com")
			// .tagsIds(airplaneIds).creatorId(user1.getId()).build(),
			// user1);
			// Flick flick5 = flickService.createFlick(
			// FlickRequest.builder().title("airplane1").description("airplane").url("airplane.com")
			// .tagsIds(carIds).creatorId(user1.getId()).build(),
			// user1);
			// Flick flick6 = flickService.createFlick(
			// FlickRequest.builder().title("airplane1").description("airplane").url("airplane.com")
			// .tagsIds(airplaneIds).creatorId(user1.getId()).build(),
			// user1);
			// Flick flick7 = flickService.createFlick(
			// FlickRequest.builder().title("airplane1").description("airplane").url("airplane.com")
			// .tagsIds(carIds).creatorId(user1.getId()).build(),
			// user1);
			// Flick flick8 = flickService.createFlick(
			// FlickRequest.builder().title("airplane1").description("airplane").url("airplane.com")
			// .tagsIds(airplaneIds).creatorId(user1.getId()).build(),
			// user1);

			// Flick flick9 = flickService.createFlick(
			// FlickRequest.builder().title("airplane1").description("airplane").url("airplane.com")
			// .tagsIds(airplaneIds).creatorId(user1.getId()).build(),
			// user1);

			// UserFlickRequest userFlickRequest =
			// UserFlickRequest.builder().isLiked(true).isNay(false).isShared(false)
			// .isYay(true).latitude("0.0").longitude("0.0").watchedAt("2021-01-01T00:00:00Z").build();
			// userFlickService.createUserFlick(flick1, user1, userFlickRequest);
			// userFlickService.createUserFlick(flick11, user1, userFlickRequest);
			// userFlickService.createUserFlick(flick2, user1, userFlickRequest);
			// userFlickService.createUserFlick(flick12, user1, userFlickRequest);
			// userFlickService.createUserFlick(flick22, user1, userFlickRequest);
			// userFlickService.createUserFlick(flick3, user1, userFlickRequest);
			// userFlickService.createUserFlick(flick4, user1, userFlickRequest);
			// userFlickService.createUserFlick(flick5, user1, userFlickRequest);
			// userFlickService.createUserFlick(flick6, user1, userFlickRequest);
			// userFlickService.createUserFlick(flick7, user1, userFlickRequest);
			// userFlickService.createUserFlick(flick8, user1, userFlickRequest);
			// userFlickService.createUserFlick(flick9, user1, userFlickRequest);

			List<User> userList = new ArrayList<>();
			userList.add(user1);
			userList.add(user2);
			Message message = Message.builder().content("Hello").writtenBy(user1).build();
			message = messageService.createMessage(message);
			Conversation conversation = conversationService.createConversation(userList,
					message);
			user1 = userService.getUser(user1.getId()).get();
			user2 = userService.getUser(user2.getId()).get();
			ConversationDTO conversationDTO = dtoMappingService.toConversationDTO(conversation);
			log.info("Default conversation created with id: " + conversationDTO.toString());
			List<LastConversationMessageDTO> lastConversationMessageDTOList = conversationService
					.getLastConversationsMessagesOfUser(user1);
			log.info("Last conversation messages of user1: " + lastConversationMessageDTOList.toString());
			List<LastConversationMessageDTO> lastConversationMessageDTOList2 = conversationService
					.getLastConversationsMessagesOfUser(user2);
			log.info("Last conversation messages of user2: " + lastConversationMessageDTOList2.toString());
			// Add message from user2
			MessageRequest messageRequest2 = MessageRequest.builder().content("Hello from user2").writtenById(2L)
					.build();
			Message message2 = conversationService.addMessageToConversation(conversation, messageRequest2, user2);
			user1 = userService.getUser(user1.getId()).get();
			user2 = userService.getUser(user2.getId()).get();
			lastConversationMessageDTOList = conversationService.getLastConversationsMessagesOfUser(user1);
			log.info("Last conversation after insertion messages of user1: "
					+ lastConversationMessageDTOList.toString());
			lastConversationMessageDTOList2 = conversationService.getLastConversationsMessagesOfUser(user2);
			log.info("Last conversation after insertion messages of user2: "
					+ lastConversationMessageDTOList2.toString());
		};
	}
}
