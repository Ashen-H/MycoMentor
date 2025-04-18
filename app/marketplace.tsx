import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Location from "expo-location";
import * as SecureStore from 'expo-secure-store';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from "axios";

// Define types
interface Listing {
  _id: string;
  title: string;
  description: string;
  mushroomType: string;
  price: number;
  quantity: number;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  location: {
    type: string;
    coordinates: [number, number]; 
  };
  images: string[];
  createdAt: string;
  seller: {
    _id: string;
    fullName: string;
  };
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function MarketplaceScreen() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMapView, setIsMapView] = useState(false);
  const [region, setRegion] = useState({
    latitude: 6.9271,  // Default to Sri Lanka coordinates
    longitude: 79.8612,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  

  // Get user location and fetch listings
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        
        // Get user location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Please enable location services to find nearby mushroom shops."
          );
        } else {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          
          setUserLocation({ latitude, longitude });
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          });
          
          // Fetch nearby listings
          const token = await SecureStore.getItemAsync('userToken');
          if (!token) {
            Alert.alert("Authentication Error", "Please login to continue");
            router.replace("/(public)/login");
            return;
          }
          
          // Using the nearby endpoint to get listings within 20km of the user
          const response = await axios.get(
            `http://20.212.249.149:5000/api/marketplace/nearby/20?latitude=${latitude}&longitude=${longitude}`,
            {
              headers: {
                'x-auth-token': token
              }
            }
          );
          
          setListings(response.data);
          setFilteredListings(response.data);
        }
      } catch (error) {
        console.error('Error initializing marketplace:', error);
        
        // Fallback to getting all listings if nearby listings fails
        try {
          const token = await SecureStore.getItemAsync('userToken');
          if (token) {
            const response = await axios.get('http://20.212.249.149:5000/api/marketplace', {
              headers: {
                'x-auth-token': token
              }
            });
            
            setListings(response.data);
            setFilteredListings(response.data);
          }
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          Alert.alert("Error", "Failed to load marketplace data");
        }
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, []);
  
  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredListings(listings);
    } else {
      const filtered = listings.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.mushroomType.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredListings(filtered);
    }
  }, [searchTerm, listings]);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };
  
  const toggleView = () => {
    setIsMapView(!isMapView);
  };
  
  const goToCreateListing = () => {
    router.push("/create-listing");
  };
  
  const goToListingDetail = (listingId: string) => {
    router.push({
      pathname: "/listing-detail",
      params: { id: listingId }
    });
  };

  const renderListingItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity 
      style={styles.listingCard}
      onPress={() => goToListingDetail(item._id)}
    >
      <View style={styles.imageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.listingImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Ionicons name="image-outline" size={40} color="#ccc" />
          </View>
        )}
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{item.mushroomType}</Text>
        </View>
      </View>
      
      <View style={styles.listingContent}>
        <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.listingPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.listingDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.listingFooter}>
          <Text style={styles.sellerName}>{item.contactName}</Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Marketplace</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6da77f" />
          <Text style={styles.loadingText}>Loading marketplace...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <TouchableOpacity onPress={toggleView}>
          <Ionicons 
            name={isMapView ? "list-outline" : "map-outline"} 
            size={24} 
            color="black" 
          />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search mushrooms..."
          placeholderTextColor="#666"
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>
      
      {/* Content */}
      <View style={styles.contentContainer}>
        {isMapView ? (
          /* Map View */
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={region}
              showsUserLocation
              showsMyLocationButton
            >
              {filteredListings.map((listing) => (
                <Marker
                  key={listing._id}
                  coordinate={{
                    // MongoDB stores as [longitude, latitude]
                    latitude: listing.location.coordinates[1],
                    longitude: listing.location.coordinates[0],
                  }}
                  title={listing.title}
                  description={`${listing.mushroomType} - $${listing.price}`}
                  pinColor="#6da77f"
                >
                  <Callout
                    tooltip
                    onPress={() => goToListingDetail(listing._id)}
                  >
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutTitle}>{listing.title}</Text>
                      <Text style={styles.calloutPrice}>${listing.price.toFixed(2)}</Text>
                      <Text style={styles.calloutType}>{listing.mushroomType}</Text>
                      <Text style={styles.calloutAction}>Tap for details</Text>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
          </View>
        ) : (
          /* List View */
          <FlatList
            data={filteredListings}
            renderItem={renderListingItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="leaf-outline" size={60} color="#ddd" />
                <Text style={styles.emptyText}>No mushrooms found nearby</Text>
                <Text style={styles.emptySubText}>
                  Try adjusting your search or be the first to sell!
                </Text>
              </View>
            }
          />
        )}
      </View>
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={goToCreateListing}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      
      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => router.push("/")}
        >
          <Ionicons name="home-outline" size={24} color="white" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/lessons")}
        >
          <Ionicons name="information-circle-outline" size={24} color="white" />
          <Text style={styles.tabLabel}>Lessons</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-outline" size={24} color="white" />
          <Text style={styles.tabLabel}>User</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  contentContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  calloutContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  calloutPrice: {
    color: "#6da77f",
    fontWeight: "bold",
    fontSize: 14,
  },
  calloutType: {
    color: "#666",
    fontSize: 12,
    marginBottom: 4,
  },
  calloutAction: {
    color: "#1a237e",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  listContainer: {
    padding: 16,
  },
  listingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    height: 180,
    position: "relative",
  },
  listingImage: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  typeTag: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#6da77f",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  typeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  listingContent: {
    padding: 16,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6da77f",
    marginBottom: 8,
  },
  listingDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  listingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sellerName: {
    fontSize: 12,
    color: "#666",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    color: "#666",
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 95,
    backgroundColor: "#6da77f",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#6da77f",
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    paddingTop: 12,
    bottom:-34,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "white",
  },
});