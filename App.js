import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Modal, Platform, Pressable, SafeAreaView, ScrollView, Share, StatusBar, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import memeData from "./src/data/memes.json";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

const images = {
  meme1: require("./assets/memes/meme1.png"), meme2: require("./assets/memes/meme2.png"),
  meme3: require("./assets/memes/meme3.png"), meme4: require("./assets/memes/meme4.png"),
  meme5: require("./assets/memes/meme5.png"), meme6: require("./assets/memes/meme6.png"),
  meme7: require("./assets/memes/meme7.png"), meme8: require("./assets/memes/meme8.png"),
  meme9: require("./assets/memes/meme9.png"), meme10: require("./assets/memes/meme10.png"),
  meme11: require("./assets/memes/meme11.png"), meme12: require("./assets/memes/meme12.png")
};
const categories = ["All", ...new Set(memeData.map(m => m.category))];
const STORAGE_KEY = "@meme-discovery/favorites";

function MemeCard({ meme, isFavorite, onOpen, onFavorite }) {
  return <View style={s.card}>
    <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel={`Open ${meme.title}`}>
      <Image source={images[meme.image]} style={s.cardImage} resizeMode="cover" />
      <View style={s.cardText}><Text style={s.tag}>{meme.category.toUpperCase()}</Text><Text style={s.cardTitle}>{meme.title}</Text></View>
    </Pressable>
    <Pressable style={s.heartButton} onPress={onFavorite} accessibilityRole="button" accessibilityLabel="Toggle favorite">
      <Text style={s.heart}>{isFavorite ? "♥" : "♡"}</Text>
    </Pressable>
  </View>;
}

