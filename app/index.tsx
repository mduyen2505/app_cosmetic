import React, { useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import Header from "../components/Header";
import SidebarMenu from "../components/SidebarMenu";
import HomeBanner from "../components/HomeBanner"; // Import the banner component

export default function HomeScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true); // Open sidebar when menu icon is clicked
  const closeSidebar = () => setIsSidebarOpen(false); // Close sidebar when clicking elsewhere

  return (
    <TouchableWithoutFeedback onPress={() => {
      if (isSidebarOpen) closeSidebar(); // Close sidebar only if it's open
      Keyboard.dismiss(); // Dismiss keyboard when tapping outside
    }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <Header toggleSidebar={openSidebar} />

        {/* Sidebar Menu */}
        <SidebarMenu isOpen={isSidebarOpen} toggleSidebar={closeSidebar} />

        {/* Banner below Header */}
        <HomeBanner />

        {/* Other content can be added here */}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
