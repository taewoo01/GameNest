import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Nav from './layout/Nav'
import GameList from './pages/GameList'
import Community from './pages/Community'
import News from './pages/News'
import WriteEditor from './pages/WriteEditor'
import PostDetail from './pages/PostDetail'
//import SearchResults from './pages/SearchResults'
import CategoryPage from './pages/CategoryPage'
import GameDetail from './pages/GameDetail'
import MyPosts from './pages/MyPosts'
import MyScrapsPage from './pages/MyScraps';
import LikedGames from './pages/LikedGames'
import MyComments from './pages/MyComments'

function App() {

  return (
    <div className="bg-black min-h-screen">
      <Router>
        <Nav />
        <main className="flex-1 container mx-auto p-4">
          <Routes>
              <Route path="/" element={<GameList/>}/>
              <Route path="/community" element={<Community/>}/>
              <Route path="/news" element={<News/>}/>
              <Route path="/write" element={<WriteEditor/>}/>
              <Route path="/community/:id" element={<PostDetail/>}/>
              <Route path="/category/:type/:value" element={<CategoryPage/>}/>
              <Route path="/game/:id" element={<GameDetail/>}/>
              <Route path="/myposts" element={<MyPosts/>}/>
              <Route path="myScrap" element={<MyScrapsPage/>}/>
              <Route path="/likeGame" element={<LikedGames/>}/>
              <Route path="myComment" element={<MyComments/>}/>
          </Routes>
          </main>
      </Router>
    </div>
  )
}

export default App
