import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Location from "expo-location";
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import axios from "axios";

// Define mushroom types
const mushroomTypes = [
  'Shiitake',
  'Portobello',
  'Button',
  'Oyster',
  'Chanterelle',
  'Morel',
  'Porcini',
  'Enoki',
  'Other'
];

export default function CreateListingScreen() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mushroomType: 'Shiitake',
    price: '',
    quantity: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState({
    latitude: 6.9271,  // Default to Sri Lanka coordinates
    longitude: 79.8612,
  });
  const [region, setRegion] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  
  // Get user location and user info when component mounts
  useEffect(() => {
    const init = async () => {
      try {
        // Get user location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to create a listing."
          );
        } else {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          
          setLocation({ latitude, longitude });
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
        
        // Get user info
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
          Alert.alert("Authentication Error", "Please login to continue");
          router.replace("/(public)/login");
          return;
        }
        
        const response = await axios.get('http://192.168.1.200:5001/api/auth/me', {
          headers: {
            'x-auth-token': token
          }
        });
        
        setUserInfo(response.data);
        setFormData(prev => ({
          ...prev,
          contactName: response.data.fullName || '',
        }));
      } catch (error) {
        console.error('Error initializing:', error);
        Alert.alert("Error", "Failed to initialize form data");
      }
    };
    
    init();
    
    // Request camera roll permissions
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to upload images");
      }
    })();
  }, []);
  
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setLocation(coordinate);
  };
  
  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
        aspect: [4, 3],
      });
      
      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert("Error", "Failed to pick images");
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  const handleSubmit = async () => {
    // Validate form
    if (!formData.title) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    
    if (!formData.price || isNaN(Number(formData.price))) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }
    
    if (!formData.quantity || isNaN(Number(formData.quantity))) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }
    
    if (!formData.contactName) {
      Alert.alert("Error", "Please enter your contact name");
      return;
    }
    
    if (!formData.contactPhone) {
      Alert.alert("Error", "Please enter your contact phone number");
      return;
    }
    
    try {
      setLoading(true);
      
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Alert.alert("Authentication Error", "Please login to continue");
        router.replace("/(public)/login");
        return;
      }
      
      // Upload images first if there are any
      let imageUrls: string[] = [];
      
      if (images.length > 0) {
        // In a real application, you would upload the images to your server or a cloud storage service
        // For now, we'll just assume the upload was successful and use the original URIs
        imageUrls = images;
        
        /* 
        // Example image upload code:
        const formData = new FormData();
        images.forEach((uri, index) => {
          const fileType = uri.split('.').pop();
          formData.append('images', {
            uri,
            name: `image_${index}.${fileType}`,
            type: `image/${fileType}`,
          });
        });
        
        const imageUploadResponse = await axios.post(
          'http://192.168.1.200:5001/api/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'x-auth-token': token,
            },
          }
        );
        
        imageUrls = imageUploadResponse.data.urls;
        */
      }
      
      // Create the listing
      const listingData = {
        title: formData.title,
        description: formData.description,
        mushroomType: formData.mushroomType,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail || undefined,
        location: {
          type: "Point",
          coordinates: [location.longitude, location.latitude] // MongoDB uses [longitude, latitude]
        },
        images: imageUrls
      };
      
      const response = await axios.post(
        'http://192.168.1.200:5001/api/marketplace',
        listingData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );
      
      Alert.alert(
        "Success",
        "Your listing has been created!",
        [
          { 
            text: "OK", 
            onPress: () => router.push("/marketplace") 
          }
        ]
      );
    } catch (error) {
      console.error('Error creating listing:', error);
      Alert.alert("Error", "Failed to create your listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Listing</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.formContainer}>
            {/* Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => handleInputChange("title", text)}
                placeholder="Enter a title for your listing"
                placeholderTextColor="#999"
              />
            </View>
            
            {/* Mushroom Type */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mushroom Type *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.mushroomType}
                  onValueChange={(value) => handleInputChange("mushroomType", value)}
                  style={styles.picker}
                >
                  {mushroomTypes.map((type) => (
                    <Picker.Item key={type} label={type} value={type} />
                  ))}
                </Picker>
              </View>
            </View>
            
            {/* Price and Quantity */}
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Price ($) *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(text) => handleInputChange("price", text)}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Quantity *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.quantity}
                  onChangeText={(text) => handleInputChange("quantity", text)}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                />
              </View>
            </View>
            
            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => handleInputChange("description", text)}
                placeholder="Describe your mushrooms..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            {/* Images */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Photos</Text>
              <TouchableOpacity style={styles.photoButton} onPress={pickImages}>
                <Ionicons name="camera" size={24} color="#6da77f" />
                <Text style={styles.photoButtonText}>Add Photos</Text>
              </TouchableOpacity>
              
              {images.length > 0 && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.photoScroll}
                >
                  {images.map((uri, index) => (
                    <View key={index} style={styles.photoContainer}>
                      <Image source={{ uri }} style={styles.photo} />
                      <TouchableOpacity
                        style={styles.removePhotoButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close-circle" size={22} color="#ff3b30" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
            
            {/* Location */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location *</Text>
              <Text style={styles.subLabel}>Tap to set your mushroom sale location</Text>
              
              <MapView
                style={styles.map}
                region={region}
                onPress={handleMapPress}
              >
                <Marker coordinate={location} />
              </MapView>
              
              <Text style={styles.locationText}>
                Latitude: {location.latitude.toFixed(6)}, Longitude: {location.longitude.toFixed(6)}
              </Text>
            </View>
            
            {/* Contact Information */}
            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.contactName}
                  onChangeText={(text) => handleInputChange("contactName", text)}
                  placeholder="Your name"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.contactPhone}
                  onChangeText={(text) => handleInputChange("contactPhone", text)}
                  placeholder="Your phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.contactEmail}
                  onChangeText={(text) => handleInputChange("contactEmail", text)}
                  placeholder="Your email address"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
            
            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Create Listing</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  pickerContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6da77f",
    borderStyle: "dashed",
    paddingVertical: 16,
    marginBottom: 16,
  },
  photoButtonText: {
    fontSize: 16,
    color: "#6da77f",
    marginLeft: 8,
    fontWeight: "500",
  },
  photoScroll: {
    flexDirection: "row",
    marginBottom: 8,
  },
  photoContainer: {
    marginRight: 12,
    position: "relative",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  contactSection: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#6da77f",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});