export default function App() {
  const [category, setCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 250));
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (active) { setFavorites(raw ? JSON.parse(raw) : []); setLoading(false); }
      } catch (e) { if (active) { setError(true); setLoading(false); } }
    })();
    return () => { active = false; };
  }, []);

  const saveFavorites = async next => {
    setFavorites(next);
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch (e) { setNotice("Could not save favorites. Check available storage."); }
  };
  const toggleFavorite = id => saveFavorites(favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites, id]);
  const visible = useMemo(() => {
    let list = favoritesOnly ? memeData.filter(m => favorites.includes(m.id)) : memeData;
    if (!favoritesOnly && category !== "All") list = list.filter(m => m.category === category);
    return list;
  }, [category, favoritesOnly, favorites]);

  const retry = async () => {
    setLoading(true); setError(false); setNotice("");
    try { const raw = await AsyncStorage.getItem(STORAGE_KEY); setFavorites(raw ? JSON.parse(raw) : []); setLoading(false); }
    catch (e) { setLoading(false); setError(true); }
  };
  const share = async meme => {
    try { await Share.share({ message: `${meme.title}\n${meme.description}\nSource: ${meme.source}` }); }
    catch (e) { setNotice("Sharing is not available right now."); }
  };
  const download = async meme => {
    try {
      const asset = images[meme.image];
      const source = Image.resolveAssetSource(asset);
      if (Platform.OS === "web") {
        if (typeof document !== "undefined") {
          const a = document.createElement("a"); a.href = source.uri; a.download = `${meme.id}.png`;
          document.body.appendChild(a); a.click(); document.body.removeChild(a); setNotice("Download started.");
        } else setNotice("Download is unavailable here.");
        return;
      }
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) { setNotice("Allow photo-library access to save this meme."); return; }
      const target = `${FileSystem.cacheDirectory}${meme.id}.png`;
      await FileSystem.downloadAsync(source.uri, target);
      await MediaLibrary.saveToLibraryAsync(target);
      setNotice("Meme saved to your photo library.");
    } catch (e) { setNotice("Could not download this meme. Please try again."); }
  };

  return <SafeAreaView style={s.safe}>
    <ExpoStatusBar style="dark" />
    <View style={s.header}>
      <View style={s.brandRow}><View style={s.logo}><Text style={s.logoText}>M</Text></View><View><Text style={s.brand}>meme discovery</Text><Text style={s.subtitle}>A little laugh goes a long way.</Text></View></View>
      <Pressable style={[s.favTab, favoritesOnly && s.favTabOn]} onPress={() => {setFavoritesOnly(!favoritesOnly);setNotice("");}}>
        <Text style={[s.favTabText, favoritesOnly && s.favTabTextOn]}>{favoritesOnly ? "← Browse" : `♥ Favorites (${favorites.length})`}</Text>
      </Pressable>
    </View>
    {!favoritesOnly && <View style={s.categorySection}><Text style={s.sectionTitle}>Find your kind of funny</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.categoryList}>
        {categories.map(c => <Pressable key={c} onPress={() => setCategory(c)} style={[s.chip, category===c && s.chipOn]}><Text style={[s.chipText,category===c&&s.chipTextOn]}>{c}</Text></Pressable>)}
      </ScrollView>
    </View>}
    <View style={s.feedHeading}><View><Text style={s.feedTitle}>{favoritesOnly ? "Your favorites" : category==="All" ? "Fresh laughs" : `${category} memes`}</Text><Text style={s.feedSubtitle}>{visible.length} memes to explore</Text></View><Text style={s.sparkle}>✦</Text></View>
    {loading ? <View style={s.center}><ActivityIndicator size="large" color="#6c4cf1"/><Text style={s.stateText}>Getting the laughs ready…</Text></View>
    : error ? <View style={s.center}><Text style={s.stateEmoji}>☁</Text><Text style={s.stateTitle}>Couldn't load your memes</Text><Text style={s.stateText}>Please check storage access and try again.</Text><Pressable style={s.primary} onPress={retry}><Text style={s.primaryText}>Retry</Text></Pressable></View>
    : visible.length===0 ? <View style={s.center}><Text style={s.stateEmoji}>♡</Text><Text style={s.stateTitle}>Nothing saved yet</Text><Text style={s.stateText}>Tap the heart on any meme to keep it here.</Text><Pressable style={s.primary} onPress={()=>setFavoritesOnly(false)}><Text style={s.primaryText}>Explore memes</Text></Pressable></View>
    : <FlatList key={favoritesOnly ? "favorites" : category} data={visible} keyExtractor={m=>m.id} numColumns={2} contentContainerStyle={s.feed} columnWrapperStyle={s.cardRow} showsVerticalScrollIndicator={false}
      renderItem={({item})=><MemeCard meme={item} isFavorite={favorites.includes(item.id)} onOpen={()=>{setSelected(item);setZoom(false);setNotice("");}} onFavorite={()=>toggleFavorite(item.id)}/>}
      ListFooterComponent={<Text style={s.footer}>Made for your daily dose of joy ✨</Text>}/>}

    <Modal visible={!!selected} animationType="slide" onRequestClose={()=>setSelected(null)}>
      {selected && <SafeAreaView style={s.modalSafe}>
        <View style={s.modalHeader}><Pressable onPress={()=>setSelected(null)}><Text style={s.backText}>‹ Back</Text></Pressable><Text style={s.modalHeaderTitle}>Meme details</Text><Pressable onPress={()=>toggleFavorite(selected.id)}><Text style={s.modalHeart}>{favorites.includes(selected.id)?"♥":"♡"}</Text></Pressable></View>
        <ScrollView contentContainerStyle={s.detail}>
          <Pressable onPress={()=>setZoom(!zoom)} accessibilityRole="button" accessibilityLabel="Toggle image zoom"><Image source={images[selected.image]} resizeMode={zoom?"contain":"cover"} style={[s.detailImage,zoom&&s.zoomImage]}/></Pressable>
          <Text style={s.zoomHint}>Tap image to {zoom?"fit to screen":"zoom in"}</Text>
          <Text style={s.detailCategory}>{selected.category.toUpperCase()}</Text><Text style={s.detailTitle}>{selected.title}</Text><Text style={s.description}>{selected.description}</Text>
          <View style={s.sourceBox}><Text style={s.sourceLabel}>SOURCE</Text><Text style={s.sourceText}>{selected.source}</Text></View>
          <View style={s.actions}>
            <Pressable style={s.action} onPress={()=>toggleFavorite(selected.id)}><Text style={s.actionIcon}>{favorites.includes(selected.id)?"♥":"♡"}</Text><Text style={s.actionText}>{favorites.includes(selected.id)?"Saved":"Favorite"}</Text></Pressable>
            <Pressable style={s.action} onPress={()=>share(selected)}><Text style={s.actionIcon}>↗</Text><Text style={s.actionText}>Share</Text></Pressable>
            <Pressable style={s.action} onPress={()=>download(selected)}><Text style={s.actionIcon}>↓</Text><Text style={s.actionText}>Download</Text></Pressable>
          </View>
          {!!notice && <Text accessibilityRole="alert" style={s.notice}>{notice}</Text>}
        </ScrollView>
      </SafeAreaView>}
    </Modal>
    {!!notice && !selected && <Pressable onPress={()=>setNotice("")} style={s.toast}><Text style={s.toastText}>{notice} ×</Text></Pressable>}
  </SafeAreaView>;
}

