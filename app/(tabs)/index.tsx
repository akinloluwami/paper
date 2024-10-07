import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { Download, Heart, Image as ImageIcon } from "lucide-react-native";
import { Modalize } from "react-native-modalize";

const WallpaperFeed = () => {
  const [wallpapers, setWallpapers] = useState<string[]>([]);
  const [likedWallpapers, setLikedWallpapers] = useState<number[]>([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<string | null>(
    null
  ); // To store the selected wallpaper on long press
  const [page, setPage] = useState(1);
  const bottomSheetRef = useRef<Modalize>(null);

  useEffect(() => {
    fetchWallpapers();
    loadLikedWallpapers(); // Load liked wallpapers from AsyncStorage
  }, [page]);

  const fetchWallpapers = async () => {
    const newWallpapers = [
      "https://images.hdqwalls.com/download/venom-the-last-dance-cinemark-xd-poster-dq-1080x2400.jpg",
      "https://images.hdqwalls.com/download/minimal-gm-1080x2400.jpg",
      "https://images.hdqwalls.com/download/powerpuff-girls-im-1080x2400.jpg",
    ];
    setWallpapers((prev) => [...prev, ...newWallpapers]);
  };

  const loadLikedWallpapers = async () => {
    try {
      const liked = await AsyncStorage.getItem("likedWallpapers");
      if (liked) {
        setLikedWallpapers(JSON.parse(liked));
      }
    } catch (error) {
      console.error("Failed to load liked wallpapers", error);
    }
  };

  const saveLikedWallpapers = async (updatedLiked: number[]) => {
    try {
      await AsyncStorage.setItem(
        "likedWallpapers",
        JSON.stringify(updatedLiked)
      );
    } catch (error) {
      console.error("Failed to save liked wallpapers", error);
    }
  };

  const lastTap = useRef<number | null>(null);
  const DOUBLE_TAP_DELAY = 300;

  const handleDoubleTap = (index: number) => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
      // This is a double tap
      toggleLike(index);
      lastTap.current = null; // Reset last tap
    } else {
      lastTap.current = now;
    }
  };

  const toggleLike = (index: number) => {
    let updatedLiked = likedWallpapers;
    if (!likedWallpapers.includes(index)) {
      updatedLiked = [...likedWallpapers, index];
    } else {
      updatedLiked = likedWallpapers.filter((item) => item !== index);
    }
    setLikedWallpapers(updatedLiked);
    saveLikedWallpapers(updatedLiked);
  };

  const handleDownload = async (url: string) => {
    // Implement download functionality here
  };

  const handleSetAsWallpaper = (url: string) => {
    // Implement set as wallpaper functionality here
  };

  const handleLongPress = (url: string) => {
    setSelectedWallpaper(url);
    bottomSheetRef.current?.open();
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableWithoutFeedback
        onPress={() => handleDoubleTap(index)}
        onLongPress={() => handleLongPress(item)} // Handle long press to open bottom sheet
      >
        <Image
          source={{ uri: item }}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        />
      </TouchableWithoutFeedback>
      <View className="py-10 flex flex-col items-center gap-y-8 absolute right-5 bottom-14">
        <TouchableOpacity onPress={() => toggleLike(index)}>
          <Heart
            color={likedWallpapers.includes(index) ? "red" : "white"}
            size={30}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDownload(item)}>
          <Download color="white" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSetAsWallpaper(item)}>
          <ImageIcon color="white" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        data={wallpapers}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => setPage((prev) => prev + 1)} // Infinite scroll
        onEndReachedThreshold={0.5}
        pagingEnabled
        snapToInterval={Dimensions.get("window").height}
        decelerationRate="fast"
      />

      {/* Bottom Sheet */}
      <Modalize ref={bottomSheetRef} adjustToContentHeight={true}>
        <View className="p-4">
          <TouchableOpacity
            className="p-4 border-b border-gray-300"
            onPress={() => handleDownload(selectedWallpaper!)}
          >
            <Text className="text-lg text-center">Download</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-4"
            onPress={() => handleSetAsWallpaper(selectedWallpaper!)}
          >
            <Text className="text-lg text-center">Set as Wallpaper</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </>
  );
};

export default WallpaperFeed;
