import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

// Define lesson categories and content
const LESSONS = [
  {
    id: 1,
    title: "Mushroom Basics",
    icon: "leaf-outline" as IconName,
    color: "#4CAF50",
    lessons: [
      {
        id: 101,
        title: "What are Mushrooms?",
        duration: "5 min read",
        content: `Mushrooms are the fruiting bodies of fungi, which are organisms that are neither plants nor animals. Unlike plants, fungi cannot produce their own food through photosynthesis.

Fungi consist of thread-like structures called mycelium that grow underground or within their food source. When conditions are right, the mycelium produces fruiting bodies called mushrooms, which release spores for reproduction.

Key characteristics of mushrooms:
• They are decomposers that break down dead organic matter
• They reproduce through spores rather than seeds
• They have cell walls made of chitin (similar to insect exoskeletons) rather than cellulose
• They obtain nutrients by absorption rather than photosynthesis

Mushrooms play critical roles in ecosystems as decomposers, helping to recycle nutrients in the environment.`,
      },
      {
        id: 102,
        title: "Mushroom Life Cycle",
        duration: "6 min read",
        content: `The life cycle of a mushroom has several distinct stages:

1. Spore Germination: Microscopic spores land on a suitable substrate and germinate, producing tiny thread-like structures called hyphae.

2. Mycelium Growth: The hyphae grow and branch, forming a network called mycelium. This is the main body of the fungus and can spread extensively through soil or other substrates.

3. Primordium Formation: When environmental conditions are favorable (proper humidity, temperature, and sometimes light), the mycelium forms compact structures called primordia or "pins" - the beginnings of mushrooms.

4. Fruiting Body Development: The primordia grow and develop into mature mushrooms with caps, stems, and gills (in many species).

5. Spore Release: The mature mushroom releases millions of spores from structures typically located on gills under the cap.

6. Cycle Continues: The released spores travel to new locations where they can germinate and start the cycle again.

The entire life cycle can take anywhere from days to months depending on the species and environmental conditions.`,
      },
      {
        id: 103,
        title: "Mushroom Anatomy",
        duration: "4 min read",
        content: `A typical mushroom consists of several key parts:

1. Cap (Pileus): The umbrella-like top of the mushroom that protects the spore-producing structures underneath.

2. Gills (Lamellae): Thin, paper-like structures under the cap where spores are produced. Not all mushrooms have gills—some have pores, teeth, or other structures.

3. Stem (Stipe): The stalk-like structure that supports the cap.

4. Veil: A tissue that protects the gills in young mushrooms of certain species. It may remain as a ring (annulus) around the stem or as fragments on the cap.

5. Volva: A cup-like structure at the base of some mushrooms, formed from universal veil remnants.

6. Mycelium: The underground network of thread-like hyphae that makes up the main body of the fungus.

Different mushroom species may have variations or completely different structures. These anatomical features are important for identification and classification.`,
      },
    ],
  },
  {
    id: 2,
    title: "Cultivation Techniques",
    icon: "fitness-outline" as IconName,
    color: "#FF9800",
    lessons: [
      {
        id: 201,
        title: "Substrate Preparation",
        duration: "7 min read",
        content: `Proper substrate preparation is crucial for successful mushroom cultivation:

Substrate Selection:
Different mushrooms prefer different growing media. Common substrates include:
• Straw: Used for oyster mushrooms
• Sawdust: Ideal for shiitake and lion's mane
• Compost: Used for button mushrooms
• Logs: Natural substrate for shiitake and other wood-loving species

Preparation Steps:
1. Chopping: Cut substrate materials into small pieces to increase surface area.

2. Hydration: Soak the substrate to achieve optimal moisture content (usually 65-75%).

3. Sterilization or Pasteurization:
   • Sterilization (for sawdust, grain, etc.): Use a pressure cooker at 15 PSI for 1.5-2.5 hours
   • Pasteurization (for straw): Submerge in hot water (65-80°C/149-176°F) for 1-2 hours

4. Cooling: Allow substrate to cool to room temperature before spawning.

5. pH Adjustment: Some substrates might need pH adjustment (typically 6-8 is ideal).

The goal is to create a nutritious, clean environment where your mushroom mycelium can thrive while minimizing contamination risks from competing organisms.`,
      },
      {
        id: 202,
        title: "Spawn Run & Fruiting",
        duration: "8 min read",
        content: `After preparing your substrate, the next phases are spawn run and fruiting:

Spawn Run Phase:
1. Inoculation: Mix mushroom spawn (mycelium-colonized grain or other material) with the prepared substrate.

2. Incubation: Place in a dark, warm environment:
   • Temperature: Usually 21-27°C (70-80°F), varies by species
   • Humidity: Moderate (50-70%)
   • Duration: 10-30 days, depending on species and conditions

3. Colonization: During this time, mycelium will spread throughout the substrate. The substrate should turn white as it becomes fully colonized.

Fruiting Phase:
Once the substrate is fully colonized, trigger fruiting by changing environmental conditions:

1. Fruiting Triggers:
   • Temperature drop: Often 5-10°F lower than spawn run
   • Fresh air: Increase air exchange significantly
   • Light: Introduce indirect light (12 hours on/off)
   • High humidity: 85-95%

2. Pinning: Small mushroom primordia (pins) will form. Maintain high humidity during this critical phase.

3. Fruiting: Pins will develop into mature mushrooms over several days to weeks.

4. Harvesting: Harvest when caps are still slightly curved downward for most species.

5. Additional Flushes: After harvesting, many substrates will produce 2-4 flushes of mushrooms with rest periods in between.

Each mushroom species has specific requirements, so adjust conditions according to the species you're growing.`,
      },
      {
        id: 203,
        title: "Common Cultivation Problems",
        duration: "6 min read",
        content: `Even experienced growers encounter problems. Here are common issues and solutions:

Contamination:
• Green mold (Trichoderma): Often appears as green patches. Prevention: proper sterilization, clean techniques.
• Black mold: Various dark-colored molds. Solution: improve air circulation, maintain proper humidity.
• Bacteria: Often appears slimy or smells bad. Prevention: proper substrate preparation and moisture management.

Growth Issues:
• Slow colonization: Usually caused by low temperatures or old spawn. Solution: increase temperature, use fresh spawn.
• Overlay: Mycelium becomes thick and doesn't fruit. Solution: lower temperature, increase FAE (Fresh Air Exchange).
• Leggy/stemmy mushrooms: Caused by inadequate fresh air. Solution: increase ventilation.

Fruiting Problems:
• No fruiting: Check for improper temperatures, lack of light, or missing cold shock.
• Aborted pins: Often caused by fluctuating humidity or temperature. Maintain stable conditions.
• Small yields: Usually nutrition or moisture related. Ensure proper substrate formulation and hydration.

Environmental Issues:
• Low humidity: Use humidifiers or misting systems to increase humidity.
• Too much moisture: Causes bacterial contamination. Improve air circulation.
• Poor ventilation: Results in high CO₂ levels. Increase fresh air exchange.

Regular monitoring and timely adjustments will help prevent many of these common problems.`,
      },
    ],
  },
  {
    id: 3,
    title: "Mushroom Types",
    icon: "apps-outline" as IconName,
    color: "#9C27B0",
    lessons: [
      {
        id: 301,
        title: "Culinary Mushrooms",
        duration: "5 min read",
        content: `Popular edible mushrooms for cultivation and consumption:

Button/White Mushroom (Agaricus bisporus):
• Most commonly consumed mushroom worldwide
• Mild flavor that intensifies when cooked
• Cultivated on composted substrate
• Same species as cremini and portobello (different growth stages)

Shiitake (Lentinula edodes):
• Rich, umami flavor with meaty texture
• Traditionally grown on hardwood logs
• Also cultivated on supplemented sawdust blocks
• Contains lentinan, which has potential health benefits

Oyster Mushroom (Pleurotus species):
• Fast-growing and beginner-friendly
• Delicate flavor with velvety texture
• Comes in various colors (gray, pink, yellow, blue)
• Can grow on many substrates including straw and coffee grounds

King Oyster (Pleurotus eryngii):
• Thick, meaty stem with mild flavor
• Popular meat substitute in vegetarian dishes
• Requires more specific growing conditions than regular oysters

Lion's Mane (Hericium erinaceus):
• Unique appearance with tooth-like structures
• Seafood-like flavor reminiscent of crab or lobster
• Growing in popularity due to potential cognitive health benefits
• Grows on hardwood substrates

Enoki (Flammulina velutipes):
• Long, thin stems with small caps
• Crisp texture and mild flavor
• Commercially grown in bottles with limited light to achieve long stems
• Popular in East Asian cuisine

Each variety requires slightly different growing conditions and culinary applications, making mushroom cultivation an exciting and diverse hobby.`,
      },
      {
        id: 302,
        title: "Medicinal Mushrooms",
        duration: "6 min read",
        content: `Mushrooms with traditionally recognized or scientifically studied health benefits:

Reishi (Ganoderma lucidum):
• Known as the "mushroom of immortality" in traditional Chinese medicine
• Contains triterpenes and beta-glucans
• Used to support immune function and stress response
• Typically prepared as a tea or tincture rather than eaten whole

Turkey Tail (Trametes versicolor):
• Contains polysaccharide-K (PSK) and polysaccharide peptide (PSP)
• Used in Japan alongside conventional cancer treatments
• Striking multicolored appearance resembling turkey feathers
• Grows on dead wood and stumps

Chaga (Inonotus obliquus):
• Grows primarily on birch trees in cold climates
• High in antioxidants and melanin
• Traditionally used in Russian and Northern European folk medicine
• Prepared as a tea or extract

Cordyceps (Cordyceps militaris, Cordyceps sinensis):
• Known for potential benefits for energy and stamina
• Contains cordycepin and other bioactive compounds
• Wild C. sinensis is extremely rare and expensive
• C. militaris is more commonly cultivated

Lion's Mane (Hericium erinaceus):
• Contains compounds that may support nerve growth factor (NGF)
• Studied for potential cognitive and neurological benefits
• Dual-purpose mushroom: both medicinal and culinary
• Distinctive appearance with cascading "teeth" instead of gills

Maitake (Grifola frondosa):
• Known as "hen of the woods" due to its appearance
• Contains beta-glucans that may support immune function
• Delicious culinary mushroom with potential health benefits
• Grows at the base of oak trees

Research on medicinal mushrooms is ongoing, and while traditional uses are well-documented, scientific confirmation of all purported benefits is still developing.`,
      },
      {
        id: 303,
        title: "Wild Mushrooms & Safety",
        duration: "7 min read",
        content: `Important safety information about wild mushroom identification:

Golden Rules of Foraging:
• Never eat any mushroom you cannot identify with 100% certainty
• Learn from experts through hands-on field experiences
• Always use multiple identification features, not just one characteristic
• When in doubt, throw it out
• Start with easily identifiable species with few dangerous look-alikes

Identification Features:
• Cap: Shape, color, texture, and size
• Gills/Pores: Arrangement, color, attachment to stem
• Stem: Presence of a ring or volva, texture, color
• Spore Print: Color of spores when deposited on paper
• Habitat: Where it grows (wood, grass, etc.)
• Smell and taste (only taste and spit out - never swallow unknowns)

Dangerous Look-alikes:
• Death Cap (Amanita phalloides): Resembles some edible mushrooms but contains deadly amatoxins
• False Morels: Can be confused with true morels but contain gyromitrin toxins
• Jack O'Lantern: Orange glow can be mistaken for edible Chanterelles
• Little Brown Mushrooms (LBMs): Many small brown mushrooms look similar but include deadly species

Resources for Identification:
• Join local mycological societies
• Use multiple field guides specific to your region
• Consider apps as supplementary tools only, never as definitive identification
• Have identifications confirmed by experts

Never rely on single identification methods or shortcuts. Proper identification requires careful observation of multiple characteristics and experience.`,
      },
    ],
  },
  {
    id: 4,
    title: "Sustainable Practices",
    icon: "leaf-outline" as IconName,
    color: "#2196F3",
    lessons: [
      {
        id: 401,
        title: "Eco-Friendly Growing",
        duration: "5 min read",
        content: `Mushroom cultivation can be one of the most sustainable forms of food production:

Waste Stream Utilization:
• Agricultural waste: Straw, corn cobs, coffee grounds
• Forestry byproducts: Sawdust, wood chips, paper waste
• Food processing waste: Spent brewery grains, cottonseed hulls
By using these waste materials as substrates, mushroom cultivation helps divert waste from landfills.

Resource Efficiency:
• Water usage: Mushrooms require significantly less water than most vegetables
• Space efficiency: Can be grown vertically with high yields per square foot
• Energy: Many species can be grown at room temperature without special lighting
• Time: Fast growth cycle compared to many other crops (weeks vs. months)

Closed-Loop Systems:
• Spent mushroom substrate makes excellent compost
• Can be used as a soil amendment or worm food
• Supports garden vegetable production creating a circular system

Carbon Footprint:
• Low carbon footprint compared to animal proteins
• Local production reduces transportation emissions
• Potential to recycle carbon from waste materials

Regenerative Applications:
• Mycoremediation: Using fungi to clean contaminated soils
• Mycopesticides: Fungi as natural pest control
• Mycomaterials: Using mycelium to create sustainable packaging and building materials

When designing your cultivation setup, consider how you can incorporate these sustainable practices to minimize environmental impact while maximizing production.`,
      },
      {
        id: 402,
        title: "Mycelium as Material",
        duration: "4 min read",
        content: `Beyond food production, mushroom mycelium has exciting applications as a sustainable material:

Packaging Materials:
• Companies now produce protective packaging from mycelium bound to agricultural waste
• Fully home-compostable alternative to styrofoam
• Custom moldable to any shape
• Naturally fire-resistant without chemical additives

Construction & Design:
• Acoustic panels and insulation
• Lightweight bricks and building materials
• Furniture and interior design elements
• Naturally water-resistant when properly treated

Textiles & Leather Alternatives:
• Mycelium-based leather substitutes
• Potential for clothing and accessories
• Biodegradable alternative to petroleum-based synthetics

Benefits over Traditional Materials:
• Renewable resource grown in weeks rather than years
• Compostable at end of life
• Carbon-sequestering during production
• Minimal energy requirements for production
• Can utilize local agricultural waste

DIY Applications:
• Small-scale mycelium material experiments can be done at home
• Requires similar cultivation techniques as growing mushrooms
• Special strains selected for strength rather than fruiting capacity

This emerging field of "mycomaterials" represents a promising intersection of biology and materials science with significant potential for sustainable innovation.`,
      },
      {
        id: 403,
        title: "Mycoremediation",
        duration: "6 min read",
        content: `Mycoremediation is the practice of using fungi to clean up environmental contaminants:

How It Works:
Fungi produce powerful enzymes that can break down complex compounds:
• Lignin-degrading enzymes break down wood and similar chemicals
• These same enzymes can break down petroleum products, pesticides, and more
• Different mushroom species target different contaminants

Key Applications:
• Soil Remediation: Cleaning soil contaminated with oils, pesticides, or industrial chemicals
• Water Filtration: Mycelium can filter pathogens and chemicals from water
• Agricultural Runoff: Processing excess nutrients and agricultural chemicals
• Disaster Response: Oil spill cleanup and toxic waste management

Effective Mushroom Species:
• Oyster mushrooms (Pleurotus): Petroleum products, PAHs
• Turkey Tail (Trametes versicolor): Various toxins and some heavy metals
• Garden Giant (Stropharia rugosoannulata): E. coli and agricultural runoff
• King Stropharia: Garden and agricultural applications

Implementation Methods:
• Mycofiltration: Using mycelium as a filter for water
• Soil application: Mixing spawn with contaminated soil
• Mycobooms: Straw rafts colonized with mycelium to capture contaminants

Limitations:
• Not effective for all types of contamination
• Results can vary based on conditions
• Some toxins may concentrate in the fruiting bodies

This emerging field combines ecological restoration with mushroom cultivation techniques, offering sustainable solutions to environmental challenges.`,
      },
    ],
  },
];

