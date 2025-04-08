import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
  Linking,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import MapView, { Marker } from 'react-native-maps';
import axios from "axios";

const { width } = Dimensions.get('window');

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
    coordinates: [number, number]; // [longitude, latitude]
  };
  images: string[];
  createdAt: string;
  seller: {
    _id: string;
    fullName: string;
  };
}

export default function ListingDetailScreen() {
  const params = useLocalSearchParams();
  const listingId = params.id as string;
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
          Alert.alert("Authentication Error", "Please login to continue");
          router.replace("/(public)/login");
          return;
        }
        
        const response = await axios.get(`http://20.212.249.149:5000/api/marketplace/${listingId}`, {
          headers: {
            'x-auth-token': token
          }
        }); 
        
        setListing(response.data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        Alert.alert("Error", "Failed to load listing details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchListing();
  }, [listingId]);

  const handleCall = () => {
    if (listing?.contactPhone) {
      Linking.openURL(`tel:${listing.contactPhone}`);
    }
  };
  
  const handleEmail = () => {
    if (listing?.contactEmail) {
      Linking.openURL(`mailto:${listing.contactEmail}`);
    }
  };

  const handleMessage = () => {
    if (listing?.contactPhone) {
      Linking.openURL(`sms:${listing.contactPhone}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Listing Details</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6da77f" />
          <Text style={styles.loadingText}>Loading listing details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Listing Details</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#ff3b30" />
          <Text style={styles.errorText}>Listing not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Listing Details</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          {listing.images && listing.images.length > 0 ? (
            <>
              <FlatList
                data={listing.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / width);
                  setActiveImageIndex(index);
                }}
                renderItem={({ item }) => (
                  <Image 
                    source={{ uri: item }} 
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              
              {listing.images.length > 1 && (
                <View style={styles.pagination}>
                  {listing.images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.paginationDot,
                        activeImageIndex === index && styles.paginationActiveDot
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={styles.noImageContainer}>
              <Ionicons name="image-outline" size={80} color="#ddd" />
              <Text style={styles.noImageText}>No images available</Text>
            </View>
          )}
        </View>
        
        <View style={styles.contentContainer}>
          {/* Title and Price */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{listing.title}</Text>
            <Text style={styles.price}>${listing.price.toFixed(2)}</Text>
          </View>
          
          {/* Type and Quantity */}
          <View style={styles.infoRow}>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>{listing.mushroomType}</Text>
            </View>
            <Text style={styles.quantity}>
              {listing.quantity} {listing.quantity === 1 ? 'unit' : 'units'} available
            </Text>
          </View>
          
          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>
          
          {/* Seller Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <View style={styles.sellerInfoContainer}>
              <View style={styles.sellerInfoRow}>
                <Ionicons name="person-outline" size={20} color="#666" />
                <Text style={styles.sellerInfoText}>{listing.contactName}</Text>
              </View>
              
              <TouchableOpacity style={styles.sellerInfoRow} onPress={handleCall}>
                <Ionicons name="call-outline" size={20} color="#6da77f" />
                <Text style={styles.sellerInfoLinkText}>{listing.contactPhone}</Text>
              </TouchableOpacity>
              
              {listing.contactEmail && (
                <TouchableOpacity style={styles.sellerInfoRow} onPress={handleEmail}>
                  <Ionicons name="mail-outline" size={20} color="#6da77f" />
                  <Text style={styles.sellerInfoLinkText}>{listing.contactEmail}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <MapView
              style={styles.map}
              region={{
                latitude: listing.location.coordinates[1],
                longitude: listing.location.coordinates[0],
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker 
                coordinate={{
                  latitude: listing.location.coordinates[1],
                  longitude: listing.location.coordinates[0],
                }}
              />
            </MapView>
          </View>
          
          {/* Date */}
          <Text style={styles.dateText}>
            Listed on {new Date(listing.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
      
      {/* Contact Buttons */}
      <View style={styles.contactButtonsContainer}>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={handleMessage}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#6da77f" />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.callButton}
          onPress={handleCall}
        >
          <Ionicons name="call-outline" size={20} color="white" />
          <Text style={styles.callButtonText}>Call Seller</Text>
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
  scrollContainer: {
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#6da77f",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    height: 300,
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  galleryImage: {
    width,
    height: 300,
  },
  pagination: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationActiveDot: {
    backgroundColor: "white",
  },
  noImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    marginTop: 12,
    fontSize: 16,
    color: "#999",
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6da77f",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  typeTag: {
    backgroundColor: "#e9f5ee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  typeText: {
    color: "#6da77f",
    fontWeight: "600",
    fontSize: 14,
  },
  quantity: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  sellerInfoContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
  },
  sellerInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sellerInfoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  sellerInfoLinkText: {
    fontSize: 16,
    color: "#6da77f",
    marginLeft: 12,
  },
  map: {
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#999",
    textAlign: "right",
    marginTop: 16,
  },
  contactButtonsContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "white",
  },
  messageButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6da77f",
    marginRight: 8,
  },
  messageButtonText: {
    color: "#6da77f",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  callButton: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6da77f",
    paddingVertical: 12,
    borderRadius: 8,
  },
  callButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});