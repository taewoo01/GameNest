import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Nav from './layout/Nav'
import GameList from './pages/GameList'
import Community from './pages/Community'
import News from './pages/News'
// import WriteEditor from './pages/WriteEditor'
import PostDetail from './pages/PostDetail'
import SearchResults from './pages/SearchResults'
import CategoryPage from './pages/CategoryPage'
import GameDetail from './pages/GameDetail'
import MyPosts from './pages/MyPosts'
import MyScraps from './pages/MyScraps'
import LikedGames from './pages/LikedGames'
import MyComments from './pages/MyComments'

function App() {

  return (
    <>
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<GameList/>}/>
        <Route path="/community" element={<Community/>}/>
        <Route path="/news" element={<News/>}/>
        {/* <Route path="/write" element={<WriteEditor/>}/> */}
        <Route path="/community/post/:id" element={<PostDetail/>}/>
        <Route path="/search" element={<SearchResults/>}/>
        <Route path="/category/:categoryType/:categoryValue" element={<CategoryPage/>}/>
        <Route path="/game/:id" element={<GameDetail/>}/>
        <Route path="/myposts" element={<MyPosts/>}/>
        <Route path="/scraps" element={<MyScraps/>}/>
        <Route path="/liked" element={<LikedGames/>}/>
        <Route path="/my-comments" element={<MyComments/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