const s=StyleSheet.create({
safe:{flex:1,backgroundColor:"#fffaf5",paddingTop:Platform.OS==="android"?StatusBar.currentHeight||0:0},
header:{paddingHorizontal:20,paddingTop:12,paddingBottom:18,flexDirection:"row",justifyContent:"space-between",alignItems:"center",gap:10},
brandRow:{flexDirection:"row",alignItems:"center",gap:10},logo:{width:43,height:43,borderRadius:15,backgroundColor:"#6c4cf1",alignItems:"center",justifyContent:"center"},logoText:{fontSize:26,fontWeight:"900",color:"#fff"},
brand:{fontSize:20,fontWeight:"900",color:"#25213b"},subtitle:{fontSize:11,color:"#88839b",marginTop:2},favTab:{borderRadius:14,borderWidth:1,borderColor:"#e8e2f6",paddingVertical:10,paddingHorizontal:10,backgroundColor:"#fff"},
favTabOn:{backgroundColor:"#6c4cf1",borderColor:"#6c4cf1"},favTabText:{fontWeight:"700",fontSize:12,color:"#6c4cf1"},favTabTextOn:{color:"#fff"},
categorySection:{paddingLeft:20,marginBottom:20},sectionTitle:{fontSize:17,fontWeight:"800",color:"#25213b",marginBottom:12},categoryList:{paddingRight:20,gap:8},
chip:{paddingVertical:10,paddingHorizontal:16,borderRadius:100,backgroundColor:"#fff",borderWidth:1,borderColor:"#eee8f4"},chipOn:{backgroundColor:"#25213b",borderColor:"#25213b"},chipText:{fontSize:13,fontWeight:"700",color:"#625d73"},chipTextOn:{color:"#fff"},
feedHeading:{paddingHorizontal:20,flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:14},feedTitle:{fontSize:24,fontWeight:"900",color:"#25213b"},feedSubtitle:{fontSize:12,color:"#918ba2",marginTop:3},sparkle:{fontSize:26,color:"#ffad5a"},
feed:{paddingHorizontal:14,paddingBottom:28},cardRow:{gap:12,marginBottom:12},card:{flex:1,backgroundColor:"#fff",borderRadius:20,overflow:"hidden",borderWidth:1,borderColor:"#f0eaf3",position:"relative",maxWidth:"50%"},
cardImage:{width:"100%",aspectRatio:1},cardText:{padding:12,paddingTop:10},tag:{fontSize:9,fontWeight:"900",letterSpacing:1,color:"#8b7ce8"},cardTitle:{fontSize:13,fontWeight:"800",color:"#28233d",marginTop:5,lineHeight:18,paddingRight:10},
heartButton:{position:"absolute",right:9,top:9,width:34,height:34,borderRadius:12,backgroundColor:"rgba(255,255,255,0.94)",alignItems:"center",justifyContent:"center"},heart:{fontSize:21,color:"#ed668b"},
footer:{textAlign:"center",color:"#aaa3b6",fontSize:12,paddingVertical:20},center:{flex:1,alignItems:"center",justifyContent:"center",padding:28},stateEmoji:{fontSize:48,color:"#8b7ce8"},stateTitle:{fontSize:20,fontWeight:"800",color:"#25213b",marginTop:10},stateText:{fontSize:14,color:"#827c93",textAlign:"center",marginTop:8,lineHeight:21},
primary:{marginTop:18,backgroundColor:"#6c4cf1",borderRadius:14,paddingHorizontal:24,paddingVertical:12},primaryText:{color:"#fff",fontWeight:"800"},
modalSafe:{flex:1,backgroundColor:"#fffaf5"},modalHeader:{height:60,paddingHorizontal:18,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderBottomWidth:1,borderColor:"#f0eaf3"},backText:{fontSize:16,fontWeight:"700",color:"#6c4cf1"},modalHeaderTitle:{fontSize:16,fontWeight:"800",color:"#25213b"},modalHeart:{fontSize:27,color:"#ed668b"},
detail:{padding:20,paddingBottom:40},detailImage:{width:"100%",aspectRatio:1,borderRadius:22,backgroundColor:"#f1edf8"},zoomImage:{aspectRatio:.8},zoomHint:{fontSize:11,color:"#928aa5",textAlign:"center",marginTop:8},detailCategory:{fontSize:11,fontWeight:"900",letterSpacing:1.2,color:"#8b7ce8",marginTop:22},detailTitle:{fontSize:27,fontWeight:"900",color:"#25213b",marginTop:6},description:{fontSize:15,lineHeight:23,color:"#686278",marginTop:10},sourceBox:{backgroundColor:"#f4f0fb",borderRadius:15,padding:14,marginTop:18},sourceLabel:{fontSize:9,fontWeight:"900",letterSpacing:1.2,color:"#8b7ce8"},sourceText:{fontSize:13,color:"#4f4964",marginTop:5},
actions:{flexDirection:"row",gap:10,marginTop:18},action:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:"#fff",borderWidth:1,borderColor:"#eae3f3",borderRadius:16,paddingVertical:14},actionIcon:{fontSize:23,color:"#6c4cf1"},actionText:{fontSize:12,fontWeight:"800",color:"#514a67",marginTop:4},notice:{fontSize:13,color:"#6c4cf1",marginTop:14,textAlign:"center"},toast:{position:"absolute",bottom:18,left:18,right:18,padding:14,borderRadius:14,backgroundColor:"#25213b"},toastText:{color:"#fff",fontSize:13,textAlign:"center"}
});