export default function LessonsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  const handleBack = () => {
    if (selectedLesson) {
      setSelectedLesson(null);
    } else if (selectedCategory !== null) {
      setSelectedCategory(null);
    } else {
      router.back();
    }
  };

  const renderCategoryList = () => (
    <ScrollView style={styles.categoryContainer}>
      {LESSONS.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[styles.categoryCard, { borderLeftColor: category.color }]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <View
            style={[
              styles.categoryIconContainer,
              { backgroundColor: category.color },
            ]}
          >
            <Ionicons name={category.icon} size={24} color="white" />
          </View>
          <View style={styles.categoryTextContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categorySubtitle}>
              {category.lessons.length} lessons
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderLessonList = () => {
    const category = LESSONS.find((c) => c.id === selectedCategory);
    if (!category) return null;

    return (
      <View style={styles.lessonListContainer}>
        <View
          style={[styles.categoryHeader, { backgroundColor: category.color }]}
        >
          <Ionicons name={category.icon} size={32} color="white" />
          <Text style={styles.categoryHeaderTitle}>{category.title}</Text>
        </View>

        <ScrollView style={styles.lessonList}>
          {category.lessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => setSelectedLesson(lesson)}
            >
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <View style={styles.lessonMeta}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6da77f" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderLessonContent = () => {
    if (!selectedLesson) return null;

    return (
      <View style={styles.lessonContentContainer}>
        <ScrollView style={styles.lessonContent}>
          <Text style={styles.lessonContentTitle}>{selectedLesson.title}</Text>

          <View style={styles.lessonMetaDetail}>
            <View style={styles.lessonMetaItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.lessonMetaText}>
                {selectedLesson.duration}
              </Text>
            </View>
          </View>

          <Text style={styles.lessonContentText}>{selectedLesson.content}</Text>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
        {/* Background Mushroom Image */}
    <Image
      source={require("../assets/images/mushroom-img.png")}
      style={styles.mushroomBackground}
      resizeMode="contain"
    />
      {/* Header */}
      
      <View style={styles.header}>
       
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedLesson
            ? selectedLesson.title
            : selectedCategory !== null
            ? LESSONS.find((c) => c.id === selectedCategory)?.title || "Lessons"
            : "Mushroom Lessons"}
        </Text>
      </View>

      {/* Content based on navigation state */}
      {selectedLesson
        ? renderLessonContent()
        : selectedCategory !== null
        ? renderLessonList()
        : renderCategoryList()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mushroomBackground: {
    position: "absolute",
    top: 550,
    zIndex: 0,
    right: 0,

  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  // Category list styles
  categoryContainer: {
    flex: 1,
    padding: 16,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 14,
    color: "#666",
  },
  // Lesson list styles
  lessonListContainer: {
    flex: 1,
  },
  categoryHeader: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryHeaderTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  lessonList: {
    padding: 16,
  },
  lessonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  lessonMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  lessonDuration: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  // Lesson content styles
  lessonContentContainer: {
    flex: 1,
  },
  lessonContent: {
    padding: 16,
  },
  lessonContentTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  lessonMetaDetail: {
    flexDirection: "row",
    marginBottom: 20,
  },
  lessonMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  lessonMetaText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  lessonContentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});
