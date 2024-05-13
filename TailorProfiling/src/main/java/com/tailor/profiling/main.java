/*
 * package com.tailor.profiling;
 * 
 * import java.util.ArrayList;
 * import java.util.HashMap;
 * import java.util.List;
 * 
 * import com.tailor.profiling.models.GraphNode;
 * import com.tailor.profiling.models.Profile;
 * import com.tailor.profiling.models.SubProfile;
 * import com.tailor.profiling.models.SubProfileDefault;
 * import com.tailor.profiling.models.SubProfileLocationWindow;
 * import com.tailor.profiling.models.SubProfileTimeWindow;
 * import com.tailor.profiling.models.SubProfileWeatherWindow;
 * import com.tailor.profiling.services.ConvertService;
 * import com.tailor.profiling.services.ProfileService;
 * import com.tailor.profiling.services.SerializationService;
 * 
 * public class main {
 * public static SubProfileDefault createSubProfileDefault() {
 * HashMap<Long, Float> tagScores = new HashMap<>();
 * 
 * tagScores.put(1L, 100F);
 * tagScores.put(2L, 76F);
 * tagScores.put(3L, 36F);
 * tagScores.put(4L, 3F);
 * 
 * SubProfileDefault default1 = new SubProfileDefault(tagScores, 1F);
 * 
 * return default1;
 * }
 * 
 * public static SubProfileTimeWindow createSubProfileTimeWindow() {
 * HashMap<Long, Float> tagScores1 = new HashMap<>();
 * 
 * tagScores1.put(1L, 100F);
 * tagScores1.put(2L, 76F);
 * tagScores1.put(3L, 36F);
 * tagScores1.put(4L, 3F);
 * 
 * SubProfileDefault default1 = new SubProfileDefault(tagScores1, 50F);
 * 
 * HashMap<Long, Float> tagScores2 = new HashMap<>();
 * tagScores2.put(1L, 100F);
 * tagScores2.put(3L, 24F);
 * tagScores2.put(4L, 1F);
 * tagScores2.put(5L, 1F);
 * 
 * SubProfileDefault default2 = new SubProfileDefault(tagScores2, 40F);
 * 
 * SubProfileTimeWindow time = new SubProfileTimeWindow(50F);
 * time.addSubProfileDefault("LUNDI_MATIN", default1);
 * time.addSubProfileDefault("LUNDI_APREM", default2);
 * 
 * return time;
 * }
 * 
 * public static SubProfileLocationWindow createSubProfileLocationWindow() {
 * HashMap<Long, Float> tagScores3 = new HashMap<>();
 * 
 * tagScores3.put(1L, 10F);
 * tagScores3.put(2L, 30F);
 * tagScores3.put(3L, 50F);
 * tagScores3.put(10L, 10F);
 * 
 * HashMap<Long, Float> tagScores4 = new HashMap<>();
 * 
 * tagScores4.put(1L, 10F);
 * tagScores4.put(30L, 30F);
 * tagScores4.put(41L, 50F);
 * tagScores4.put(10L, 1F);
 * 
 * SubProfileDefault default3 = new SubProfileDefault(tagScores3, 60F);
 * SubProfileDefault default4 = new SubProfileDefault(tagScores4, 31F);
 * 
 * SubProfileLocationWindow loc = new SubProfileLocationWindow(50F);
 * loc.addSubProfileDefault("LYON", default3);
 * loc.addSubProfileDefault("PARIS", default4);
 * 
 * return loc;
 * }
 * 
 * public static SubProfileWeatherWindow createSubProfileWeatherWindow() {
 * HashMap<Long, Float> tagScores5 = new HashMap<>();
 * 
 * tagScores5.put(1L, 10F);
 * tagScores5.put(2L, 30F);
 * tagScores5.put(3L, 50F);
 * tagScores5.put(10L, 10F);
 * 
 * HashMap<Long, Float> tagScores6 = new HashMap<>();
 * 
 * tagScores6.put(1L, 10F);
 * tagScores6.put(30L, 30F);
 * tagScores6.put(41L, 50F);
 * tagScores6.put(10L, 1F);
 * 
 * SubProfileDefault default5 = new SubProfileDefault(tagScores5, 10F);
 * SubProfileDefault default6 = new SubProfileDefault(tagScores6, 12F);
 * 
 * SubProfileWeatherWindow weather = new SubProfileWeatherWindow();
 * weather.addSubProfileDefault("CHAUD", default5);
 * weather.addSubProfileDefault("FROID", default6);
 * 
 * return weather;
 * }
 * 
 * public static void main(String[] args) {
 * SubProfileDefault def = createSubProfileDefault();
 * SubProfileLocationWindow loc = createSubProfileLocationWindow();
 * SubProfileTimeWindow time = createSubProfileTimeWindow();
 * SubProfileWeatherWindow weather = createSubProfileWeatherWindow();
 * 
 * List<Long> tagIds = new ArrayList();
 * tagIds.add(1L);
 * tagIds.add(2L);
 * tagIds.add(3L);
 * tagIds.add(4L);
 * tagIds.add(5L);
 * 
 * 
 * List<SubProfile> subProfiles = new ArrayList<>();
 * subProfiles.add(time);
 * subProfiles.add(loc);
 * subProfiles.add(weather);
 * 
 * Profile profile = new Profile("1", tagIds);
 * profile.setSubProfileLocationWindow(loc);
 * profile.setSubProfileTimeWindow(time);
 * 
 * 
 * // System.out.println("TIME DIMENSION");
 * // System.out.println(time);
 * // System.out.println("\n\n\n\nLOCATION DIMENSION");
 * // System.out.println(loc);
 * // System.out.println("\n\n\n\nWEATHER DIMENSION");
 * // System.out.println(weather);
 * 
 * // long startTime = System.nanoTime();
 * 
 * 
 * ProfileService service = new ProfileService();
 * SubProfile result = service.generateProfileSummary(profile);
 * profile.setSummary(result);
 * System.out.println("\n\n\nResult filtered\n" + result);
 * 
 * 
 * SerializationService serializationService = new SerializationService();
 * List<GraphNode> graph =
 * serializationService.generateGraphRepresentation(profile);
 * graph = new ConvertService().replaceTagIdsByLabels(graph);
 * System.out.println("\n\n\n\nSerialized\n" +
 * serializationService.toJson(graph));
 * // System.out.println(service.getTagsFromProfileSummary(profile, "LYON",
 * // "LUNDI_MATIN"));
 * // SubProfile result = SubProfile.addAllSubProfiles(subProfiles);
 * // SubProfile result = time.filterOnTagThreshold();
 * // SubProfile result = time.filterOnKeyTreshold();
 * // SubProfile result = time.normalize();
 * // SubProfile result = time.addSubProfileWithSameKeys(time);
 * 
 * // long endTime = System.nanoTime();
 * // long duration = (endTime - startTime) / 1000000;
 * 
 * // System.out.println("Duration: " + duration + " ms");
 * 
 * // ConvertService convertService = new ConvertService();
 * // TimeWindow timeWindow =
 * //
 * convertService.convertDateTimeToTimeWindow("2024-05-06T08:05:00.000+2:00");
 * // System.out.println(timeWindow);
 * // String displayName = convertService.convertLatLngToString(1.2379,
 * 116.8529);
 * // System.out.println(displayName);
 * }
 * }
 * /*
 * 1. calcul des 3 profiles SubProfileDefault SubProfileTime SubProfileLocation
 * 2. filtrer avec treshold sur default
 * 3. somme scores pour chaque key de time -> SubProfileTime
 * 4. somme scores pour chaque key de loc -> SubProfileLocation
 * 5. Treshold sur 3. -> SubProfileTime
 * 6. Treshold sur 4. -> SubProfileLocation
 * 7. communion de 5. et 6. -> SubProfileResult(HashMap<Pair<idLoc,
 * idTemps>,SubProfileDefault>)
 */